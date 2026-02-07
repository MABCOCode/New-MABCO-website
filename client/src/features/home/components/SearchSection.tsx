// components/SearchSection.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../context/LanguageContext';
import { Search, Sparkles, XCircle } from "lucide-react";

type Props = {
  language?: 'ar' | 'en';
};

const SearchSection: React.FC<Props> = ({ language }) => {
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTransitioning, setSearchTransitioning] = useState(false);
  const { language: currentLanguage, toggleLanguage, t, direction, navigateToSection } = useLanguage();
  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (searchQuery.trim()) {
      // Get button position for circle origin if available
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        // You can set circleOrigin here if needed for animations
      }

      // Start transition
      setSearchTransitioning(true);

      // After animation completes, navigate to search page
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setTimeout(() => {
          setSearchTransitioning(false);
        }, 100);
      }, 1200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative group">
          {/* Gradient Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#009FE3] to-[#007BC7] rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          {/* Search Input Container */}
          <div className="relative flex items-center bg-white rounded-full shadow-xl border-2 border-gray-200 hover:border-[#009FE3]/50 transition-all duration-300">
            {/* Search Icon with Animated Stars */}
            <div className="relative mx-3 sm:mx-4">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <Sparkles className="w-3 h-3 text-purple-500 absolute -top-1 -right-1 animate-sparkle" />
              <Sparkles 
                className="w-2 h-2 text-purple-400 absolute -bottom-1 -left-1 animate-sparkle" 
                style={{ animationDelay: "1s" }} 
              />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('searchPlaceholder')}
              className="flex-1 py-3 sm:py-4 px-2 bg-transparent outline-none text-gray-700 text-base sm:text-lg"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mx-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || searchTransitioning}
          className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
          aria-label="Search"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Secondary Search Button
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || searchTransitioning}
          className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full hover:border-[#009FE3]/50 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div> */}

      {/* CSS for sparkle animation */}
      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchSection;