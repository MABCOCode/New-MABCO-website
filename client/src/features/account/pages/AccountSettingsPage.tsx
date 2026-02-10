import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import translations from "../../../i18n/translations";

interface AccountSettingsPageProps {
  language: "ar" | "en";
  user: any;
  onBack: () => void;
  onSave: (updatedUser: any) => void;
}


export function AccountSettingsPage({
  language,
  user,
  onBack,
  onSave,
}: AccountSettingsPageProps) {
  const [fullName, setFullName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [email, setEmail] = useState(user.email || "");

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const validatePersonalInfo = () => {
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = t.account_settings_name_required;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t.account_settings_phone_required;
    } else if (!/^09\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = t.account_settings_phone_invalid;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.account_settings_email_invalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: any = {};

    if (!currentPassword) {
      newErrors.currentPassword = t.account_settings_current_password_required;
    }

    if (!newPassword) {
      newErrors.newPassword = t.account_settings_new_password_required;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t.account_settings_password_short;
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = t.account_settings_password_mismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalInfo = () => {
    if (!validatePersonalInfo()) return;

    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: fullName,
        nameEn: fullName,
        phone: phoneNumber,
        email: email || null,
      };
      onSave(updatedUser);
      setIsLoading(false);
      alert(t.account_settings_update_success);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(t.account_settings_password_changed);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordSection(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            {language === "ar" ? (
              <>
                <span>{t.account_settings_back}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>{t.account_settings_back}</span>
              </>
            )}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{t.account_settings_title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2
            className={`text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 ${
              language === "ar" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <User className="w-6 h-6 text-[#009FE3]" />
            <span>{t.account_settings_personal_info}</span>
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.account_settings_full_name}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors({ ...errors, fullName: "" });
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } ${language === "ar" ? "text-right" : "text-left"}`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              {errors.fullName && (
                <p
                  className={`text-red-500 text-sm mt-1 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.account_settings_phone_number}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrors({ ...errors, phoneNumber: "" });
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                dir="ltr"
              />
              {errors.phoneNumber && (
                <p
                  className={`text-red-500 text-sm mt-1 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.account_settings_email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } ${language === "ar" ? "text-right" : "text-left"}`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              {errors.email && (
                <p
                  className={`text-red-500 text-sm mt-1 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePersonalInfo}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t.account_settings_save}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className={`w-full text-xl font-bold text-gray-900 mb-4 flex items-center justify-between ${
              language === "ar" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Lock className="w-6 h-6 text-[#009FE3]" />
              <span>{t.account_settings_change_password}</span>
            </div>
            {showPasswordSection ? (
              language === "ar" ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )
            ) : language === "ar" ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
          </button>

          {showPasswordSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Current Password */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_settings_current_password}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrors({ ...errors, currentPassword: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                      errors.currentPassword ? "border-red-500" : "border-gray-300"
                    } ${language === "ar" ? "text-right pr-12" : "text-left pl-4 pr-12"}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      language === "ar" ? "left-3" : "right-3"
                    } text-gray-500 hover:text-gray-700`}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_settings_new_password}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    } ${language === "ar" ? "text-right pr-12" : "text-left pl-4 pr-12"}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      language === "ar" ? "left-3" : "right-3"
                    } text-gray-500 hover:text-gray-700`}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_settings_confirm_new_password}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setErrors({ ...errors, confirmNewPassword: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                      errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
                    } ${language === "ar" ? "text-right pr-12" : "text-left pl-4 pr-12"}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      language === "ar" ? "left-3" : "right-3"
                    } text-gray-500 hover:text-gray-700`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>

              {/* Change Password Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setErrors({});
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  {t.account_settings_cancel}
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 font-medium"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      {t.account_settings_save}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
