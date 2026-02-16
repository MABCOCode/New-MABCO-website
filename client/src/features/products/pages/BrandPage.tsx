import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriesData from '../../../testdata/categories.json';
import { products as allProducts } from "../../../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from '../../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { useCompareStore } from '../../compare/state';

const BrandPage: React.FC = () => {
  const { id, category } = useParams<{ id: string; category?: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const term = id ? decodeURIComponent(id) : '';
  const categoryParam = category ? decodeURIComponent(category) : '';
  const [staticCategories, setStaticCategories] = useState<any[]>([]);

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

  const products = (allProducts as any[]).filter(
    (p) =>
      p?.brand &&
      String(p.brand).toLowerCase().includes(String(term).toLowerCase()),
  );

  const matchedCategoryByBrand = categorySource.find((c) =>
    (c.brands || []).some((b: string) => slug(b) === termSlug),
  );

  const inferredCategory = (() => {
    if (categoryParam) {
      return (
        categorySource.find((c) => {
          const nameEn = String(c.nameEn || '');
          const nameAr = String(c.name || '');
          return (
            slug(nameEn) === slug(categoryParam) ||
            slug(nameAr) === slug(categoryParam)
          );
        }) || { name: categoryParam, nameEn: categoryParam }
      );
    }
    if (matchedCategoryByBrand) return matchedCategoryByBrand;
    if (products.length === 0) return null;
    const first = products[0];
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
    ? inferredCategory.nameEn || inferredCategory.name
    : '';

  const compareItems = useCompareStore((s: any) => s.items) as number[];
  const toggleCompareStore = useCompareStore((s: any) => s.toggleCompare) as (id: number) => void;
  const openCompare = useCompareStore((s: any) => s.openCompare) as () => void;

  const handleToggleCompare = (productId: number) => {
    const isAdding = !compareItems.some((id) => String(id) === String(productId));
    toggleCompareStore(productId);
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
              {term}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {term}
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

        {products.length === 0 ? (
          <div className="py-12 text-center text-gray-600">{language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                toggleCompare={handleToggleCompare}
                compareItems={compareItems}
                language={language === 'ar' ? 'ar' : 'en'}
                onProductClick={(product) =>
                  navigate(`/product/${product.id}`, {
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
                          label: term,
                          href: categoryRouteName
                            ? `/brand/${encodeURIComponent(categoryRouteName)}/${encodeURIComponent(term)}`
                            : `/brand/${encodeURIComponent(term)}`,
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



