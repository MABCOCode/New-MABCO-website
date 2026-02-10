import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, LogOut, X, AlertTriangle } from "lucide-react";
import translations from "../../../i18n/translations";

interface AccountNavBarProps {
  language: "ar" | "en";
  userName?: string;
  onBackToWebsite: () => void;
  onLogout: () => void;
  hideLogout?: boolean;
}

export function AccountNavBar({
  language,
  userName,
  onBackToWebsite,
  onLogout,
  hideLogout = false,
}: AccountNavBarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = translations[language];

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Click to return to website */}
            <button
              onClick={onBackToWebsite}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
                alt="MABCO Logo"
                className="h-16 w-auto object-contain"
              />
            </button>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              {/* User Name */}
              {userName && (
                <div className={`hidden sm:flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <span className="text-gray-600 text-sm">{t.account_navbar_welcome}</span>
                  <span className="font-semibold text-[#009FE3]">{userName}</span>
                </div>
              )}

              {/* Back to Website Button */}
              <button
                onClick={onBackToWebsite}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">{t.account_navbar_back_to_website}</span>
              </button>

              {/* Logout Button */}
              {!hideLogout && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.account_navbar_logout}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-xl font-bold">{t.account_navbar_logoutConfirmTitle}</h3>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-center mb-6">
                  {t.account_navbar_logoutConfirmMessage}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    {t.account_navbar_cancel}
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    {t.account_navbar_confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
