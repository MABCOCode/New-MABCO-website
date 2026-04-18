import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, XCircle } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import translations from "../../../i18n/translations";
import ProductCard from "../../products/components/ProductCard";
import { getProductRef } from "../../../utils/entityRefs";

type SearchCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type SearchBrand = {
  id: string;
  nameEn: string;
  nameAr: string;
  categoryIds: string[];
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

const pickLocalizedStaticName = (value: any, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.en || value.ar || fallback;
  return fallback;
};

const normalizeText = (value: unknown) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const getProductName = (product: any, language: "ar" | "en") => {
  if (language === "ar") {
    return product?.nameAr || product?.name?.ar || product?.name || "";
  }
  return product?.name?.en || product?.name || product?.nameAr || "";
};

const getProductSpecsText = (product: any) => {
  const specs = Array.isArray(product?.specs) ? product.specs : [];
  return specs
    .flatMap((spec: any) => [
      spec?.title,
      spec?.titleAr,
      spec?.nameEn,
      spec?.nameAr,
      spec?.value,
      spec?.valueAr,
      spec?.valueEn,
    ])
    .filter(Boolean)
    .join(" ");
};

const getSearchScore = (product: any, query: string) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const sku = normalizeText(product?.stk_code || product?.id);
  const nameEn = normalizeText(product?.name?.en || product?.name);
  const nameAr = normalizeText(product?.nameAr || product?.name?.ar);
  const brand = normalizeText(product?.brand);
  const category = normalizeText(product?.category || product?.categoryAr);
  const description = normalizeText(
    [product?.description, product?.descriptionAr, getProductSpecsText(product)].filter(Boolean).join(" "),
  );

  let score = 0;

  if (sku === normalizedQuery) score += 300;
  else if (sku.startsWith(normalizedQuery)) score += 180;
  else if (sku.includes(normalizedQuery)) score += 120;

  const exactName = nameEn === normalizedQuery || nameAr === normalizedQuery;
  const startsName = nameEn.startsWith(normalizedQuery) || nameAr.startsWith(normalizedQuery);
  const includesName = nameEn.includes(normalizedQuery) || nameAr.includes(normalizedQuery);
  if (exactName) score += 260;
  else if (startsName) score += 180;
  else if (includesName) score += 120;

  if (brand.includes(normalizedQuery)) score += 50;
  if (category.includes(normalizedQuery)) score += 40;
  if (description.includes(normalizedQuery)) score += 35;

  tokens.forEach((token) => {
    if (nameEn.includes(token) || nameAr.includes(token)) score += 25;
    if (sku.includes(token)) score += 35;
    if (brand.includes(token)) score += 12;
    if (category.includes(token)) score += 10;
    if (description.includes(token)) score += 8;
  });

  return score;
};

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const { language } = useLanguage();
  const t = translations[language];
  const { addToCart, openCart } = useCart();
  const [compareItems, setCompareItems] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState(searchQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [brands, setBrands] = useState<SearchBrand[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    let mounted = true;

    const loadStaticFilters = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/static/categories.json"),
          fetch("/static/brands.json"),
        ]);
        const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : [];
        const brandsJson = brandsRes.ok ? await brandsRes.json() : [];
        if (!mounted) return;

        const nextCategories = (Array.isArray(categoriesJson) ? categoriesJson : [])
          .map((category: any) => ({
            id: String(category?.cat_code || category?._id || ""),
            nameEn: pickLocalizedStaticName(
              category?.nameEn || category?.name?.en || category?.name || category?.name_en || category?.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              category?.nameAr || category?.name?.ar || category?.name || category?.name_ar || category?.name_en,
              "",
            ),
          }))
          .filter((category) => category.id);

        const nextBrands = (Array.isArray(brandsJson) ? brandsJson : [])
          .map((brand: any) => ({
            id: String(brand?.brand_code || brand?._id || ""),
            nameEn: pickLocalizedStaticName(
              brand?.englishName || brand?.nameEn || brand?.name?.en || brand?.name || brand?.name_en || brand?.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              brand?.nameAr || brand?.name?.ar || brand?.name || brand?.name_ar || brand?.name_en,
              "",
            ),
            categoryIds: Array.isArray(brand?.categoryIds)
              ? brand.categoryIds.map(String)
              : [String(brand?.category_code || brand?.cat_code || "")].filter(Boolean),
          }))
          .filter((brand) => brand.id);

        setCategories(nextCategories);
        setBrands(nextBrands);
      } catch {
        if (!mounted) return;
        setCategories([]);
        setBrands([]);
      }
    };

    loadStaticFilters();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        params.set("limit", "500");
        params.set("card", "1");
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedCategory) params.set("cat_code", selectedCategory);
        if (selectedBrand) params.set("brand_code", selectedBrand);

        const res = await fetch(`${API_BASE}/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load search results");
        const json = await res.json();
        if (!mounted) return;
        setProducts(Array.isArray(json?.data) ? json.data : []);
      } catch (error: any) {
        if (!mounted) return;
        setProducts([]);
        setLoadError(error?.message || "Failed to load search results");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [searchQuery, selectedCategory, selectedBrand]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const brandMap = useMemo(
    () => new Map(brands.map((brand) => [brand.id, brand])),
    [brands],
  );

  const visibleCategories = useMemo(() => {
    const categoryIds = new Set(
      products
        .map((product) => String(product?.cat_code || ""))
        .filter(Boolean),
    );
    return categories.filter((category) => categoryIds.has(category.id));
  }, [categories, products]);

  const visibleBrands = useMemo(() => {
    const brandIds = new Set(
      products
        .map((product) => String(product?.brand_code || ""))
        .filter(Boolean),
    );
    return brands.filter((brand) => {
      if (!brandIds.has(brand.id)) return false;
      if (!selectedCategory) return true;
      return brand.categoryIds.includes(selectedCategory);
    });
  }, [brands, products, selectedCategory]);

  useEffect(() => {
    if (selectedCategory && !visibleCategories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory("");
    }
  }, [selectedCategory, visibleCategories]);

  useEffect(() => {
    if (selectedBrand && !visibleBrands.some((brand) => brand.id === selectedBrand)) {
      setSelectedBrand("");
    }
  }, [selectedBrand, visibleBrands]);

  const rankedProducts = useMemo(() => {
    const rows = [...products];
    if (!searchQuery.trim()) return rows;
    return rows
      .map((product) => ({ product, score: getSearchScore(product, searchQuery) }))
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.product);
  }, [products, searchQuery]);

  const handleSearch = () => {
    const nextQuery = searchValue.trim();
    if (nextQuery) navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
    else navigate("/search");
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
  };

  const handleToggleCompare = (productId: string) => {
    setCompareItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_30%,#f8fafc_100%)]">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <XCircle className="h-6 w-6 text-gray-600" />
            </button>

            <div className="relative flex-1">
              <div className="flex items-center rounded-full border-2 border-gray-200 bg-gray-50 transition-all focus-within:border-[#009FE3]">
                <Search className="mx-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder={Array.isArray(t.searchPlaceholder) ? t.searchPlaceholder[0] : t.searchPlaceholder}
                  className="flex-1 bg-transparent px-2 py-3 text-gray-700 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="mr-2 rounded-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg"
                >
                  {language === "ar" ? "بحث" : "Search"}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#009FE3]/40"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t.filters}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {(showFilters || selectedCategory || selectedBrand) && (
          <div className="mb-8 rounded-3xl border border-[#009FE3]/15 bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#009FE3]" />
                <h3 className="text-xl font-bold text-gray-900">{t.filters}</h3>
              </div>
              {(selectedCategory || selectedBrand) && (
                <button onClick={clearFilters} className="text-sm font-semibold text-[#009FE3] hover:underline">
                  {t.clearFilters}
                </button>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.categories}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedBrand("");
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition-colors focus:border-[#009FE3]"
                >
                  <option value="">{language === "ar" ? "كل الفئات" : "All Categories"}</option>
                  {visibleCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {language === "ar" ? category.nameAr || category.nameEn : category.nameEn || category.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.brands}</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition-colors focus:border-[#009FE3]"
                >
                  <option value="">{language === "ar" ? "كل العلامات التجارية" : "All Brands"}</option>
                  {visibleBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {language === "ar" ? brand.nameAr || brand.nameEn : brand.nameEn || brand.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {t.searchResults} <span className="text-[#009FE3]">({rankedProducts.length})</span>
            </h3>
            {searchQuery && (
              <p className="mt-2 text-gray-600">
                {t.showingResultsFor} <span className="font-semibold">"{searchQuery}"</span>
              </p>
            )}
          </div>
          {(selectedCategory || selectedBrand) && (
            <div className="text-sm text-gray-500">
              {[
                selectedCategory
                  ? language === "ar"
                    ? categoryMap.get(selectedCategory)?.nameAr || categoryMap.get(selectedCategory)?.nameEn
                    : categoryMap.get(selectedCategory)?.nameEn || categoryMap.get(selectedCategory)?.nameAr
                  : "",
                selectedBrand
                  ? language === "ar"
                    ? brandMap.get(selectedBrand)?.nameAr || brandMap.get(selectedBrand)?.nameEn
                    : brandMap.get(selectedBrand)?.nameEn || brandMap.get(selectedBrand)?.nameAr
                  : "",
              ]
                .filter(Boolean)
                .join(" / ")}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`search-skeleton-${index}`} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 h-48 animate-pulse rounded-2xl bg-gray-100" />
                <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
            {loadError}
          </div>
        ) : rankedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rankedProducts.map((product) => (
              <ProductCard
                key={getProductRef(product) || String(product?._id || product?.id || product?.stk_code)}
                product={product}
                toggleCompare={handleToggleCompare}
                compareItems={compareItems}
                language={language === "ar" ? "ar" : "en"}
                onProductClick={(clickedProduct) =>
                  navigate(`/product/${encodeURIComponent(getProductRef(clickedProduct) || (clickedProduct as any).id || (clickedProduct as any).stk_code)}`)
                }
                onQuickView={() =>
                  navigate(`/product/${encodeURIComponent(getProductRef(product) || (product as any).id || (product as any).stk_code)}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">{t.noResults}</h3>
            <p className="mb-6 text-gray-600">{t.noResultsMessageExtended}</p>
            <button
              onClick={clearFilters}
              className="rounded-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] px-6 py-3 text-white transition-all duration-300 hover:shadow-lg"
            >
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
