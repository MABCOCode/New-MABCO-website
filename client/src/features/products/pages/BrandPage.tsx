import { ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { setSeo } from '../../../services/seo';
import { getProductRef } from '../../../utils/entityRefs';
import { getCachedStaticCatalogData, loadStaticCatalogData } from '../../../utils/staticCatalogData';
import { useCompareStore } from '../../compare/state';
import ProductCard from "../components/ProductCard";

const brandProductsCache = new Map<string, any[]>();

const BrandPage: React.FC = () => {
  const { id, category } = useParams<{ id: string; category?: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const term = id ? decodeURIComponent(id) : '';
  const categoryParam = category ? decodeURIComponent(category) : '';
  const isServiceBrand = ["2020", "2022"].includes(String(term));
  const [staticCategories, setStaticCategories] = useState<any[]>([]);
  const [staticBrands, setStaticBrands] = useState<any[]>([]);
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;
    const cached = getCachedStaticCatalogData();
    if (cached) {
      setStaticCategories(cached.categories);
      setStaticBrands(cached.brands);
    }
    (async () => {
      try {
        const { categories: categoriesJson, brands: brandsJson } = await loadStaticCatalogData();
        if (!mounted) return;
        setStaticCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
        setStaticBrands(Array.isArray(brandsJson) ? brandsJson : []);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const params = new URLSearchParams();
    if (term) params.set('brand_code', term);
    if (categoryParam) params.set('cat_code', categoryParam);
    params.set('limit', '200');
    params.set('card', '1');
    params.set('count', '0');
    setIsLoadingProducts(true);
    const cacheKey = `${apiBase}/products?${params.toString()}`;
    const cached = brandProductsCache.get(cacheKey);
    if (cached) {
      setApiProducts(cached);
      setIsLoadingProducts(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(cacheKey, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        brandProductsCache.set(cacheKey, items);
        setApiProducts(items);
        setIsLoadingProducts(false);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        setApiProducts([]);
        setIsLoadingProducts(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [term, categoryParam]);

  const categorySource = useMemo(
    () => staticCategories,
    [staticCategories],
  );

  const slug = (s: string) =>
    String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-\u0600-\u06FF]/gi, '');

  const termSlug = slug(term);

  const products = apiProducts;

  const primaryProduct = products[0];
  const productBrandCode = primaryProduct?.brand_code || primaryProduct?.brandCode || '';
  const productCategoryCode = primaryProduct?.cat_code || primaryProduct?.categoryCode || '';

  const matchedBrandMeta = (() => {
    for (const c of categorySource) {
      const brand = (c.brands || []).find((b: any) => {
        if (typeof b === 'string') return slug(b) === termSlug;
        const code = String(b?.brand_code || '').toLowerCase();
        const nameAr = String(b?.name || '');
        const nameEn = String(b?.englishName || '');
        return (
          code === String(term).toLowerCase() ||
          slug(nameAr) === termSlug ||
          slug(nameEn) === termSlug
        );
      });
      if (brand) return { brand, category: c };
    }
    return null;
  })();

  const matchedCategoryByBrand = matchedBrandMeta?.category || null;
  const brandByCode = useMemo(() => {
    const map = new Map<string, any>();
    for (const c of categorySource) {
      for (const b of c.brands || []) {
        if (b && typeof b === 'object' && b.brand_code != null) {
          map.set(String(b.brand_code).toLowerCase(), b);
        }
      }
    }
    return map;
  }, [categorySource]);

  const categoryByCode = useMemo(() => {
    const map = new Map<string, any>();
    for (const c of categorySource) {
      if (c?.cat_code != null) {
        map.set(String(c.cat_code).toLowerCase(), c);
      }
    }
    return map;
  }, [categorySource]);

  const inferredCategory = (() => {
    if (categoryParam) {
      return (
        categorySource.find((c) => {
          const nameEn = String(c.nameEn || '');
          const nameAr = String(c.name || '');
          return (
            String(c.cat_code || '').toLowerCase() === String(categoryParam).toLowerCase() ||
            slug(nameEn) === slug(categoryParam) ||
            slug(nameAr) === slug(categoryParam)
          );
        }) || { name: categoryParam, nameEn: categoryParam, cat_code: categoryParam }
      );
    }
    if (matchedCategoryByBrand) return matchedCategoryByBrand;
    if (!productCategoryCode) return null;
    const categoryByCodeMatch = categoryByCode.get(String(productCategoryCode).toLowerCase());
    if (categoryByCodeMatch) return categoryByCodeMatch;
    return null;
  })();

  const displayCategoryName = inferredCategory
    ? language === 'ar'
      ? inferredCategory.name
      : inferredCategory.nameEn || inferredCategory.name
    : '';

  const categoryRouteName = inferredCategory
    ? inferredCategory.cat_code || inferredCategory.nameEn || inferredCategory.name
    : '';

  const servicesLabel = language === "ar" ? "الخدمات" : "Services";
  const servicesHref = "/#services";

  const displayBrandName = (() => {
    const code = String(term || productBrandCode || '').toLowerCase();
    const brandFromGlobal = staticBrands.find(
      (b: any) => String(b?.brand_code || '').toLowerCase() === code
    );
    if (brandFromGlobal) {
      return language === 'ar'
        ? String(brandFromGlobal.name || brandFromGlobal.englishName || term)
        : String(brandFromGlobal.englishName || brandFromGlobal.name || term);
    }
    const fromCode = brandByCode.get(code);
    if (fromCode) {
      return language === 'ar'
        ? String(fromCode.name || fromCode.englishName || term)
        : String(fromCode.englishName || fromCode.name || term);
    }
    if (matchedBrandMeta?.brand) {
      const b: any = matchedBrandMeta.brand;
      return language === 'ar' ? (b.name || b.englishName || term) : (b.englishName || b.name || term);
    }
    return term;
  })();

  useEffect(() => {
    if (!displayBrandName) return;

    const normalizedBrandName = String(displayBrandName).trim();
    const normalizedCategoryName = String(displayCategoryName || '').trim();
    const title =
      language === 'ar'
        ? normalizedCategoryName
          ? `مابكو | ${normalizedCategoryName}  ${normalizedBrandName}`
          : `مابكو | ${normalizedBrandName}`
        : normalizedCategoryName
          ? `MABCO | ${normalizedCategoryName}  ${normalizedBrandName}`
          : `MABCO | ${normalizedBrandName}`;
    const description =
      language === 'ar'
        ? normalizedCategoryName
          ? `تصفح أحدث منتجات ${normalizedBrandName} ضمن فئة ${normalizedCategoryName} على مابكو مع الأسعار والمواصفات المتوفرة.`
          : `تصفح أحدث منتجات ${normalizedBrandName} على مابكو مع الأسعار والمواصفات المتوفرة.`
        : normalizedCategoryName
          ? `Browse ${normalizedBrandName} products in ${normalizedCategoryName} on MABCO with available prices and specifications.`
          : `Browse ${normalizedBrandName} products on MABCO with available prices and specifications.`;

    setSeo({
      title,
      description,
      url: window.location.href,
      image: 'https://mabcoonline.com/images/giphy.gif',
    });
  }, [displayBrandName, displayCategoryName, language]);

  const compareItems = useCompareStore((s: any) => s.items) as string[];
  const toggleCompareStore = useCompareStore((s: any) => s.toggleCompare) as (id: string) => void;
  const openCompare = useCompareStore((s: any) => s.openCompare) as () => void;

  const handleToggleCompare = (productId: string) => {
    const isAdding = !compareItems.some((id) => String(id) === String(productId));
    toggleCompareStore(String(productId));
    if (isAdding) {
      openCompare();
    }
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 mb-40">
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h2 className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? '' : 'rotate-180'}`} />

            <button
              onClick={() => navigate('/')}
              className={language === 'ar' ? 'flex-row-reverse group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0' : 'group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0'}
            >
              <span className="font-medium">{t('home')}</span>
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            {displayCategoryName && (
              <>
                <button
                  onClick={() =>
                    isServiceBrand
                      ? navigate(servicesHref)
                      : navigate(`/?openCategory=${encodeURIComponent(categoryRouteName)}#categories`)
                  }
                  className="text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0"
                >
                  {isServiceBrand ? servicesLabel : displayCategoryName}
                </button>
                <span className="text-gray-300 flex-shrink-0">/</span>
              </>
            )}
            <span className="text-[#009FE3] font-semibold truncate max-w-[300px]">
              {displayBrandName}
            </span>
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {displayBrandName}
          </h1>
          {displayCategoryName && (
            <p className="text-gray-600 mt-2 text-base md:text-lg">
              {displayCategoryName}
            </p>
          )}
          <p className="text-gray-500 mt-2 text-sm md:text-base max-w-3xl">
            {language === 'ar'
              ? 'تصفح أحدث المنتجات المرتبطة بهذه العلامة التجارية ضمن الفئة المختارة.'
              : 'Browse the latest products for this brand within the selected category.'}
          </p>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`brand-product-skeleton-${idx}`} className="rounded-2xl border border-gray-200 p-3 md:p-4 bg-white">
                <div className="aspect-square rounded-xl shimmer-surface mb-3" />
                <div className="h-4 w-3/4 skeleton-line shimmer-surface mb-2" />
                <div className="h-4 w-1/2 skeleton-line shimmer-surface mb-3" />
                <div className="h-9 w-full rounded-lg shimmer-surface" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-600">{language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard
                key={getProductRef(p) || String(p.id)}
                product={p}
                toggleCompare={handleToggleCompare}
                compareItems={compareItems}
                language={language === 'ar' ? 'ar' : 'en'}
                onProductClick={(product) =>
                  navigate(`/product/${encodeURIComponent(getProductRef(product) || (product as any).id)}`, {
                    state: {
                      product,
                      breadcrumbs: [
                        ...(displayCategoryName
                          ? [
                              {
                                label: isServiceBrand ? servicesLabel : displayCategoryName,
                                href: isServiceBrand
                                  ? servicesHref
                                  : `/?openCategory=${encodeURIComponent(categoryRouteName)}#categories`,
                              },
                            ]
                          : []),
                        {
                          label: displayBrandName,
                          href: isServiceBrand
                            ? servicesHref
                            : categoryRouteName
                              ? `/brand/${encodeURIComponent(String(categoryRouteName))}/${encodeURIComponent(String(term))}`
                              : `/brand/${encodeURIComponent(String(term))}`,
                        },
                      ],
                    },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
