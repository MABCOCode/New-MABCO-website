import { CompareProduct } from './types';

export const compareUtils = {
  // Get all unique spec titles from compared products
  getAllSpecTitles: (products: CompareProduct[]): string[] => {
    return Array.from(
      new Set(
        products.flatMap((p) => p.specs?.map((spec) => spec.title) || [])
      )
    );
  },

  // Get spec value for a product
  getSpecValue: (product: CompareProduct, specTitle: string): string => {
    const spec = product.specs?.find((s) => s.title === specTitle);
    return spec?.value || "-";
  },

  // Find best product for a specific spec (higher numeric values are better)
  getBestInSpec: (products: CompareProduct[], specTitle: string): boolean[] => {
    const values = products.map((product) => {
      const value = compareUtils.getSpecValue(product, specTitle);
      const numMatch = value.match(/[\d.]+/);
      return numMatch ? parseFloat(numMatch[0]) : 0;
    });

    if (values.every((v) => v === 0)) return [];
    const maxValue = Math.max(...values);
    return values.map((v) => v === maxValue && v > 0);
  },

  // Find best price (lower is better)
  getBestPrice: (products: CompareProduct[]): boolean[] => {
    const prices = products.map((p) =>
      parseFloat(p.price.replace(/,/g, ""))
    );
    const minPrice = Math.min(...prices);
    return prices.map((p) => p === minPrice);
  },

  // Filter available products for comparison
  getAvailableProducts: (
    allProducts: CompareProduct[],
    compareItems: number[],
    selectedCategory?: string | null,
    selectedBrand?: string | null
  ): CompareProduct[] => {
    return allProducts.filter(
      (p) =>
        !compareItems.includes(p.id) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (!selectedBrand || p.brand === selectedBrand)
    );
  },

  // Get unique categories from products
  getUniqueCategories: (products: CompareProduct[]): string[] => {
    return Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[])
    );
  },

  // Get unique brands from products
  getUniqueBrands: (products: CompareProduct[]): string[] => {
    return Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean) as string[])
    );
  },
};
