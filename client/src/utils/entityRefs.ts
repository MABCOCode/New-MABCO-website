import { Product } from "../types/product";

export const toSafeCode = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

export const getProductRef = (product: Partial<Product> | string | number | null | undefined): string => {
  if (typeof product === "string" || typeof product === "number") {
    return toSafeCode(product);
  }
  if (!product) return "";
  return (
    toSafeCode((product as any).stk_code) ||
    toSafeCode((product as any).sku) ||
    toSafeCode((product as any).id)
  );
};

export const getCategoryRef = (category: any): string => {
  return toSafeCode(category?.cat_code) || toSafeCode(category?.code) || toSafeCode(category?.slug);
};

export const getBrandRef = (brand: any): string => {
  return toSafeCode(brand?.brand_code) || toSafeCode(brand?.code) || toSafeCode(brand?.slug);
};
