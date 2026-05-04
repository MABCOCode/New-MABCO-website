// components/SearchSection.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { language: currentLanguage, toggleLanguage, t, direction, navigateToSection } = useLanguage();

  useEffect(() => {
    // Trigger morph animation on component mount
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (searchQuery.trim()) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
      }

      setSearchTransitioning(true);

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

  // True morph animation - circle to pill shape
  const morphVariants = {
    initial: {
      width: "48px",
      height: "48px",
      borderRadius: "9999px",
      opacity: 1,
    },
    morphing: {
      width: "100%",
      height: "auto",
      borderRadius: "9999px",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.08,
        delayChildren: 0.2,
      }
    },
  };

  // Content fades in after morph completes
  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      }
    }
  };

  const inputVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      }
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        delay: 0.1,
        ease: "easeOut",
      }
    }
  };

  const containerVariants = {
    idle: {
      scale: 1,
      borderRadius: "9999px",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      backgroundColor: "rgba(255,255,255,1)",
    },
    focused: {
      scale: 1.01,
      borderRadius: "2rem",
      boxShadow: "0 28px 80px rgba(0, 159, 227, 0.16)",
      backgroundColor: "rgba(255,255,255,0.98)",
    },
  };

  return (
    <div className="relative">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative group">
          {/* Gradient Background Effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-[#009FE3] to-[#007BC7] rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 0.2 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          
          {/* Search Input Container - Morphs from circle to pill */}
          <motion.div
            variants={morphVariants}
            initial="initial"
            animate={hasAnimated ? "morphing" : "initial"}
            className="relative flex items-center bg-white shadow-xl border-2 border-gray-200 hover:border-[#009FE3]/50 transition-colors duration-300 overflow-hidden"
            style={{
              // Ensure proper sizing during morph
              minHeight: "48px",
            }}
          >
            {/* Search Icon - Always visible, scales in place */}
            <motion.div 
              className="relative mx-3 sm:mx-4 flex-shrink-0"
              variants={contentVariants}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={hasAnimated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.15 }}
              >
                <Sparkles className="w-3 h-3 text-purple-500 absolute -top-1 -right-1 animate-sparkle" />
                <Sparkles 
                  className="w-2 h-2 text-purple-400 absolute -bottom-1 -left-1 animate-sparkle" 
                  style={{ animationDelay: "1s" }} 
                />
              </motion.div>
            </motion.div>

            {/* Search Input - Fades in after morph */}
            <motion.input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 py-3 sm:py-4 px-2 bg-transparent outline-none text-gray-700 text-base sm:text-lg"
              variants={inputVariants}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
            />

            {/* Clear Button - Fades in after morph */}
            <AnimatePresence>
              {searchQuery && hasAnimated && (
                <motion.button
                  onClick={clearSearch}
                  className="mx-2 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label="Clear search"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.12 }}
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Search Button - Scales in independently */}
        <motion.button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || searchTransitioning}
          className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
          aria-label="Search"
          variants={buttonVariants}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

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