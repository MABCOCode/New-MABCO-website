import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriesData from '../../../testdata/categories.json';
import ProductCard from "../components/ProductCard";
import { useLanguage } from '../../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { useCompareStore } from '../../compare/state';
import { products as allProducts } from "../../../data/products";

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const term = id ? decodeURIComponent(id) : '';

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

  const matchedCategory = (categoriesData as any[]).find((c) => {
    const en = String(c.nameEn || '');
    const ar = String(c.name || '');
    return (
      en.toLowerCase() === term.toLowerCase() ||
      ar.toLowerCase() === term.toLowerCase() ||
      slug(en) === termSlug ||
      slug(ar) === termSlug
    );
  });

  const displayCategoryName = matchedCategory
    ? (language === 'ar' ? matchedCategory.name : matchedCategory.nameEn)
    : term;

  const categoryRouteName = matchedCategory
    ? matchedCategory.nameEn || matchedCategory.name
    : term;

  const products = (allProducts as any[]).filter(
    (p) =>
      p?.category &&
      String(p.category).toLowerCase().includes(String(term).toLowerCase()),
  );

  const compareItems = useCompareStore((s: any) => s.items) as number[];
  const toggleCompare = useCompareStore((s: any) => s.toggleCompare) as (id: number) => void;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/')}
              className={`group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? '' : 'rotate-180'}`} />
              <span className="font-medium">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <span className="text-[#009FE3] font-semibold truncate max-w-[300px]">{displayCategoryName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{displayCategoryName}</h1>

        {products.length === 0 ? (
          <div className="py-12 text-center text-gray-600">{language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                toggleCompare={toggleCompare}
                compareItems={compareItems}
                language={language === 'ar' ? 'ar' : 'en'}
                onProductClick={(product) =>
                  navigate(`/product/${product.id}`, {
                    state: {
                      product,
                      breadcrumbs: [
                        {
                          label: displayCategoryName,
                          href: `/category/${encodeURIComponent(categoryRouteName)}`,
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
