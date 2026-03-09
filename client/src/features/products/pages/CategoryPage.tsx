import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriesData from '../../../testdata/categories.json';
import ProductCard from "../components/ProductCard";
import { useLanguage } from '../../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { useCompareStore } from '../../compare/state';
import { products as allProducts } from "../../../data/products";
import { getProductRef } from "../../../utils/entityRefs";

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const term = id ? decodeURIComponent(id) : '';
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
    if (term) params.set('cat_code', term);
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
  }, [term]);

  const categorySource = useMemo(
    () => (staticCategories.length > 0 ? staticCategories : (categoriesData as any[])),
    [staticCategories],
  );

  // Resolve display name: match by exact name or by slugified form to support slugs/encoding
  const slug = (s: string) =>
    String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-\u0600-\u06FF]/gi, '');

  const termSlug = slug(term);
  const categoryByCode = useMemo(() => {
    const map = new Map<string, any>();
    for (const c of categorySource) {
      if (c?.cat_code != null) {
        map.set(String(c.cat_code).toLowerCase(), c);
      }
    }
    return map;
  }, [categorySource]);

  const matchedCategory = categorySource.find((c) => {
    const en = String(c.nameEn || '');
    const ar = String(c.name || '');
    const code = String(c.cat_code || '');
    return (
      code.toLowerCase() === term.toLowerCase() ||
      en.toLowerCase() === term.toLowerCase() ||
      ar.toLowerCase() === term.toLowerCase() ||
      slug(en) === termSlug ||
      slug(ar) === termSlug
    );
  });

  const sourceProducts = apiProducts ?? (allProducts as any[]);
  const products = sourceProducts.filter(
    (p) =>
      (
        (p?.cat_code && String(p.cat_code).toLowerCase() === String(term).toLowerCase()) ||
        (p?.category && String(p.category).toLowerCase().includes(String(term).toLowerCase()))
      ),
  );

  const fallbackCategory =
    matchedCategory ||
    categoryByCode.get(String(products[0]?.cat_code || '').toLowerCase()) ||
    null;

  const displayCategoryName = fallbackCategory
    ? (language === 'ar' ? fallbackCategory.name : fallbackCategory.nameEn)
    : term;

  const categoryRouteName = fallbackCategory
    ? (fallbackCategory.cat_code || fallbackCategory.nameEn || fallbackCategory.name)
    : term;

  const compareItems = useCompareStore((s: any) => s.items) as string[];
  const toggleCompareStore = useCompareStore((s: any) => s.toggleCompare) as (id: string) => void;
  const openCompare = useCompareStore((s: any) => s.openCompare) as () => void;
  const handleToggleCompare = (productId: string) => {
    const isAdding = !compareItems.some((id) => String(id) === String(productId));
    toggleCompareStore(String(productId));
    if (isAdding) openCompare();
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 mb-8" >
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/')}
              className={`group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? '' : 'rotate-180'}`} />
              <span className="font-medium">{t('home')}</span>
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <span className="text-[#009FE3] font-semibold truncate max-w-[300px]">{displayCategoryName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{displayCategoryName}</h1>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`category-product-skeleton-${idx}`} className="rounded-2xl border border-gray-200 p-3 md:p-4 bg-white">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
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
                        {
                          label: displayCategoryName,
                          href: `/?openCategory=${encodeURIComponent(categoryRouteName)}#categories`,
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

export default CategoryPage;
