import { useState } from "react";
import { X, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import translations from "../../../i18n/translations";

interface LoginPageProps {
  language: "ar" | "en";
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({
  language,
  onClose,
  onLoginSuccess,
  onSwitchToSignup,
  onForgotPassword,
}: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const validateForm = () => {
    const newErrors: any = {};

    if (!username.trim()) {
      newErrors.username = t.account_login_username_required;
    }

    if (!password) {
      newErrors.password = t.account_login_password_required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      const mockUser = {
        id: 1,
        name: "أحمد محمد",
        nameEn: "Ahmad Mohammed",
        phone: "0944449999",
        email: "ahmad@example.com",
      };

      onLoginSuccess(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* MABCO Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <img
          src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
          alt="MABCO Logo"
          className="h-20 w-auto object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className={`${language === "ar" ? "text-right" : "text-left"} pr-12`}>
        <h2 className="text-2xl font-bold mb-2">{t.account_login_welcome_back}</h2>
        <p className="text-white/90 text-sm">{t.account_login_subtitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username/Phone Field */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t.account_login_username_or_phone}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: "" });
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                errors.username ? "border-red-500" : "border-gray-300"
              } ${language === "ar" ? "text-right" : "text-left"}`}
              dir={language === "ar" ? "rtl" : "ltr"}
              placeholder={t.account_login_username_placeholder}
            />
            {errors.username && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t.account_login_password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } ${language === "ar" ? "text-right pr-12" : "text-left pl-4 pr-12"}`}
                dir={language === "ar" ? "rtl" : "ltr"}
                placeholder={t.account_login_password_placeholder}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  language === "ar" ? "left-3" : "right-3"
                } text-gray-500 hover:text-gray-700`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#009FE3] border-gray-300 rounded focus:ring-[#009FE3]"
              />
              <span className="text-sm text-gray-700">{t.account_login_remember_me}</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#009FE3] hover:underline"
            >
              {t.account_login_forgot_password}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t.account_login_logging_in}</span>
              </div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                {t.account_login_button}
              </>
            )}
          </button>

          {/* Create Account Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">{t.account_login_no_account}</p>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="w-full border-2 border-[#009FE3] text-[#009FE3] py-3 rounded-xl hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <UserPlus className="w-5 h-5" />
              {t.account_login_create_account}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
