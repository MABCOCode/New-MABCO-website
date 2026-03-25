// context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  direction: 'rtl' | 'ltr';
  navigateToSection: (sectionId: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const scrollToSectionWithOffset = (sectionId: string, behavior: ScrollBehavior = 'smooth') => {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const nav = document.querySelector('nav');
  const navHeight = nav?.getBoundingClientRect().height ?? 0;
  const offset = navHeight + 20;
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);

  window.scrollTo({ top, behavior });
  return true;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Custom hook to use navigate safely
const useSafeNavigate = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNavigate();
  } catch (error) {
    // Return a mock navigate function if useNavigate fails
    return (path: string) => {
      window.location.href = path;
    };
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useSafeNavigate();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await import(`../translations/${language}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback translations
        setTranslations({
          home: language === 'ar' ? 'الرئيسية' : 'Home',
          searchPlaceholder: language === 'ar' ? 'ابحث عن المنتجات...' : 'Search for products...',
          // Add more fallbacks as needed
        });
      }
    };

    loadTranslations();
  }, [language]);

  // Update document attributes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Update body direction for consistency
    document.body.dir = direction;
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const navigateToSection = (sectionId: string) => {
    window.dispatchEvent(
      new CustomEvent('mabco:navigate-section', { detail: { sectionId } }),
    );
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '') {
      const didScroll = scrollToSectionWithOffset(sectionId);
      if (didScroll) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    setLanguage,
    t,
    direction,
    navigateToSection,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
