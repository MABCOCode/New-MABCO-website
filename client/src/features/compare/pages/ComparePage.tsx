import { useState } from "react";
import { X, Check, Star, ShoppingCart, Filter } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { CompareProduct, ComparePageProps, translations, Product } from "../types";
import { compareUtils } from "../sync";
import productsData from '../../../testdata/products.json';

export function ComparePage(props: ComparePageProps) {
  const { compareItems, onClose, onRemoveItem, onAddItem, language } = props;

  // Build allProducts from local testdata
  const pd: any = productsData || {};
  const allProducts: Product[] = [
    ...(pd.mostBought || []),
    ...(pd.newProducts || []),
  ];
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Get compared products
  const comparedProducts = allProducts.filter((p) =>
    compareItems.includes(p.id)
  );

  // Get available products for selection (excluding already compared)
  const availableProducts = allProducts.filter(
    (p) =>
      !compareItems.includes(p.id) &&
      (!selectedCategory || p.category === selectedCategory) &&
      (!selectedBrand || p.brand === selectedBrand)
  );

  // Get unique categories and brands
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  );
  const brands = Array.from(
    new Set(allProducts.map((p) => p.brand).filter(Boolean))
  );

  // Collect all unique spec titles
  const allSpecTitles = Array.from(
    new Set(
      comparedProducts.flatMap((p) => p.specs?.map((spec) => spec.title) || [])
    )
  );

  // Helper function to get spec value
  const getSpecValue = (product: Product | CompareProduct, specTitle: string) => {
    const spec = product.specs?.find((s) => s.title === specTitle);
    return spec?.value || "-";
  };

  // Helper function to compare numeric values from specs
  const getBestInSpec = (specTitle: string) => {
    const values = comparedProducts.map((p) => {
      const value = getSpecValue(p, specTitle);
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
    const prices = comparedProducts.map((p) =>
      parseFloat(p.price.replace(/,/g, ""))
    );
    const minPrice = Math.min(...prices);
    return prices.map((p) => p === minPrice);
  };

  // Helper function to get best rating
  const getBestRating = () => {
    const ratings = comparedProducts.map((p) => p.rating);
    const maxRating = Math.max(...ratings);
    return ratings.map((r) => r === maxRating);
  };

  const bestPrices = getBestPrice();
  const bestRatings = getBestRating();

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 rounded-t-2xl flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              {t.compareProducts}
            </h1>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
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
                  {t.noProducts}
                </h2>
                <p className="text-gray-600 mb-8">{t.selectProducts}</p>
              </div>
            ) : (
              // Comparison Table
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-50 p-4 text-left font-bold text-gray-700 border-b-2 border-gray-200 min-w-[150px]">
                        {t.product}
                      </th>
                      {comparedProducts.map((product, index) => (
                        <th
                          key={product.id}
                          className="p-4 border-b-2 border-gray-200 min-w-[250px]"
                        >
                          <div className="relative">
                            <button
                              onClick={() => onRemoveItem(product.id)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-gray-900 mb-2">
                              {product.name}
                            </h3>
                          </div>
                        </th>
                      ))}
                      {comparedProducts.length < 4 && (
                        <th className="p-4 border-b-2 border-gray-200 min-w-[250px]">
                          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <span className="text-gray-400 text-sm">
                              {t.addMoreProducts}
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
                        {t.price}
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
                              {product.price} {t.syp}
                            </span>
                            {product.oldPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.oldPrice} {t.syp}
                              </span>
                            )}
                            {bestPrices[index] && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                <Check className="w-3 h-3" />
                                {t.best}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                      {comparedProducts.length < 4 && (
                        <td className="p-4 border-b"></td>
                      )}
                    </tr>

                    {/* Rating Row */}
                    <tr className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="sticky left-0 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
                        {t.rating}
                      </td>
                      {comparedProducts.map((product, index) => (
                        <td
                          key={product.id}
                          className={`p-4 border-b text-center ${
                            bestRatings[index]
                              ? "bg-yellow-50 border-l-4 border-yellow-500"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < product.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {bestRatings[index] && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                <Check className="w-3 h-3" />
                                {t.best}
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
                    {allSpecTitles.map((specTitle) => {
                      const bestInSpec = getBestInSpec(specTitle);
                      return (
                        <tr
                          key={specTitle}
                          className="bg-white hover:bg-gray-50 transition-colors"
                        >
                          <td className="sticky left-0 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
                            {specTitle}
                          </td>
                          {comparedProducts.map((product, index) => {
                            const value = getSpecValue(product, specTitle);
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
                                      {t.better}
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

                    {/* Add to Cart Row */}
                    <tr className="bg-gray-50">
                      <td className="sticky left-0 bg-gray-50 p-4"></td>
                      {comparedProducts.map((product) => (
                        <td key={product.id} className="p-4">
                          <button className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            {t.addToCart}
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
              <div className="mt-8 border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t.addProducts}
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-2" />
                      {t.filterByCategory}
                    </label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value || null)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/20 transition-all"
                    >
                      <option value="">{t.allCategories}</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-2" />
                      {t.filterByBrand}
                    </label>
                    <select
                      value={selectedBrand || ""}
                      onChange={(e) => setSelectedBrand(e.target.value || null)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/20 transition-all"
                    >
                      <option value="">{t.allBrands}</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Available Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {availableProducts.slice(0, 8).map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">
                        {product.name}
                      </h3>
                      <p className="text-[#009FE3] font-bold mb-3">
                        {product.price} {t.syp}
                      </p>
                      <button
                        onClick={() => onAddItem(product.id)}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
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
                        {t.add}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}