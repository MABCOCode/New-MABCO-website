import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Save,
  User
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import translations from "../../../i18n/translations";

interface AccountSettingsPageProps {
  language: "ar" | "en";
  user: any;
  onBack: () => void;
  onSave: (updatedUser: any) => Promise<void> | void;
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
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpDeliveryNotice, setOtpDeliveryNotice] = useState<string | null>(null);
  const [otpFallbackNotice, setOtpFallbackNotice] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const t = translations[language];
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    setFullName(user?.name || "");
    setPhoneNumber(user?.phone || "");
    setEmail(user?.email || "");
  }, [user]);

  const mapAuthError = (message?: string) => {
    const normalized = (message || "").toLowerCase();
    if (normalized.includes("invalid phone")) return t.account_error_invalid_phone;
    if (normalized.includes("otp limit")) return t.account_error_otp_limit;
    if (normalized.includes("failed to send otp")) return t.account_error_otp_send_failed;
    if (normalized.includes("otp not found")) return t.account_error_otp_not_found;
    if (normalized.includes("otp expired")) return t.account_error_otp_expired;
    if (normalized.includes("invalid otp")) return t.account_error_otp_invalid;
    if (normalized.includes("user not found")) return t.account_error_user_not_found;
    if (normalized.includes("invalid payload")) return t.account_error_invalid_payload;
    if (normalized.includes("phone already")) return t.account_error_invalid_phone;
    if (normalized.includes("email already")) return t.account_settings_email_invalid;
    return t.account_error_generic;
  };

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

  const handleSavePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          currentPhone: user?.phone,
          phone: phoneNumber.trim(),
          name: fullName.trim(),
          email: email.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json?.fieldErrors) {
          setErrors((prev: any) => ({
            ...prev,
            fullName: json.fieldErrors?.name ? t.account_settings_name_required : prev.fullName,
            phoneNumber: json.fieldErrors?.phone ? t.account_settings_phone_invalid : prev.phoneNumber,
            email: json.fieldErrors?.email ? t.account_settings_email_invalid : prev.email,
          }));
        }
        throw new Error(json?.message || "");
      }

      const updatedUser = {
        ...user,
        ...json?.data,
        nameEn: json?.data?.name || fullName.trim(),
      };
      await Promise.resolve(onSave(updatedUser));
      alert(t.account_settings_update_success);
    } catch (err: any) {
      setApiError(mapAuthError(err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setApiError(null);
    (async () => {
      try {
        if (!otpSent) {
          setOtpSending(true);
          const res = await fetch(`${API_BASE}/auth/password/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phoneNumber }),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            setApiError(json?.message || (language === "ar" ? "فشل تغيير كلمة المرور" : "Failed to change password"));
            setRemainingAttempts(json?.remainingAttempts ?? null);
            setOtpSending(false);
            setIsLoading(false);
            return;
          }
          setOtpSent(true);
          setOtpCode("");
          setRemainingAttempts(json?.remainingAttempts ?? null);
          setOtpDeliveryNotice(t.account_otp_delivery_notice);
          setOtpFallbackNotice(json?.delivery?.fallbackNotice ? t.account_otp_delivery_fallback : null);
          setIsLoading(false);
          setOtpSending(false);
          return;
        }

        if (otpCode.trim().length !== 6) {
          setIsLoading(false);
          setApiError(t.account_signup_code_required);
          return;
        }

        const res = await fetch(`${API_BASE}/auth/password/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneNumber, code: otpCode, newPassword }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.message || (language === "ar" ? "فشل تغيير كلمة المرور" : "Failed to change password"));
        }
        alert(t.account_settings_password_changed);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setOtpCode("");
        setOtpSent(false);
        setShowPasswordSection(false);
      } catch (err: any) {
        setApiError(err?.message || (language === "ar" ? "فشل تغيير كلمة المرور" : "Failed to change password"));
      } finally {
        setIsLoading(false);
        setOtpSending(false);
      }
    })();
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
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {apiError}
              </div>
            )}
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

              {/* OTP Code */}
              {otpSent && (
                <div>
                  {otpDeliveryNotice && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 text-blue-700 px-3 py-2 text-sm mb-3">
                      {otpDeliveryNotice}
                    </div>
                  )}
                  {otpFallbackNotice && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2 text-sm mb-3">
                      {otpFallbackNotice}
                    </div>
                  )}
                  <label
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t.account_signup_verify}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                      errors.code ? "border-red-500" : "border-gray-300"
                    } ${language === "ar" ? "text-right" : "text-left"}`}
                    dir="ltr"
                  />
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p
                      className={`text-sm mt-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      } ${remainingAttempts <= 1 ? "text-red-600" : "text-gray-600"}`}
                    >
                      {language === "ar"
                        ? `${remainingAttempts} محاولات متبقية اليوم`
                        : `${remainingAttempts} attempts remaining today`}
                    </p>
                  )}
                  {remainingAttempts === 0 && (
                    <p
                      className={`text-sm mt-2 text-red-600 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "ar"
                        ? "تم الوصول إلى الحد الأقصى للمحاولات اليوم"
                        : "Maximum attempts reached for today"}
                    </p>
                  )}
                </div>
              )}

              {apiError && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {apiError}
                </div>
              )}

              {/* Change Password Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setOtpCode("");
                    setOtpSent(false);
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
                      {otpSent ? t.account_signup_verify : t.account_settings_save}
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
