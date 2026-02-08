import React from 'react';
import { useCompareStore } from '../../features/compare/state';
import { useLanguage } from '../../context/LanguageContext';

const FloatingCompare: React.FC = () => {
  const compareCount = useCompareStore((s) => s.items.length);
  const openCompare = useCompareStore((s) => s.openCompare);
  const { language } = useLanguage();

  if (compareCount === 0) return null;

  const containerSideClass = language === 'ar' ? 'left-6' : 'right-6';
  const badgePosClass = language === 'ar' ? '-top-2 -left-2' : '-top-2 -right-2';

  return (
    <div className={`hidden md:flex fixed top-24 ${containerSideClass} z-[45] flex-col items-center gap-1 transition-all duration-500`}>
      <button
        className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        onClick={() => {
          console.log('[FloatingCompare] openCompare click, count=', compareCount);
          openCompare();
        }}
        aria-label={language === 'ar' ? 'فتح المقارنة' : 'Open compare'}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className={`absolute ${badgePosClass} w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md`}>
          {compareCount}
        </span>
      </button>
      <span className={`text-xs font-semibold text-purple-700 bg-white/90 px-2 py-1 rounded-full shadow-sm ${language === 'ar' ? '' : ''}`}>
        {language === 'ar' ? 'مقارنة' : 'Compare'}
      </span>
    </div>
  );
};

export default FloatingCompare;
