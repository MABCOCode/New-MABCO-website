// components/SEOSection.tsx
import React from 'react';

interface SEOSectionProps {
  language: 'ar' | 'en';
}

const SEOSection: React.FC<SEOSectionProps> = ({ language }) => {
  // This component adds structured data and meta information for SEO
  // It's rendered as a hidden div with JSON-LD structured data

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": "MABCO Electronics",
    "image": "https://mabcoonline.com/images/Mabco%20100x100.jpg",
    "description": language === 'ar' 
      ? "أكبر متجر للأجهزة الإلكترونية في سوريا - هواتف ذكية، لابتوبات، تلفزيونات، أجهزة منزلية، وألعاب إلكترونية"
      : "Largest electronics store in Syria - smartphones, laptops, TVs, home appliances, and gaming devices",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": language === 'ar' ? "شارع الحمرا" : "Al Hamra Street",
      "addressLocality": "Damascus",
      "addressCountry": "SY"
    },
    "priceRange": "$$",
    "telephone": "+963-11-123-4567",
    "openingHours": [
      "Mo-Fr 09:00-21:00",
      "Sa-Su 10:00-20:00"
    ],
    "sameAs": [
      "https://www.facebook.com/mabcosyria",
      "https://www.instagram.com/mabco_official_site",
      "https://telegram.me/MABCOtelegram",
      "https://wa.me/+963961109909"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? "الرئيسية" : "Home",
        "item": "https://mabcoonline.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ar' ? "المنتجات" : "Products",
        "item": "https://mabcoonline.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": language === 'ar' ? "الأقسام" : "Categories",
        "item": "https://mabcoonline.com/categories"
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": language === 'ar' ? "هل المنتجات أصلية؟" : "Are the products original?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "نعم، جميع منتجاتنا أصلية 100% مع ضمان معتمد وفواتير رسمية."
            : "Yes, all our products are 100% original with certified warranty and official invoices."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "ما هي فترة الضمان؟" : "What is the warranty period?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "فترة الضمان تتراوح من سنة إلى 3 سنوات حسب المنتج، مع إمكانية التمديد."
            : "Warranty period ranges from 1 to 3 years depending on the product, with extension options."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "هل يوجد توصيل مجاني؟" : "Is there free delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "نعم، التوصيل مجاني لجميع أنحاء سوريا للمشتريات فوق 500,000 ليرة سورية."
            : "Yes, free delivery across all Syria for purchases above 500,000 Syrian Pounds."
        }
      }
    ]
  };

  return (
    <>
      {/* Hidden structured data for search engines */}
      <div className="sr-only">
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MABCO Electronics",
            "url": "https://mabcoonline.com",
            "logo": "https://mabcoonline.com/images/Mabco%20100x100.jpg",
            "sameAs": [
              "https://www.facebook.com/mabcosyria",
              "https://www.instagram.com/mabco_official_site",
              "https://telegram.me/MABCOtelegram",
              "https://wa.me/+963961109909"
            ]
          })}
        </script>

        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "MABCO Electronics - Damascus Main Branch",
            "image": "https://mabcoonline.com/images/store.jpg",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": language === 'ar' ? "شارع الحمرا، بناية رقم 15" : "Al Hamra Street, Building 15",
              "addressLocality": "Damascus",
              "postalCode": "00963",
              "addressCountry": "SY"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "33.5138",
              "longitude": "36.2765"
            },
            "url": "https://mabcoonline.com",
            "telephone": "+963-11-123-4567",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "21:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday"],
                "opens": "10:00",
                "closes": "20:00"
              }
            ]
          })}
        </script>
      </div>

      {/* Hidden content for SEO (not visible to users) */}
      <div className="sr-only" aria-hidden="true">
        <h2>{language === 'ar' ? 'كلمات مفتاحية' : 'Keywords'}</h2>
        <p>
          {language === 'ar'
            ? 'شراء أجهزة إلكترونية في سوريا، هواتف ذكية دمشق، لابتوبات للبيع، تلفزيونات LED، أجهزة منزلية كهربائية، ألعاب إلكترونية، ضمان معتمد، صيانة أجهزة، متجر إلكتروني موثوق، أسعار تنافسية، توصيل مجاني، فروع في 6 مدن، بطاريات وإنفرترات، بطاريات وانفرترات، إنفرترات، انفرترات، إنفرتر، انفرتر، بطاريات ليثيوم، بطاريات شمسية، بطاريات منزلية، عاكس كهربائي، عاكس طاقة، تخزين الطاقة، محطة طاقة، محطة طاقة متنقلة'
            : 'Buy electronics in Syria, smartphones Damascus, laptops for sale, LED TVs, home electrical appliances, electronic games, certified warranty, device maintenance, trusted electronic store, competitive prices, free delivery, branches in 6 cities, batteries and inverters, battery inverter, inverter, inverters, batteries, battery, power station, portable power station, solar battery, lithium battery, home battery, backup power, energy storage'}
        </p>
        
        <h3>{language === 'ar' ? 'علامات تجارية نبيعها' : 'Brands We Sell'}</h3>
        <p>Samsung, Apple iPhone, Xiaomi, Sony, Honor, EcoFlow, Deye, Huawei, Dell, HP, Lenovo, Asus, LG, Philips, Bosch</p>

        <h3>{language === 'ar' ? 'هواتف بأسعار لا تُهزم' : 'Mobile Phones at Unbeatable Prices'}</h3>
        <p>
          {language === 'ar'
            ? 'تصفح أحدث الهواتف الذكية من أبرز العلامات مثل نوكيا وسامسونغ وآبل بأسعار تنافسية.'
            : 'Explore the latest smartphones from top brands like Nokia, Samsung, and Apple - all at competitive rates.'}
        </p>

        <h3>{language === 'ar' ? 'بيع بالجملة والتجزئة' : 'MABCO Wholesale & Retail Electronics'}</h3>
        <p>
          {language === 'ar'
            ? 'سواء كنت مستهلكاً أو تاجراً، نوفر أسعار جملة وحِزم منتجات مخصّصة تناسب احتياجك.'
            : "Whether you're a consumer or business, MABCO provides bulk pricing and tailored product packages."}
        </p>

        <h3>{language === 'ar' ? 'ضمان وخدمات صيانة معتمدة' : 'Certified Warranty & Repair Services'}</h3>
        <p>
          {language === 'ar'
            ? 'دعم سريع وموثوق من فنيين خبراء في مراكز صيانة معتمدة داخل سوريا.'
            : 'Get fast, reliable support from our expert technicians at authorized service centers across Syria.'}
        </p>

        <h3>{language === 'ar' ? 'موزّع موثوق منذ 1999' : 'Trusted Mobile Distributor in Syria Since 1999'}</h3>
        <p>
          {language === 'ar'
            ? 'خبرة تمتد لعقود تجعل مابكو مرجعاً للهواتف والمنتجات التقنية عالية الجودة في سوريا.'
            : "With decades of experience, MABCO is Syria's go-to source for quality mobile and tech products."}
        </p>

        <h3>{language === 'ar' ? 'معارض في المدن السورية الكبرى' : 'Showrooms Across Major Syrian Cities'}</h3>
        <p>
          {language === 'ar'
            ? 'قم بزيارة فروعنا في دمشق وحلب وحمص وطرطوس لتجربة أحدث الأجهزة على أرض الواقع.'
            : 'Visit our branches in Damascus, Aleppo, Homs, and Tartus to shop the newest devices in person.'}
        </p>
        
        <h3>{language === 'ar' ? 'أقسام المنتجات' : 'Product Categories'}</h3>
        <p>
          {language === 'ar'
            ? 'هواتف ذكية، لابتوبات وأجهزة كمبيوتر، تلفزيونات وشاشات، سماعات وأجهزة صوت، أجهزة منزلية، ألعاب إلكترونية، كاميرات وتصوير، أجهزة طاقة وشحن، إكسسوارات إلكترونية، بطاريات وإنفرترات، بطاريات طاقة، إنفرترات شمسية، بطاريات منزلية، محطات طاقة'
            : 'Smartphones, laptops and computers, TVs and screens, headphones and audio devices, home appliances, electronic games, cameras and photography, power and charging devices, electronic accessories, batteries and inverters, solar inverters, home batteries, power stations'}
        </p>
        
        <h3>{language === 'ar' ? 'مدن التغطية' : 'Cities We Cover'}</h3>
        <p>Damascus, Aleppo, Homs, Latakia, Tartus, Sweida - جميع أنحاء سوريا</p>
        
        <h3>{language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}</h3>
        <p>
          {language === 'ar'
            ? 'هاتف: 0111234567، واتساب: 0933123456، بريد إلكتروني: info@mabcoonline.com، عنوان: دمشق، شارع الحمرا، أوقات العمل: من الساعة 9 صباحاً حتى 9 مساءً'
            : 'Phone: 0111234567, WhatsApp: 0933123456, Email: info@mabcoonline.com, Address: Damascus, Al Hamra Street, Working Hours: 9 AM to 9 PM'}
        </p>
      </div>
    </>
  );
};

export default SEOSection;
