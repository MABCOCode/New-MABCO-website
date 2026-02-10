import { useState, useRef, useEffect } from "react";
import { X, Eye, EyeOff, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import translations from "../../../i18n/translations";

interface SignupFlowProps {
  language: "ar" | "en";
  onClose: () => void;
  onSignupSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

export function SignupFlow({
  language,
  onClose,
  onSignupSuccess,
  onSwitchToLogin,
}: SignupFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 fields
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  // Resend timer
  useEffect(() => {
    if (currentStep === 2 && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [currentStep, resendTimer]);

  const validateStep1 = () => {
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = t.account_signup_name_required;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t.account_signup_phone_required;
    } else if (!/^09\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = t.account_signup_phone_invalid;
    }

    if (!password) {
      newErrors.password = t.account_signup_password_required;
    } else if (password.length < 6) {
      newErrors.password = t.account_signup_password_short;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.account_signup_password_mismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const code = verificationCode.join("");
    const newErrors: any = {};

    if (code.length !== 6) {
      newErrors.code = t.account_signup_code_required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setDirection(1);
      setCurrentStep(2);
      setResendTimer(60);
      setCanResend(false);
      // Auto-focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 1000);
  };

  const handleStep2Verify = () => {
    if (!validateStep2()) return;

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setDirection(1);
      setCurrentStep(3);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          name: fullName,
          nameEn: fullName,
          phone: phoneNumber,
          email: email || null,
        };
        onSignupSuccess(newUser);
      }, 2000);
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setResendTimer(60);
    setCanResend(false);
    setVerificationCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(currentStep - 1);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (language === "ar" ? -300 : 300) : language === "ar" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? (language === "ar" ? 300 : -300) : language === "ar" ? -300 : 300,
      opacity: 0,
    }),
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
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
            <h2 className="text-2xl font-bold mb-2">{t.account_signup_create_account}</h2>
            <p className="text-white/90 text-sm">
              {t.account_signup_step} {currentStep} {t.account_signup_of} 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "33.33%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps Content */}
        <div className="p-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-4 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_signup_account_info}
                </h3>

                {/* Full Name */}
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t.account_signup_full_name}
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
                    {t.account_signup_phone_number}
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
                    placeholder="09XXXXXXXX"
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
                    {t.account_signup_email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t.account_signup_password}
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

                {/* Confirm Password */}
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t.account_signup_confirm_password}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors({ ...errors, confirmPassword: "" });
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
                  {errors.confirmPassword && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleStep1Next}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 font-medium mt-6"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t.account_signup_next}
                      {language === "ar" ? (
                        <ArrowLeft className="w-5 h-5" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {t.account_signup_have_account}{" "}
                    <button
                      onClick={onSwitchToLogin}
                      className="text-[#009FE3] hover:underline font-medium"
                    >
                      {t.account_signup_login}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_signup_verify_phone}
                </h3>
                <p
                  className={`text-sm text-gray-600 mb-6 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_signup_verification_sent}
                  <br />
                  <span className="font-semibold text-[#009FE3]">{phoneNumber}</span>
                </p>

                <p
                  className={`text-sm text-gray-700 mb-4 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_signup_enter_code}
                </p>

                {/* Verification Code Inputs */}
                <div className="flex justify-center gap-2 mb-6" dir="ltr">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-[#009FE3] transition-all"
                    />
                  ))}
                </div>

                {errors.code && (
                  <p
                    className={`text-red-500 text-sm text-center mb-4 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.code}
                  </p>
                )}

                {/* Resend Code */}
                <div className="text-center mb-6">
                  {canResend ? (
                    <button
                      onClick={handleResendCode}
                      className="text-[#009FE3] hover:underline text-sm font-medium"
                    >
                      {t.account_signup_resend_code}
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {t.account_signup_resend_in} {resendTimer} {t.account_signup_seconds}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    {language === "ar" ? (
                      <ArrowRight className="w-5 h-5" />
                    ) : (
                      <ArrowLeft className="w-5 h-5" />
                    )}
                    {t.account_signup_back}
                  </button>
                  <button
                    onClick={handleStep2Verify}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 font-medium"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {t.account_signup_verify}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.account_signup_success}</h3>
                <p className="text-gray-600 mb-6">{t.account_signup_account_created}</p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-[#009FE3] border-t-transparent rounded-full animate-spin"></div>
                  {t.account_signup_redirecting}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
