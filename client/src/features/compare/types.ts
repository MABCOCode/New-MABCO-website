export interface ProductSpec {
  icon: string;
  title: string;
  value: string;
}

export interface CompareProduct {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  brand?: string;
  category?: string;
  specs?: ProductSpec[];
  isNew?: boolean;
  isHot?: boolean;
  badge?: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  brand?: string;
  category?: string;
  specs: {
    icon: string;
    title: string;
    value: string;
  }[];
}

export interface ComparePageProps {
  compareItems: number[];
  allProducts: CompareProduct[];
  onClose: () => void;
  onRemoveItem: (id: number) => void;
  onAddItem: (id: number) => void;
  language: "ar" | "en";
}

export interface CompareState {
  items: number[];
  isOpen: boolean;
  selectedCategory: string | null;
  selectedBrand: string | null;
}

export const translations = {
  ar: {
    compareProducts: "مقارنة المنتجات",
    addProducts: "إضافة منتجات للمقارنة",
    selectProducts: "اختر منتجات للمقارنة",
    noProducts: "لا توجد منتجات للمقارنة",
    addMoreProducts: "أضف المزيد من المنتجات",
    filterByCategory: "تصفية حسب الفئة",
    filterByBrand: "تصفية حسب العلامة التجارية",
    allCategories: "جميع الفئات",
    allBrands: "جميع العلامات التجارية",
    product: "المنتج",
    price: "السعر",
    rating: "التقييم",
    specifications: "المواصفات",
    addToCart: "أضف للسلة",
    close: "إغلاق",
    remove: "إزالة",
    add: "إضافة",
    better: "أفضل",
    best: "الأفضل",
    syp: "ل.س",
  },
  en: {
    compareProducts: "Compare Products",
    addProducts: "Add Products to Compare",
    selectProducts: "Select Products to Compare",
    noProducts: "No products to compare",
    addMoreProducts: "Add More Products",
    filterByCategory: "Filter by Category",
    filterByBrand: "Filter by Brand",
    allCategories: "All Categories",
    allBrands: "All Brands",
    product: "Product",
    price: "Price",
    rating: "Rating",
    specifications: "Specifications",
    addToCart: "Add to Cart",
    close: "Close",
    remove: "Remove",
    add: "Add",
    better: "Better",
    best: "Best",
    syp: "SYP",
  },
};