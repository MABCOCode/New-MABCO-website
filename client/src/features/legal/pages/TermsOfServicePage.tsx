import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const TermsOfServicePage: React.FC = () => {
  const { language, t } = useLanguage();

  const isArabic = language === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>

            <div className="prose prose-lg max-w-none">
              {isArabic ? (
                <div className="space-y-6 text-right">
                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      قبول الشروط
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      باستخدامك لموقع مابكو، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      وصف الخدمة
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      موقع مابكو يوفر منصة إلكترونية لعرض وبيع المنتجات الإلكترونية والإكسسوارات، بالإضافة إلى تقديم خدمات الصيانة والضمان.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      حقوق والتزامات المستخدم
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>يجب على المستخدم تقديم معلومات دقيقة وحديثة عند التسجيل أو إجراء عمليات الشراء.</li>
                      <li>يحق للمستخدم استخدام الموقع لأغراض شخصية فقط وليس لأغراض تجارية.</li>
                      <li>يجب على المستخدم الحفاظ على سرية كلمة المرور ومسؤوليته عن جميع الأنشطة التي تحدث تحت حسابه.</li>
                      <li>لا يحق للمستخدم نسخ أو توزيع أو بيع أي محتوى من الموقع.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      حقوق الشركة
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>تحتفظ الشركة بالحق في تعديل أو إيقاف الخدمات في أي وقت.</li>
                      <li>يحق للشركة مراقبة وتسجيل استخدام الموقع لضمان الامتثال للشروط.</li>
                      <li>تحتفظ الشركة بالحق في رفض الخدمة لأي مستخدم ينتهك هذه الشروط.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      الشراء والدفع
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      جميع المشتريات تخضع للتوافر والأسعار المعروضة على الموقع. يحق للمستخدم إلغاء الطلب خلال 48 ساعة من الشراء.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      الضمان والإرجاع
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      تخضع جميع المنتجات لشروط الضمان المحددة من قبل الشركة المصنعة. يرجى مراجعة شروط الضمان في قسم الضمان على الموقع.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      القيود والاستثناءات
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      لا تتحمل الشركة مسؤولية عن أي أضرار غير مباشرة أو تبعية ناتجة عن استخدام الموقع. الشركة غير مسؤولة عن توافر المنتجات أو دقة المعلومات.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      إنهاء الخدمة
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      يحق للشركة إنهاء أو تعليق حساب المستخدم في حال انتهاك الشروط. كما يحق للمستخدم إنهاء استخدامه للموقع في أي وقت.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      التعديلات على الشروط
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      تحتفظ الشركة بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بالتغييرات من خلال الموقع.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      القانون المطبق
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      تخضع هذه الشروط لقوانين الجمهورية العربية السورية. أي نزاع ينشأ عن هذه الشروط سيخضع لاختصاص المحاكم السورية.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Acceptance of Terms
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      By using the MABCO website, you agree to be bound by these Terms of Service. If you do not agree to any of these terms, please do not use the website.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Service Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      MABCO website provides an electronic platform for displaying and selling electronic products and accessories, in addition to providing maintenance and warranty services.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      User Rights and Obligations
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>The user must provide accurate and up-to-date information when registering or making purchases.</li>
                      <li>The user has the right to use the website for personal purposes only and not for commercial purposes.</li>
                      <li>The user must maintain the confidentiality of the password and is responsible for all activities that occur under their account.</li>
                      <li>The user is not entitled to copy, distribute, or sell any content from the website.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Company Rights
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>The company reserves the right to modify or discontinue services at any time.</li>
                      <li>The company has the right to monitor and record website usage to ensure compliance with terms.</li>
                      <li>The company reserves the right to refuse service to any user who violates these terms.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Purchase and Payment
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      All purchases are subject to availability and prices displayed on the website. The user has the right to cancel the order within 48 hours of purchase.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Warranty and Returns
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      All products are subject to warranty terms specified by the manufacturer. Please review the warranty terms in the warranty section on the website.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Limitations and Exclusions
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The company is not liable for any indirect or consequential damages resulting from the use of the website. The company is not responsible for product availability or information accuracy.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Service Termination
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The company has the right to terminate or suspend the user's account in case of violation of terms. The user also has the right to terminate their use of the website at any time.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Modifications to Terms
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The company reserves the right to modify these terms at any time. Users will be notified of changes through the website.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Applicable Law
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      These terms are subject to the laws of the Syrian Arab Republic. Any dispute arising from these terms will be subject to the jurisdiction of Syrian courts.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;