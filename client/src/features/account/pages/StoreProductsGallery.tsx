import React, { useEffect, useState } from "react";
import { Search, Loader, AlertCircle } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

interface StoreProduct {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  image: string;
  price: number;
  category: string;
  brand: string;
}

interface StoreProductsGalleryProps {
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

export function StoreProductsGallery({ onClose }: StoreProductsGalleryProps) {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {};
        if (ADMIN_API_KEY) headers["x-admin-key"] = ADMIN_API_KEY;

        const res = await fetch(`${API_BASE}/products?limit=500`, { headers });
        if (!res.ok) throw new Error("Failed to load products");

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];

        // Extract categories
        const uniqueCategories = Array.from(
          new Set(
            items
              .map((p: any) => p.category || p.categoryAr)
              .filter(Boolean)
          )
        ) as string[];

        setCategories(uniqueCategories);
        const resolveImage = (value: any) => {
          if (typeof value === "string") return value;
          if (value && typeof value === "object") {
            return value.image_link || value.url || value.src || value.image || "";
          }
          return "";
        };
        const resolveProductImage = (product: any) => {
          if (Array.isArray(product?.images) && product.images.length > 0) {
            return resolveImage(product.images[0]) || product.image || "";
          }
          return product.image || "";
        };

        setProducts(
          items
            .filter((p: any) => resolveProductImage(p) && p.name && p.price)
            .map((p: any) => ({
              id: p.id || p.stk_code,
              sku: p.stk_code || p.id,
              name: p.name || "",
              nameAr: p.nameAr || p.name || "",
              image: resolveProductImage(p),
              price: p.price || 0,
              category: p.category || "",
              brand: p.brand || "",
            }))
        );
      } catch (err: any) {
        setError(err?.message || "Failed to load products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.nameAr.includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {t("admin.storeProducts") || "Store Products"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-blue-100 mt-2 text-sm">
            {t("admin.viewAllProducts") || "View all existing products with images"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search & Filter */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("admin.searchProducts") || "Search by name, SKU, or brand..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && (
            <>
              <div className="text-sm text-gray-600 mb-4">
                {t("admin.showingProducts") || `Showing`} {filteredProducts.length}{" "}
                {t("admin.of") || "of"} {products.length} {t("admin.products") || "products"}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {t("admin.noProducts") || "No products found"}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext y='50' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-gray-900 truncate mb-1">
                          {language === "ar" ? product.nameAr : product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {product.brand || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
