import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const PrivacyPolicyPage: React.FC = () => {
  const { language, t } = useLanguage();

  const isArabic = language === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>

            <div className="prose prose-lg max-w-none">
              {isArabic ? (
                <div className="space-y-6 text-right">
                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      تعريف بالموقع وطبيعة عمله
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      موقع مابكو هو الموقع الإلكتروني الخاص بشركة مابكو والذي يقوم بعرض جميع المنتجات المتواجدة في صالات الشركة من أجهزة إلكترونية بالإضافة إلى قطع الإكسسوارات المختلفة والمتنوعة، كما يقوم الموقع بعرض الخدمات التي تقدمها الشركة للمستخدمين.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      الجهة المسؤولة عن الموقع
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      الموقع خاص بشركة مابكو ولها العنوان التالي: دمشق البرامكة خلف ملعب تشرين بنائ الزيات.
                      <br />
                      ويمكن التواصل مع الشركة من خلال البريد الإلكتروني: info@mabco.biz أو على رقم الهاتف: 0119909
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      الفئات المستهدفة
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      كافة الفئات العمرية
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      توصيف عمل الموقع
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      يمكنك من خلال الموقع الاستفادة من الخدمات التالية:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>استعراض الأجهزة الإلكترونية الموجودة في كافة صالات الشركة بالإضافة إلى الإكسسوارات والألعاب وقطع التبديل الخاصة بالأجهزة.</li>
                      <li>الاطلاع على العروض التي تقدمها الشركة على كافة خدمات الطباعة على الإكسسوارات والخشب والسيراميك والقماش وغيرها.</li>
                      <li>تحديد الأجهزة المناسبة التي يمكنك شراءها وذلك من خلال خدمة فلتر الأسعار.</li>
                      <li>تحديد الجهاز ذو المواصفات والسعر المناسب من خلال خدمة مقارنة المنتجات.</li>
                      <li>الاطلاع على الحسومات التي تقدمها الشركة من خلال خدمة قوائم التوفير.</li>
                      <li>معرفة عناوين وأرقام تواصل كافة صالات الشركة من خلال الاطلاع على قسم صالات العرض.</li>
                      <li>الاطلاع على شروط كفالة مابكو من خلال الدخول إلى قسم شروط كفالة مابكو.</li>
                      <li>تقديم طلب توظيف من خلال الدخول إلى قسم التوظيف.</li>
                      <li>الاطلاع على الخدمات التي تقدمها الشركة من خلال الدخول إلى قسم الخدمات، حيث يتم عرض الخدمات التي تقدمها الشركة كخدمة التحقق من كفالة الجهاز وحالة الجهاز في الصيانة وغيرها من الخدمات.</li>
                    </ol>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      حقوق المستخدم ومسؤولياته وآليات الحماية والخصوصية لمعلوماته
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>يحق للمستخدم استخدام الموقع مجاناً بما لا يخالف الأنظمة والقوانين المطبقة في الجمهورية العربية السورية.</li>
                      <li>يحق للمستخدم طلب عدم نشر بياناته التي يتم جمعها عند تقديم طلب توظيف من خلال الموقع دون موافقته.</li>
                      <li>يحق للمستخدم إلغاء طلب شراء أي جهاز خلال مدة يومين شرط أن يكون المنتج مختوم بختم وغلاف الشركة المصنعة.</li>
                      <li>لا يحق للمستخدم استخدام الموقع بأي حال من الأحوال لأغراض تجارية، أو لارتكاب أفعال تؤدي للإساء لأي شخص سواءً مادياً أو معنوياً.</li>
                      <li>يعتبر المستخدم مسؤولاً عن إساءة استخدام الموقع أو تسريب معلوماته.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      حقوق الجهة المسؤولة عن الموقع وواجباتها
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      جمع المعلومات عن المستخدمين
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      حيث يتم طلب اسم المستخدم ورقمه والعنوان المصرح عنه لتسليم طلب الشراء، في حال تم تقديم الطلب إلكترونياً، كما يتم جمع المعلومات الشخصية الكاملة عند تقديم طلب توظيف عبر موقع مابكو، ويحق للمستخدم طلب عدم نشر بياناته دون موافقته.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>لا يتم الإفصاح عن هذه المعلومات إطلاقاً مع أي طرف آخر إلا إذا كانت بموجب مسوغ قانوني أو لحماية الشركة، كما لن تكون هذه المعلومات متاحة للاطلاع عليها بصورة عامة من دون موافقة المستخدم.</li>
                      <li>يحق للشركة تقديم المعلومات التي يتم جمعها عن المستخدم لموظفي الشركة وذلك للمساعدة في تقديم أفضل خدمة والعمل على تطوير خدماتها بشكل دائم.</li>
                      <li>يحق للشركة إضافة أية خدمات جديدة أو تعديل الخدمات الموجودة حالياً أو إلغاءها.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      الإجراءات التي ستتخذها الجهة في حال مخالفة المستخدم لسياسة الاستخدام
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      يحق للشركة إيقاف خدمة الموقع عن المستخدم أو إلغاءها وذلك في حال مخالفته لشروط الاستخدام كما يحق للشركة أو ممثليها اتخاذ كافة الإجراءات القانونية التي تراها الشركة مناسبة وذلك في حال استخدام الموقع بشكل مسيء أو عند محاولة التشهير والتشويه لسمعة الشركة.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      تعديل سياسة الاستخدام
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      تحتفظ الشركة بحقها في تحديث وتطوير هذه السياسة في أي وقت، على أن يتم اعتبار هذه السياسة سارية منذ لحظة الإعلان عنها، ويجب على المستخدم مراجعة السياسة بصورة منتظمة للبحث عن أي تغييرات.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Website Definition and Nature of Work
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      MABCO website is the electronic website of MABCO company, which displays all products available in the company's showrooms, including electronic devices in addition to various and diverse accessories, and the website also displays the services provided by the company to users.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      The Entity Responsible for the Website
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The website is owned by MABCO company with the following address: Damascus, Al-Baramkeh, behind Al-Tashreen Stadium, Al-Zayat Building.
                      <br />
                      The company can be contacted via email: info@mabco.biz or by phone: 0119909
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Target Categories
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      All age categories
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Website Operation Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Through the website, you can benefit from the following services:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Browse electronic devices available in all company showrooms in addition to accessories, games, and device replacement parts.</li>
                      <li>View the offers provided by the company on all printing services on accessories, wood, ceramics, fabric, and others.</li>
                      <li>Select suitable devices that you can purchase through the price filter service.</li>
                      <li>Select the device with appropriate specifications and price through the product comparison service.</li>
                      <li>View the discounts offered by the company through the savings lists service.</li>
                      <li>Know the addresses and contact numbers of all company showrooms by viewing the Showrooms section.</li>
                      <li>View MABCO warranty terms by entering the MABCO Warranty Terms section.</li>
                      <li>Submit a job application by entering the Employment section.</li>
                      <li>View the services provided by the company by entering the Services section, where services provided by the company are displayed such as device warranty verification service, device status in maintenance, and other services.</li>
                    </ol>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      User Rights and Responsibilities and Mechanisms for Protecting and Privacy of Information
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>The user has the right to use the website free of charge without violating the systems and laws applicable in the Syrian Arab Republic.</li>
                      <li>The user has the right to request not to publish their data collected when submitting a job application through the website without their consent.</li>
                      <li>The user has the right to cancel any device purchase order within two days, provided that the product is sealed with the manufacturer's stamp and wrapper.</li>
                      <li>The user is not entitled to use the website under any circumstances for commercial purposes, or to commit acts that lead to harm to any person, whether materially or morally.</li>
                      <li>The user is responsible for misuse of the website or leakage of their information.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Rights and Duties of the Entity Responsible for the Website
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Collection of Information about Users
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Where the user's name, number, and declared address are requested for delivery of the purchase order, in case the order was submitted electronically, and complete personal information is collected when submitting a job application through the MABCO website, and the user has the right to request not to publish their data without their consent.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>This information is not disclosed at all to any other party unless it is based on a legal justification or to protect the company, and this information will not be available for public viewing without the user's consent.</li>
                      <li>The company has the right to provide the information collected about the user to company employees to help provide better service and work on developing its services continuously.</li>
                      <li>The company has the right to add any new services or modify existing services or cancel them.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Procedures to be Taken by the Entity in Case of User Violation of Usage Policy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The company has the right to stop the website service for the user or cancel it in case of violation of the terms of use, and the company or its representatives have the right to take all legal measures that the company deems appropriate in case of misuse of the website or when attempting to defame and distort the company's reputation.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                      Modification of Usage Policy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      The company reserves the right to update and develop this policy at any time, and this policy shall be considered effective from the moment it is announced, and the user must review the policy regularly to look for any changes.
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

export default PrivacyPolicyPage;