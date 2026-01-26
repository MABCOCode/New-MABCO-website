// pages/SearchPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, XCircle, Filter } from "lucide-react";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data - replace with your actual data
  const allProducts = [
    { id: 1, name: "Product 1", price: "100,000", brand: "Samsung", category: "Phones" },
    { id: 2, name: "Product 2", price: "200,000", brand: "Apple", category: "Phones" },
    { id: 3, name: "Product 3", price: "150,000", brand: "Sony", category: "TVs" },
  ];

  const allBrands = ["Samsung", "Apple", "Sony", "Xiaomi"];
  const allCategories = ["Phones", "TVs", "Laptops", "Headphones"];

  useEffect(() => {
    // Filter products based on search query and filters
    const filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedBrands, selectedCategories]);

  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex-1 relative">
              <div className="flex items-center bg-gray-50 rounded-full border-2 border-gray-200 focus-within:border-[#009FE3] transition-all">
                <Search className="w-5 h-5 text-gray-400 mx-3" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for products..."
                  className="flex-1 py-3 px-2 bg-transparent outline-none text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>searchPlaceholder

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border-2 border-[#009FE3]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#009FE3]" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>
              {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#009FE3] hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Brands Filter */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Brands</h4>
                <div className="flex flex-wrap gap-2">
                  {allBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedBrands.includes(brand)
                          ? "bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white shadow-lg"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#009FE3]/50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategories.includes(category)
                          ? "bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white shadow-lg"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#009FE3]/50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Search Results
            <span className="text-[#009FE3] mr-2">
              ({filteredProducts.length})
            </span>
          </h3>
          {searchQuery && (
            <p className="text-gray-600 mt-2">
              Showing results for: <span className="font-semibold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-gray-100 hover:border-[#009FE3]/30 h-full flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#009FE3] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand} • {product.category}</p>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-[#009FE3]">
                        {product.price}
                      </span>
                      <span className="text-sm text-gray-500">SYP</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try using different keywords or removing filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-full hover:shadow-lg transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;