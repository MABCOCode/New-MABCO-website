import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriesData from '../../../testdata/categories.json';
import { products as allProducts } from "../../../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from '../../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { useCompareStore } from '../../compare/state';
import { getProductRef } from '../../../utils/entityRefs';

const BrandPage: React.FC = () => {
  const { id, category } = useParams<{ id: string; category?: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const term = id ? decodeURIComponent(id) : '';
  const categoryParam = category ? decodeURIComponent(category) : '';
  const [staticCategories, setStaticCategories] = useState<any[]>([]);
  const [apiProducts, setApiProducts] = useState<any[] | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/static/categories.json');
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && Array.isArray(json)) {
          setStaticCategories(json);
        }
      } catch {
        // fallback to bundled testdata
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const params = new URLSearchParams();
    if (term) params.set('brand_code', term);
    if (categoryParam) params.set('cat_code', categoryParam);
    params.set('limit', '200');
    params.set('lite', '1');
    setIsLoadingProducts(true);

    (async () => {
      try {
        const res = await fetch(`${apiBase}/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();
        if (mounted) {
          setApiProducts(Array.isArray(json?.data) ? json.data : []);
          setIsLoadingProducts(false);
        }
      } catch {
        if (mounted) {
          setApiProducts(null);
          setIsLoadingProducts(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [term, categoryParam]);

  const categorySource = useMemo(
    () => (staticCategories.length > 0 ? staticCategories : (categoriesData as any[])),
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

  const sourceProducts = apiProducts ?? (allProducts as any[]);
  const products = sourceProducts.filter(
    (p) =>
      (
        (p?.brand_code && String(p.brand_code).toLowerCase() === String(term).toLowerCase()) ||
        (p?.brand && String(p.brand).toLowerCase().includes(String(term).toLowerCase()))
      ),
  );

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
    if (products.length === 0) return null;
    const first = products[0];
    const categoryByCodeMatch = categoryByCode.get(String(first?.cat_code || '').toLowerCase());
    if (categoryByCodeMatch) return categoryByCodeMatch;
    const raw = String(
      language === 'ar'
        ? first.categoryAr || first.category || ''
        : first.category || first.categoryAr || '',
    );
    if (!raw) return null;
    return categorySource.find((c) => {
      const nameEn = String(c.nameEn || '');
      const nameAr = String(c.name || '');
      return slug(nameEn) === slug(raw) || slug(nameAr) === slug(raw);
    }) || { name: raw, nameEn: raw };
  })();

  const displayCategoryName = inferredCategory
    ? language === 'ar'
      ? inferredCategory.name
      : inferredCategory.nameEn || inferredCategory.name
    : '';

  const categoryRouteName = inferredCategory
    ? inferredCategory.cat_code || inferredCategory.nameEn || inferredCategory.name
    : '';

  const displayBrandName = (() => {
    if (matchedBrandMeta?.brand) {
      const b: any = matchedBrandMeta.brand;
      return language === 'ar' ? (b.name || b.englishName || term) : (b.englishName || b.name || term);
    }
    if (products.length > 0) {
      const fromProduct = products[0];
      const fromCode = brandByCode.get(String(fromProduct?.brand_code || '').toLowerCase());
      if (fromCode) {
        return language === 'ar'
          ? String(fromCode.name || fromCode.englishName || term)
          : String(fromCode.englishName || fromCode.name || term);
      }
      return language === 'ar'
        ? String(fromProduct.brandAr || fromProduct.brand || term)
        : String(fromProduct.brand || fromProduct.brandAr || term);
    }
    return term;
  })();

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
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/')}
              className={language === 'ar' ? 'flex-row-reverse group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0' : 'group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0'}
            >
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? '' : 'rotate-180'}`} />
              <span className="font-medium">{t('home')}</span>
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            {displayCategoryName && (
              <>
                <button
                  onClick={() =>
                    navigate(`/?openCategory=${encodeURIComponent(categoryRouteName)}#categories`)
                  }
                  className="text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0"
                >
                  {displayCategoryName}
                </button>
                <span className="text-gray-300 flex-shrink-0">/</span>
              </>
            )}
            <span className="text-[#009FE3] font-semibold truncate max-w-[300px]">
              {displayBrandName}
            </span>
          </div>
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
                  navigate(`/product/${getProductRef(product) || (product as any).id}`, {
                    state: {
                      product,
                      breadcrumbs: [
                        ...(displayCategoryName
                          ? [
                              {
                                label: displayCategoryName,
                                href: `/category/${encodeURIComponent(categoryRouteName)}`,
                              },
                            ]
                          : []),
                        {
                          label: displayBrandName,
                          href: categoryRouteName
                            ? `/brand/${encodeURIComponent(categoryRouteName)}/${encodeURIComponent(String((product as any).brand_code || term))}`
                            : `/brand/${encodeURIComponent(String((product as any).brand_code || term))}`,
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



