import { useEffect, useMemo, useState } from "react";
import { X, Check, ShoppingCart, Filter } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { Product } from "../../../types/product";
import { ComparePageProps } from "../../../types/compare";
import { getOfferPricing, products, productsBySection } from "../../../data/products";
import translations from '../../../i18n/translations';
import { getProductRef, toSafeCode } from "../../../utils/entityRefs";
import { useCart } from "../../../context/CartContext";

export function ComparePage(props: ComparePageProps) {
  const { compareItems, onClose, onRemoveItem, onAddItem, language } = props;
  const { addToCart } = useCart();
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

  const normalizeCompareProductId = (product: any, index: number) => {
    const resolved =
      toSafeCode(product?.stk_code) ||
      toSafeCode(product?.id) ||
      String(990000 + index);
    return { ...product, id: resolved, stk_code: toSafeCode(product?.stk_code) || resolved } as Product;
  };

  const sectionProducts = Object.values(productsBySection || {}).flat() as Product[];
  const mergedProducts = [...products, ...sectionProducts].map((p, index) =>
    normalizeCompareProductId(p, index),
  );
  const uniqueProducts = Array.from(
    new Map(mergedProducts.map((p) => [getProductRef(p), p])).values(),
  );
  const [allProducts, setAllProducts] = useState<Product[]>(uniqueProducts);
  
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [staticCategories, setStaticCategories] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoadingFilteredProducts, setIsLoadingFilteredProducts] = useState(false);

  useEffect(() => {
    const missingRefs = compareItems.filter(
      (ref) => !allProducts.some((p) => getProductRef(p) === String(ref)),
    );
    if (missingRefs.length === 0) return;

    const params = new URLSearchParams();
    params.set("stk_codes", missingRefs.join(","));
    params.set("limit", String(Math.max(200, missingRefs.length)));
    params.set("lite", "1");

    (async () => {
      try {
        const res = await fetch(`${apiBase}/products?${params.toString()}`);
        if (!res.ok) return;
        const json = await res.json();
        const fetched = Array.isArray(json?.data) ? json.data : [];
        if (fetched.length === 0) return;
        setAllProducts((current) => {
          const merged = [...current, ...fetched.map((p: Product, idx: number) => normalizeCompareProductId(p, idx))];
          return Array.from(new Map(merged.map((p) => [getProductRef(p), p])).values());
        });
      } catch {
        // Keep static/local products only.
      }
    })();
  }, [compareItems, allProducts]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/static/categories.json'),
          fetch('/static/brands.json'),
        ]);
        if (!categoriesRes.ok) return;
        const [categoriesJson, brandsJson] = await Promise.all([
          categoriesRes.json(),
          brandsRes.ok ? brandsRes.json() : Promise.resolve([]),
        ]);
        if (!mounted) return;
        const brandsByCode = new Map<string, any>();
        const brandsByName = new Map<string, any>();
        (Array.isArray(brandsJson) ? brandsJson : []).forEach((brand: any) => {
          if (brand?.brand_code != null) brandsByCode.set(String(brand.brand_code), brand);
          if (brand?.name) brandsByName.set(String(brand.name).trim().toLowerCase(), brand);
          if (brand?.englishName) brandsByName.set(String(brand.englishName).trim().toLowerCase(), brand);
        });

        const mergedCategories = (Array.isArray(categoriesJson) ? categoriesJson : []).map((category: any) => ({
          ...category,
          cat_code: String(category?.cat_code || ''),
          brands: (Array.isArray(category?.brands) ? category.brands : []).map((brand: any) => {
            if (typeof brand === 'string') {
              const match = brandsByName.get(brand.trim().toLowerCase());
              return match ? { ...match } : { name: brand };
            }
            const codeMatch = brand?.brand_code != null ? brandsByCode.get(String(brand.brand_code)) : null;
            const nameKey = String(brand?.name || brand?.englishName || '').trim().toLowerCase();
            const nameMatch = nameKey ? brandsByName.get(nameKey) : null;
            return { ...brand, ...(codeMatch || nameMatch || {}) };
          }),
        }));

        setStaticCategories(mergedCategories);
      } catch {
        // Keep compare usable via selected codes even if static fails.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const hasFilter = !!selectedCategory;
    if (!hasFilter) {
      setFilteredProducts([]);
      setIsLoadingFilteredProducts(false);
      return () => {
        mounted = false;
      };
    }

    setIsLoadingFilteredProducts(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("cat_code", selectedCategory);
    if (selectedBrand) params.set("brand_code", selectedBrand);
    params.set("limit", "200");
    params.set("lite", "1");

    (async () => {
      try {
        const res = await fetch(`${apiBase}/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load filtered products");
        const json = await res.json();
        const fetched = Array.isArray(json?.data) ? json.data : [];
        if (!mounted) return;
        const normalized = fetched.map((product: Product, idx: number) =>
          normalizeCompareProductId(product, idx),
        );
        setFilteredProducts(normalized);
      } catch {
        if (!mounted) return;
        setFilteredProducts([]);
      } finally {
        if (mounted) setIsLoadingFilteredProducts(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apiBase, selectedCategory, selectedBrand]);

  // Get compared products
  const comparedProducts = allProducts.filter((p) => compareItems.includes(getProductRef(p)));

  useEffect(() => {
    if (comparedProducts.length === 0) return;
    const first = comparedProducts[0] as any;
    const firstCategory = String(first?.cat_code || "").trim();
    const firstBrand = String(first?.brand_code || "").trim();
    setSelectedCategory((current) => current || (firstCategory || null));
    setSelectedBrand((current) => current || (firstBrand || null));
  }, [comparedProducts]);

  // Get available products for selection (excluding already compared)
  const availableProducts = useMemo(
    () =>
      filteredProducts.filter(
        (product) => !compareItems.includes(getProductRef(product)),
      ),
    [filteredProducts, compareItems],
  );

  // Get unique categories and brands
  const categories = staticCategories.map((category: any) => ({
    value: String(category?.cat_code || ""),
    label: language === "ar"
      ? category?.name || category?.nameAr || category?.nameEn || ""
      : category?.nameEn || category?.englishName || category?.name || "",
  }));
  const selectedCategoryNode = staticCategories.find(
    (category: any) => String(category?.cat_code || "") === String(selectedCategory || ""),
  );
  const brands = (Array.isArray(selectedCategoryNode?.brands) ? selectedCategoryNode.brands : []).map((brand: any) => ({
    value: String(brand?.brand_code || ""),
    label: language === "ar"
      ? brand?.name || brand?.nameAr || brand?.englishName || ""
      : brand?.englishName || brand?.nameEn || brand?.name || "",
  }));
  const isBrandEnabled = !!selectedCategory;

  const getNormalizedSpecs = (product: Product) => {
    const fromSpecs = Array.isArray((product as any).specs)
      ? (product as any).specs.map((spec: any) => ({
          key: String(spec?.title || "").trim(),
          keyAr: String(spec?.titleAr || spec?.title || "").trim(),
          value: String(spec?.value ?? "").trim(),
          valueAr: String(spec?.valueAr ?? spec?.value ?? "").trim(),
        }))
      : [];

    if (fromSpecs.length > 0) return fromSpecs;

    const fromSpecifications = Array.isArray(product.specifications)
      ? product.specifications.map((spec) => ({
          key: String(spec?.key || "").trim(),
          keyAr: String(spec?.keyAr || spec?.key || "").trim(),
          value: String(spec?.value ?? "").trim(),
          valueAr: String(spec?.valueAr ?? spec?.value ?? "").trim(),
        }))
      : [];

    return fromSpecifications;
  };

  // Collect all unique specification keys
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => {
        return getNormalizedSpecs(p).map((spec: any) =>
          language === "ar" ? spec.keyAr : spec.key,
        );
      })
    )
  );

  // Helper function to get specification value
  const getSpecValue = (product: Product, specKey: string) => {
    const specs = getNormalizedSpecs(product);
    if (!specs.length) return "-";

    // Find specification by key (in both languages)
    const spec = specs.find((s: any) => s.key === specKey || s.keyAr === specKey);
    if (!spec) return "-";

    // Return value based on current language
    const value = language === "ar" ? spec.valueAr : spec.value;
    return String(value || "").trim() || "-";
  };

  const visibleSpecKeys = allSpecKeys.filter((specKey) =>
    comparedProducts.some((product) => {
      const value = getSpecValue(product, specKey);
      return value !== "-" && String(value).trim() !== "";
    }),
  );

  // Helper function to compare numeric values from specifications
  const getBestInSpec = (specKey: string) => {
    const values = comparedProducts.map((p) => {
      const value = String(getSpecValue(p, specKey) ?? "");
      // Extract numeric value for comparison
      const numMatch = value.match(/[\d.]+/);
      return numMatch ? parseFloat(numMatch[0]) : 0;
    });

    if (values.every((v) => v === 0)) return null;
    const maxValue = Math.max(...values);
    return values.map((v) => (v === maxValue && v > 0 ? true : false));
  };

  // Helper function to get best price
  const getBestPrice = () => {
    const prices = comparedProducts.map((p) => {
      if (typeof p.price === "number") return p.price;
      return parseFloat(String(p.price || "").replace(/,/g, "")) || 0;
    });
    const minPrice = Math.min(...prices);
    return prices.map((p) => p === minPrice);
  };

  const bestPrices = getBestPrice();

  const handleAddProductToCart = (product: Product) => {
    const productRef = getProductRef(product);
    addToCart(product, {
      customId: productRef || String(product.id),
      quantity: 1,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      dir={language === "ar" ? "rtl" : "ltr"}
       style={{ zIndex: 2000 }}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 rounded-t-2xl flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              {t.compareProducts || "Compare Products"}
            </h1>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 pb-10">
            {comparedProducts.length === 0 ? (
              // No products to compare
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-24 h-24 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t.noProducts || "No Products to Compare"}
                </h2>
                <p className="text-gray-600 mb-8">
                  {t.selectProducts || "Select products to compare"}
                </p>
              </div>
            ) : (
              // Comparison Table
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-50 p-4 text-left font-bold text-gray-700 border-b-2 border-gray-200 min-w-[150px]">
                        {t.product || "Product"}
                      </th>
                      {comparedProducts.map((product) => (
                        <th
                          key={product.id}
                          className="p-4 border-b-2 border-gray-200 min-w-[250px] align-top"
                        >
                          <div className="relative flex flex-col gap-3">
                            <button
                              onClick={() => onRemoveItem(getProductRef(product))}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-40 object-contain bg-white rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-gray-900 mb-2">
                              {language === "ar" && product.nameAr ? product.nameAr : product.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleAddProductToCart(product)}
                              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {t.addToCart || "Add to Cart"}
                            </button>
                          </div>
                        </th>
                      ))}
                      {comparedProducts.length < 4 && (
                        <th className="p-4 border-b-2 border-gray-200 min-w-[250px]">
                          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <span className="text-gray-400 text-sm">
                              {t.addMoreProducts || "Add More Products"}
                            </span>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price Row */}
                    <tr className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="sticky left-0 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
                        {t.price || "Price"}
                      </td>
                      {comparedProducts.map((product, index) => (
                        <td
                          key={product.id}
                          className={`p-4 border-b text-center ${
                            bestPrices[index]
                              ? "bg-green-50 border-l-4 border-green-500"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-bold text-[#009FE3]">
                              {getOfferPricing(product as any).currentPrice.toLocaleString("en-US")} {t.syp || "SYP"}
                            </span>
                            {getOfferPricing(product as any).hasDiscount && (
                              <span className="text-sm text-gray-400 line-through">
                                {getOfferPricing(product as any).originalPrice.toLocaleString("en-US")} {t.syp || "SYP"}
                              </span>
                            )}
                            {bestPrices[index] && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                <Check className="w-3 h-3" />
                                {t.best || "Best"}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                      {comparedProducts.length < 4 && (
                        <td className="p-4 border-b"></td>
                      )}
                    </tr>

                    {/* Specifications Rows */}
                    {visibleSpecKeys.map((specKey) => {
                      const bestInSpec = getBestInSpec(specKey);
                      return (
                        <tr
                          key={specKey}
                          className="bg-white hover:bg-gray-50 transition-colors"
                        >
                          <td className="sticky left-0 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
                            {specKey}
                          </td>
                          {comparedProducts.map((product, index) => {
                            const value = getSpecValue(product, specKey);
                            const isBest = bestInSpec?.[index];
                            return (
                              <td
                                key={product.id}
                                className={`p-4 border-b text-center ${
                                  isBest
                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-gray-700">{value}</span>
                                  {isBest && value !== "-" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                      <Check className="w-3 h-3" />
                                      {t.better || "Better"}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          {comparedProducts.length < 4 && (
                            <td className="p-4 border-b"></td>
                          )}
                        </tr>
                      );
                    })}

                    {/* Description Row (if no specifications) */}
                    {visibleSpecKeys.length === 0 && comparedProducts.length > 0 && (
                      <tr className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="sticky left-0 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
                          {t.description || "Description"}
                        </td>
                        {comparedProducts.map((product) => (
                          <td key={product.id} className="p-4 border-b">
                            <p className="text-sm text-gray-600">
                              {language === "ar" && product.descriptionAr 
                                ? product.descriptionAr 
                                : product.description}
                            </p>
                          </td>
                        ))}
                        {comparedProducts.length < 4 && (
                          <td className="p-4 border-b"></td>
                        )}
                      </tr>
                    )}

                    {/* Add to Cart Row */}
                    <tr className="bg-gray-50">
                      <td className="sticky left-0 p-4 bg-gray-50 z-20"></td>
                      {comparedProducts.map((product) => (
                        <td key={product.id} className="p-4 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => handleAddProductToCart(product)}
                            className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            {t.addToCart || "Add to Cart"}
                          </button>
                        </td>
                      ))}
                      {comparedProducts.length < 4 && <td className="p-4"></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Product Selection Section */}
            {comparedProducts.length < 4 && (
              <div className="mt-8 border-t pt-8 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t.addProducts || "Add Products to Compare"}
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-2" />
                      {t.filterByCategory || "Filter by Category"}
                    </label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => {
                        const nextCategory = e.target.value || null;
                        setSelectedCategory(nextCategory);
                        setSelectedBrand(null);
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/20 transition-all"
                    >
                      <option value="">{t.allCategories || "All Categories"}</option>
                      {categories.map((cat: any) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-2" />
                      {t.filterByBrand || "Filter by Brand"}
                    </label>
                    <select
                      value={selectedBrand || ""}
                      onChange={(e) => setSelectedBrand(e.target.value || null)}
                      disabled={!isBrandEnabled}
                      className={`w-full px-4 py-2 border-2 rounded-lg transition-all ${
                        isBrandEnabled
                          ? "border-gray-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/20"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <option value="">
                        {isBrandEnabled
                          ? t.allBrands || "All Brands"
                          : language === "ar"
                            ? "اختر الفئة أولاً"
                            : "Select category first"}
                      </option>
                      {brands.map((brand: any) => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Available Products Grid */}
                {!selectedCategory ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-600 mb-6">
                    {language === "ar"
                      ? "يرجى اختيار الفئة أو العلامة أولاً."
                      : "Please choose a category first."}
                  </div>
                ) : isLoadingFilteredProducts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={`compare-filter-skeleton-${idx}`}
                        className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <div className="aspect-square shimmer-surface" />
                        <div className="p-3">
                          <div className="h-4 w-3/4 skeleton-line shimmer-surface mb-2" />
                          <div className="h-4 w-1/2 skeleton-line shimmer-surface mb-3" />
                          <div className="h-9 w-full rounded-lg shimmer-surface" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-600 mb-6">
                    {language === "ar"
                      ? "لا توجد منتجات مطابقة للفلاتر المحددة."
                      : "No products match the selected filters."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    {availableProducts.slice(0, 8).map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {getOfferPricing(product as any).hasDiscount && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                              -{getOfferPricing(product as any).discountPercentage}%
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2 min-h-[2.8rem]">
                            {language === "ar" && product.nameAr ? product.nameAr : product.name}
                          </h3>
                          <div className="mb-3">
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-[#009FE3] text-xl">
                                {getOfferPricing(product as any).currentPrice.toLocaleString("en-US")}
                              </span>
                              <span className="text-xs text-gray-500">{t.syp || "SYP"}</span>
                            </div>
                            {getOfferPricing(product as any).hasDiscount && (
                              <div className="text-xs text-gray-400 line-through">
                                {getOfferPricing(product as any).originalPrice.toLocaleString("en-US")} {t.syp || "SYP"}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onAddItem(getProductRef(product))}
                            className="w-full mt-auto bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            {t.add || "Add to Compare"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
