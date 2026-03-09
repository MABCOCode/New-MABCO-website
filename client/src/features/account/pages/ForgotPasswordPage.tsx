import { useEffect, useState } from "react";
import { X, Eye, EyeOff, KeyRound } from "lucide-react";
import { motion } from "motion/react";
import translations from "../../../i18n/translations";

interface ForgotPasswordPageProps {
  language: "ar" | "en";
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ language, onClose, onBackToLogin }: ForgotPasswordPageProps) {
  const t = translations[language];
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (otpSent && resendTimer === 0) {
      setCanResend(true);
    }
  }, [otpSent, resendTimer]);

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
    return t.account_error_generic;
  };

  const validateRequest = () => {
    const nextErrors: any = {};
    if (!phoneNumber.trim()) {
      nextErrors.phoneNumber = t.account_signup_phone_required;
    } else if (!/^09\d{8}$/.test(phoneNumber)) {
      nextErrors.phoneNumber = t.account_signup_phone_invalid;
    }
    if (!newPassword) {
      nextErrors.newPassword = t.account_signup_password_required;
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = t.account_signup_password_short;
    }
    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = t.account_signup_password_mismatch;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateVerify = () => {
    const nextErrors: any = {};
    if (otpCode.trim().length !== 6) {
      nextErrors.code = t.account_forgot_code_required;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResend = async () => {
    if (!canResend || isLoading) return;
    setApiError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "");
      }
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setApiError(mapAuthError(err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!otpSent) {
      if (!validateRequest()) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/password/request-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneNumber }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.message || "");
        }
        setOtpSent(true);
        setResendTimer(60);
        setCanResend(false);
      } catch (err: any) {
        setApiError(mapAuthError(err?.message));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validateVerify()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, code: otpCode, newPassword }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "");
      }
      setSuccess(true);
    } catch (err: any) {
      setApiError(mapAuthError(err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-[#009FE3]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{t.account_forgot_title}</h2>
            <p className="text-gray-600 text-sm mb-6">{t.account_forgot_subtitle}</p>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.account_forgot_phone}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors({ ...errors, phoneNumber: "" });
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009FE3] focus:border-transparent ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t.account_login_username_placeholder}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.account_forgot_new_password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009FE3] focus:border-transparent ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
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
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.account_forgot_confirm_password}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009FE3] focus:border-transparent ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      language === "ar" ? "left-3" : "right-3"
                    } text-gray-500 hover:text-gray-700`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.account_forgot_code}
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      setErrors({ ...errors, code: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009FE3] focus:border-transparent ${
                      errors.code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123456"
                  />
                  {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                </div>
              )}

              {otpSent && (
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                    className="text-[#007BC7] font-semibold disabled:text-gray-400"
                  >
                    {t.account_signup_resend_code}
                  </button>
                  {!canResend && (
                    <span className="text-gray-500">
                      {t.account_signup_resend_in} {resendTimer} {t.account_signup_seconds}
                    </span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {isLoading ? t.account_login_logging_in : otpSent ? t.account_forgot_verify : t.account_forgot_send_code}
              </button>
            </form>

            <button
              onClick={onBackToLogin}
              className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              {t.account_forgot_back_login}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.account_forgot_success}</h3>
            <button
              onClick={onBackToLogin}
              className="w-full mt-6 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {t.account_forgot_back_login}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
