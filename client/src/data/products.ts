import { Product, ProductOffer, DirectDiscountOffer, CouponOffer, FreeProductOffer, BundleDiscountOffer } from "../types/product";

export interface ProductWithOffers extends Product { offers?: ProductOffer[]; }
export interface ProductOfferEntry { productId: number; offers: ProductOffer[]; }

export const offersDatabase: ProductOfferEntry[] = [
  {
    "productId": 1,
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 15,
        "titleEn": "15% OFF Special Deal",
        "titleAr": "خصم 15٪ عرض خاص",
        "descriptionEn": "Save 15% on the latest iPhone 15 Pro. Limited time offer!",
        "descriptionAr": "وفر 15٪ على أحدث آيفون 15 برو. عرض لفترة محدودة!"
      }
    ]
  },
  {
    "productId": 101,
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 10,
        "titleEn": "10% OFF Apple ID",
        "titleAr": "خصم 10٪ على حساب آبل",
        "descriptionEn": "Get 10% off Apple ID account balances for a limited time",
        "descriptionAr": "احصل على خصم 10٪ على أرصدة حساب آبل لفترة محدودة"
      }
    ]
  },
  {
    "productId": 2,
    "offers": [
      {
        "type": "coupon",
        "couponValue": 100000,
        "titleEn": "Buy & Get 100,000 Coupon",
        "titleAr": "اشتري واحصل على كوبون 100,000",
        "descriptionEn": "Purchase Samsung Galaxy S24 and receive a 100,000 SYP coupon to spend on selected accessories",
        "descriptionAr": "اشترِ سامسونج جالاكسي S24 واحصل على كوبون بقيمة 100,000 ل.س للإنفاق على الإكسسوارات المختارة",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14
        ],
        "validityDays": 30
      }
    ]
  },
  {
    "productId": 3,
    "offers": [
      {
        "type": "free_product",
        "freeProductId": 15,
        "titleEn": "Free AirPods with MacBook",
        "titleAr": "إيربودز مجانية مع ماك بوك",
        "descriptionEn": "Get AirPods Pro absolutely free when you purchase MacBook Pro",
        "descriptionAr": "احصل على إيربودز برو مجاناً تماماً عند شراء ماك بوك برو"
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 25,
        "relatedProductIds": [
          16,
          17,
          18
        ],
        "titleEn": "25% OFF on Accessories",
        "titleAr": "خصم 25٪ على الإكسسوارات",
        "descriptionEn": "Get 25% discount on MacBook accessories when you buy this product",
        "descriptionAr": "احصل على خصم 25٪ على إكسسوارات ماك بوك عند شراء هذا المنتج"
      }
    ]
  },
  {
    "productId": 4,
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 50000,
        "titleEn": "Save 50,000 SYP",
        "titleAr": "وفّر 50,000 ل.س",
        "descriptionEn": "Instant discount of 50,000 SYP on iPad Air",
        "descriptionAr": "خصم فوري 50,000 ل.س على آيباد إير"
      },
      {
        "type": "coupon",
        "couponValue": 75000,
        "titleEn": "Bonus 75,000 Coupon",
        "titleAr": "كوبون إضافي 75,000",
        "descriptionEn": "Receive an additional 75,000 SYP coupon for future purchases",
        "descriptionAr": "احصل على كوبون إضافي بقيمة 75,000 ل.س للمشتريات المستقبلية",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14,
          19,
          20
        ],
        "validityDays": 45
      }
    ]
  },
  {
    "productId": 5,
    "offers": [
      {
        "type": "free_product",
        "freeProductId": 21,
        "titleEn": "Free Extra Band",
        "titleAr": "حزام إضافي مجاني",
        "descriptionEn": "Get a premium sport band free with your Apple Watch purchase",
        "descriptionAr": "احصل على حزام رياضي مجاني مع شراء آبل ووتش"
      }
    ]
  },
  {
    "productId": 6,
    "offers": [
      {
        "type": "bundle_discount",
        "discountPercentage": 20,
        "relatedProductIds": [
          22,
          23,
          24
        ],
        "titleEn": "20% OFF Bundle",
        "titleAr": "خصم 20٪ على الحزمة",
        "descriptionEn": "Save 20% when you bundle with headphone accessories",
        "descriptionAr": "وفر 20٪ عند الشراء مع إكسسوارات السماعات"
      }
    ]
  },
  {
    "productId": 7,
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 30,
        "titleEn": "30% Flash Sale",
        "titleAr": "تخفيضات سريعة 30٪",
        "descriptionEn": "Limited flash sale - 30% off on premium power banks",
        "descriptionAr": "تخفيضات سريعة محدودة - خصم 30٪ على البطاريات المحمولة المميزة"
      }
    ]
  },
  {
    "productId": 8,
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 150000,
        "titleEn": "Mega Deal - 150,000 OFF",
        "titleAr": "عرض ضخم - خصم 150,000",
        "descriptionEn": "Massive savings of 150,000 SYP on gaming console",
        "descriptionAr": "توفير هائل 150,000 ل.س على جهاز الألعاب"
      },
      {
        "type": "free_product",
        "freeProductId": 25,
        "titleEn": "Free Extra Controller",
        "titleAr": "يد تحكم إضافية مجانية",
        "descriptionEn": "Receive a wireless controller absolutely free",
        "descriptionAr": "احصل على يد تحكم لاسلكية مجاناً تماماً"
      },
      {
        "type": "coupon",
        "couponValue": 200000,
        "titleEn": "200,000 Gaming Coupon",
        "titleAr": "كوبون ألعاب 200,000",
        "descriptionEn": "Get 200,000 SYP coupon for games and accessories",
        "descriptionAr": "احصل على كوبون 200,000 ل.س للألعاب والإكسسوارات",
        "eligibleProductIds": [
          26,
          27,
          28,
          29,
          30
        ],
        "validityDays": 60
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 35,
        "relatedProductIds": [
          26,
          27,
          28,
          29,
          30,
          31,
          32
        ],
        "titleEn": "35% Bundle Discount",
        "titleAr": "خصم 35٪ على الحزمة",
        "descriptionEn": "Save 35% on all gaming accessories and games",
        "descriptionAr": "وفر 35٪ على جميع إكسسوارات وألعاب الجيمنج"
      }
    ]
  }
];

export const products: ProductWithOffers[] = [
  {
    "id": 101,
    "name": "Apple ID Account",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 102,
    "name": "Netflix Premium Account",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Netflix",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 103,
    "name": "Spotify Premium Account",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Spotify",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 104,
    "name": "PlayStation Network Card",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "nameAr": "آيفون 15 برو",
    "basePrice": 4500000,
    "price": "3,825,000",
    "oldPrice": "4,500,000",
    "image": "https://images.unsplash.com/photo-1632633173522-966f15363c5e?w=500&q=80",
    "category": "Smartphones",
    "categoryAr": "هواتف ذكية",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 1234,
    "badge": "NEW",
    "isNew": true,
    "description": "The latest iPhone 15 Pro with A17 Pro chip and titanium design",
    "descriptionAr": "أحدث آيفون 15 برو مع معالج A17 Pro وتصميم تيتانيوم",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ],
    "specs": [
      {
        "title": "Screen",
        "value": "6.1 inch",
        "icon": "Smartphone"
      },
      {
        "title": "Chip",
        "value": "A17 Pro",
        "icon": "Settings"
      },
      {
        "title": "Camera",
        "value": "48MP Pro",
        "icon": "Camera"
      },
      {
        "title": "Storage",
        "value": "256GB",
        "icon": "Laptop"
      }
    ],
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 15,
        "titleEn": "15% OFF Special Deal",
        "titleAr": "خصم 15٪ عرض خاص",
        "descriptionEn": "Save 15% on the latest iPhone 15 Pro. Limited time offer!",
        "descriptionAr": "وفر 15٪ على أحدث آيفون 15 برو. عرض لفترة محدودة!"
      }
    ]
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S24",
    "nameAr": "سامسونج جالاكسي S24",
    "basePrice": 3800000,
    "price": "3,800,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Smartphones",
    "categoryAr": "هواتف ذكية",
    "brand": "Samsung",
    "rating": 4.8,
    "reviews": 987,
    "isNew": true,
    "description": "Samsung Galaxy S24 with AI features and 200MP camera",
    "descriptionAr": "سامسونج جالاكسي S24 مع ميزات الذكاء الاصطناعي وكاميرا 200 ميجابكسل",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ],
    "specs": [
      {
        "title": "Screen",
        "value": "6.2 inch",
        "icon": "Smartphone"
      },
      {
        "title": "Processor",
        "value": "Snapdragon 8 Gen 3",
        "icon": "Settings"
      },
      {
        "title": "Camera",
        "value": "200MP",
        "icon": "Camera"
      },
      {
        "title": "RAM",
        "value": "12GB",
        "icon": "Laptop"
      }
    ],
    "offers": [
      {
        "type": "coupon",
        "couponValue": 100000,
        "titleEn": "Buy & Get 100,000 Coupon",
        "titleAr": "اشتري واحصل على كوبون 100,000",
        "descriptionEn": "Purchase Samsung Galaxy S24 and receive a 100,000 SYP coupon to spend on selected accessories",
        "descriptionAr": "اشترِ سامسونج جالاكسي S24 واحصل على كوبون بقيمة 100,000 ل.س للإنفاق على الإكسسوارات المختارة",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14
        ],
        "validityDays": 30
      }
    ]
  },
  {
    "id": 3,
    "name": "MacBook Pro 14\"",
    "nameAr": "ماك بوك برو 14 إنش",
    "basePrice": 8500000,
    "price": "8,500,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Laptops",
    "categoryAr": "حواسيب محمولة",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 856,
    "isHot": true,
    "badge": "HOT",
    "description": "MacBook Pro with M3 Pro chip and Liquid Retina XDR display",
    "descriptionAr": "ماك بوك برو مع معالج M3 Pro وشاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ],
    "specs": [
      {
        "title": "Chip",
        "value": "M3 Pro",
        "icon": "Settings"
      },
      {
        "title": "RAM",
        "value": "18GB",
        "icon": "Laptop"
      },
      {
        "title": "Storage",
        "value": "512GB SSD",
        "icon": "Laptop"
      },
      {
        "title": "Display",
        "value": "14.2 inch XDR",
        "icon": "Smartphone"
      }
    ],
    "offers": [
      {
        "type": "free_product",
        "freeProductId": 15,
        "titleEn": "Free AirPods with MacBook",
        "titleAr": "إيربودز مجانية مع ماك بوك",
        "descriptionEn": "Get AirPods Pro absolutely free when you purchase MacBook Pro",
        "descriptionAr": "احصل على إيربودز برو مجاناً تماماً عند شراء ماك بوك برو"
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 25,
        "relatedProductIds": [
          16,
          17,
          18
        ],
        "titleEn": "25% OFF on Accessories",
        "titleAr": "خصم 25٪ على الإكسسوارات",
        "descriptionEn": "Get 25% discount on MacBook accessories when you buy this product",
        "descriptionAr": "احصل على خصم 25٪ على إكسسوارات ماك بوك عند شراء هذا المنتج"
      }
    ]
  },
  {
    "id": 4,
    "name": "iPad Air 11\"",
    "nameAr": "آيباد إير 11 إنش",
    "basePrice": 2500000,
    "price": "2,450,000",
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    "category": "Tablets",
    "categoryAr": "أجهزة لوحية",
    "brand": "Apple",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "iPad Air with M2 chip and stunning 11-inch display",
    "descriptionAr": "آيباد إير مع معالج M2 وشاشة مذهلة 11 إنش",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ],
    "oldPrice": "2,500,000",
    "specs": [
      {
        "title": "Chip",
        "value": "M2",
        "icon": "Settings"
      },
      {
        "title": "Display",
        "value": "11 inch Liquid Retina",
        "icon": "Smartphone"
      },
      {
        "title": "Storage",
        "value": "128GB",
        "icon": "Laptop"
      },
      {
        "title": "Camera",
        "value": "12MP",
        "icon": "Camera"
      }
    ],
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 50000,
        "titleEn": "Save 50,000 SYP",
        "titleAr": "وفّر 50,000 ل.س",
        "descriptionEn": "Instant discount of 50,000 SYP on iPad Air",
        "descriptionAr": "خصم فوري 50,000 ل.س على آيباد إير"
      },
      {
        "type": "coupon",
        "couponValue": 75000,
        "titleEn": "Bonus 75,000 Coupon",
        "titleAr": "كوبون إضافي 75,000",
        "descriptionEn": "Receive an additional 75,000 SYP coupon for future purchases",
        "descriptionAr": "احصل على كوبون إضافي بقيمة 75,000 ل.س للمشتريات المستقبلية",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14,
          19,
          20
        ],
        "validityDays": 45
      }
    ]
  },
  {
    "id": 6,
    "name": "Sony WH-1000XM5 Headphones",
    "nameAr": "سماعات سوني WH-1000XM5",
    "basePrice": 1200000,
    "price": "1,200,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    "category": "Audio",
    "categoryAr": "صوتيات",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 765,
    "description": "Industry-leading noise canceling headphones",
    "descriptionAr": "سماعات بتقنية إلغاء ضوضاء رائدة في الصناعة",
    "specs": [
      {
        "title": "Noise Canceling",
        "value": "Advanced ANC",
        "icon": "Headphones"
      },
      {
        "title": "Battery",
        "value": "30 hours",
        "icon": "Battery"
      },
      {
        "title": "Sound",
        "value": "Hi-Res Audio",
        "icon": "Settings"
      },
      {
        "title": "Connectivity",
        "value": "Bluetooth 5.2",
        "icon": "Settings"
      }
    ],
    "offers": [
      {
        "type": "bundle_discount",
        "discountPercentage": 20,
        "relatedProductIds": [
          22,
          23,
          24
        ],
        "titleEn": "20% OFF Bundle",
        "titleAr": "خصم 20٪ على الحزمة",
        "descriptionEn": "Save 20% when you bundle with headphone accessories",
        "descriptionAr": "وفر 20٪ عند الشراء مع إكسسوارات السماعات"
      }
    ]
  },
  {
    "id": 7,
    "name": "Anker PowerCore 20000mAh",
    "brand": "Anker",
    "category": "Power Banks",
    "price": "245,000",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.7,
    "specs": [
      {
        "title": "Capacity",
        "value": "20000mAh",
        "icon": "Battery"
      },
      {
        "title": "Ports",
        "value": "USB-C + USB-A",
        "icon": "Settings"
      },
      {
        "title": "Output",
        "value": "18W Fast Charge",
        "icon": "Battery"
      },
      {
        "title": "Weight",
        "value": "356g",
        "icon": "Settings"
      }
    ],
    "nameAr": "بطارية أنكر محمولة 20000 مللي أمبير",
    "basePrice": 350000,
    "oldPrice": "350,000",
    "categoryAr": "بطاريات محمولة",
    "reviews": 1543,
    "description": "High-capacity portable charger with fast charging",
    "descriptionAr": "شاحن محمول بسعة عالية مع شحن سريع",
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 30,
        "titleEn": "30% Flash Sale",
        "titleAr": "تخفيضات سريعة 30٪",
        "descriptionEn": "Limited flash sale - 30% off on premium power banks",
        "descriptionAr": "تخفيضات سريعة محدودة - خصم 30٪ على البطاريات المحمولة المميزة"
      }
    ]
  },
  {
    "id": 8,
    "name": "PlayStation 5 Console",
    "brand": "Sony",
    "category": "Gaming",
    "price": "4,850,000",
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
    "badge": "حار",
    "isHot": true,
    "rating": 4.9,
    "specs": [
      {
        "title": "GPU",
        "value": "10.28 TFLOPs",
        "icon": "Gamepad2"
      },
      {
        "title": "SSD",
        "value": "825GB Ultra-fast",
        "icon": "Laptop"
      },
      {
        "title": "Resolution",
        "value": "8K Support",
        "icon": "Smartphone"
      },
      {
        "title": "Ray Tracing",
        "value": "Hardware RT",
        "icon": "Settings"
      }
    ],
    "nameAr": "جهاز بلاي ستيشن 5",
    "basePrice": 5000000,
    "oldPrice": "5,000,000",
    "categoryAr": "ألعاب",
    "reviews": 2341,
    "description": "Next-gen gaming console with stunning graphics",
    "descriptionAr": "جهاز ألعاب من الجيل القادم برسومات مذهلة",
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 150000,
        "titleEn": "Mega Deal - 150,000 OFF",
        "titleAr": "عرض ضخم - خصم 150,000",
        "descriptionEn": "Massive savings of 150,000 SYP on gaming console",
        "descriptionAr": "توفير هائل 150,000 ل.س على جهاز الألعاب"
      },
      {
        "type": "free_product",
        "freeProductId": 25,
        "titleEn": "Free Extra Controller",
        "titleAr": "يد تحكم إضافية مجانية",
        "descriptionEn": "Receive a wireless controller absolutely free",
        "descriptionAr": "احصل على يد تحكم لاسلكية مجاناً تماماً"
      },
      {
        "type": "coupon",
        "couponValue": 200000,
        "titleEn": "200,000 Gaming Coupon",
        "titleAr": "كوبون ألعاب 200,000",
        "descriptionEn": "Get 200,000 SYP coupon for games and accessories",
        "descriptionAr": "احصل على كوبون 200,000 ل.س للألعاب والإكسسوارات",
        "eligibleProductIds": [
          26,
          27,
          28,
          29,
          30
        ],
        "validityDays": 60
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 35,
        "relatedProductIds": [
          26,
          27,
          28,
          29,
          30,
          31,
          32
        ],
        "titleEn": "35% Bundle Discount",
        "titleAr": "خصم 35٪ على الحزمة",
        "descriptionEn": "Save 35% on all gaming accessories and games",
        "descriptionAr": "وفر 35٪ على جميع إكسسوارات وألعاب الجيمنج"
      }
    ]
  },
  {
    "id": 9,
    "name": "سماعة Sony WH-1000XM5",
    "brand": "Sony",
    "category": "سماعات",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 10,
    "name": "USB-C Cable 2m",
    "brand": "Generic",
    "category": "Accessories",
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=500&q=80",
    "badge": "حار",
    "isHot": true,
    "rating": 4.5,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ],
    "nameAr": "كابل USB-C 2 متر",
    "basePrice": 50000,
    "categoryAr": "إكسسوارات",
    "reviews": 234,
    "description": "High-quality USB-C charging cable",
    "descriptionAr": "كابل شحن USB-C عالي الجودة"
  },
  {
    "id": 11,
    "name": "Phone Case Premium",
    "brand": "Generic",
    "category": "Accessories",
    "price": "75,000",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.6,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ],
    "nameAr": "حافظة هاتف مميزة",
    "basePrice": 75000,
    "categoryAr": "إكسسوارات",
    "reviews": 456,
    "description": "Premium protective phone case",
    "descriptionAr": "حافظة هاتف واقية مميزة"
  },
  {
    "id": 12,
    "name": "Screen Protector",
    "brand": "Generic",
    "category": "Accessories",
    "price": "40,000",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ],
    "nameAr": "واقي شاشة",
    "basePrice": 40000,
    "categoryAr": "إكسسوارات",
    "reviews": 678,
    "description": "Tempered glass screen protector",
    "descriptionAr": "واقي شاشة زجاجي مقوى"
  },
  {
    "id": 105,
    "name": "Apple ID Account — Samsung / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Samsung",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 106,
    "name": "Netflix Premium Account — Samsung / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Samsung",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 107,
    "name": "Spotify Premium Account — Samsung / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Samsung",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 108,
    "name": "PlayStation Network Card — Samsung / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Samsung",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 109,
    "name": "Samsung Galaxy S24 Ultra — Samsung / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Samsung",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 110,
    "name": "Apple Watch Series 9 — Samsung / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Samsung",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 111,
    "name": "Sony WH-1000XM5 — Samsung / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Samsung",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 112,
    "name": "MacBook Pro 16\" M3 Max — Samsung / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Samsung",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 113,
    "name": "Canon EOS R5 — Samsung / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Samsung",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 114,
    "name": "Samsung S24 Ultra — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 115,
    "name": "Apple Watch Ultra 2 — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 116,
    "name": "سماعة Sony WH-1000XM5 — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 117,
    "name": "بطارية ليثيوم Deye — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 118,
    "name": "Honor Magic 6 Pro — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 119,
    "name": "كاميرا Xiaomi Yi — Samsung / Mobile Phones",
    "brand": "Samsung",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 120,
    "name": "Apple ID Account — iPhone (Apple) / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone (Apple)",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 121,
    "name": "Netflix Premium Account — iPhone (Apple) / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone (Apple)",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 122,
    "name": "Spotify Premium Account — iPhone (Apple) / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone (Apple)",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 123,
    "name": "PlayStation Network Card — iPhone (Apple) / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone (Apple)",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 124,
    "name": "Samsung Galaxy S24 Ultra — iPhone (Apple) / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "iPhone (Apple)",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 125,
    "name": "Apple Watch Series 9 — iPhone (Apple) / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "iPhone (Apple)",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 126,
    "name": "Sony WH-1000XM5 — iPhone (Apple) / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "iPhone (Apple)",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 127,
    "name": "MacBook Pro 16\" M3 Max — iPhone (Apple) / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "iPhone (Apple)",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 128,
    "name": "Canon EOS R5 — iPhone (Apple) / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "iPhone (Apple)",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 129,
    "name": "Samsung S24 Ultra — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 130,
    "name": "Apple Watch Ultra 2 — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 131,
    "name": "سماعة Sony WH-1000XM5 — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 132,
    "name": "بطارية ليثيوم Deye — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 133,
    "name": "Honor Magic 6 Pro — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 134,
    "name": "كاميرا Xiaomi Yi — iPhone (Apple) / Mobile Phones",
    "brand": "iPhone (Apple)",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 135,
    "name": "Apple ID Account — Huawei / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Huawei",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 136,
    "name": "Netflix Premium Account — Huawei / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Huawei",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 137,
    "name": "Spotify Premium Account — Huawei / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Huawei",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 138,
    "name": "PlayStation Network Card — Huawei / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Huawei",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 139,
    "name": "Samsung Galaxy S24 Ultra — Huawei / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Huawei",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 140,
    "name": "Apple Watch Series 9 — Huawei / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Huawei",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 141,
    "name": "Sony WH-1000XM5 — Huawei / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Huawei",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 142,
    "name": "MacBook Pro 16\" M3 Max — Huawei / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Huawei",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 143,
    "name": "Canon EOS R5 — Huawei / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Huawei",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 144,
    "name": "Samsung S24 Ultra — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 145,
    "name": "Apple Watch Ultra 2 — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 146,
    "name": "سماعة Sony WH-1000XM5 — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 147,
    "name": "بطارية ليثيوم Deye — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 148,
    "name": "Honor Magic 6 Pro — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 149,
    "name": "كاميرا Xiaomi Yi — Huawei / Mobile Phones",
    "brand": "Huawei",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 150,
    "name": "Apple ID Account — Xiaomi / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Xiaomi",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 151,
    "name": "Netflix Premium Account — Xiaomi / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Xiaomi",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 152,
    "name": "Spotify Premium Account — Xiaomi / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Xiaomi",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 153,
    "name": "PlayStation Network Card — Xiaomi / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Xiaomi",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 154,
    "name": "Samsung Galaxy S24 Ultra — Xiaomi / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Xiaomi",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 155,
    "name": "Apple Watch Series 9 — Xiaomi / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Xiaomi",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 156,
    "name": "Sony WH-1000XM5 — Xiaomi / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Xiaomi",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 157,
    "name": "MacBook Pro 16\" M3 Max — Xiaomi / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Xiaomi",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 158,
    "name": "Canon EOS R5 — Xiaomi / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Xiaomi",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 159,
    "name": "Samsung S24 Ultra — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 160,
    "name": "Apple Watch Ultra 2 — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 161,
    "name": "سماعة Sony WH-1000XM5 — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 162,
    "name": "بطارية ليثيوم Deye — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 163,
    "name": "Honor Magic 6 Pro — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 164,
    "name": "كاميرا Xiaomi Yi — Xiaomi / Mobile Phones",
    "brand": "Xiaomi",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 165,
    "name": "Apple ID Account — Oppo / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Oppo",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 166,
    "name": "Netflix Premium Account — Oppo / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Oppo",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 167,
    "name": "Spotify Premium Account — Oppo / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Oppo",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 168,
    "name": "PlayStation Network Card — Oppo / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Oppo",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 169,
    "name": "Samsung Galaxy S24 Ultra — Oppo / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Oppo",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 170,
    "name": "Apple Watch Series 9 — Oppo / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Oppo",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 171,
    "name": "Sony WH-1000XM5 — Oppo / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Oppo",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 172,
    "name": "MacBook Pro 16\" M3 Max — Oppo / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Oppo",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 173,
    "name": "Canon EOS R5 — Oppo / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Oppo",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 174,
    "name": "Samsung S24 Ultra — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 175,
    "name": "Apple Watch Ultra 2 — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 176,
    "name": "سماعة Sony WH-1000XM5 — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 177,
    "name": "بطارية ليثيوم Deye — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 178,
    "name": "Honor Magic 6 Pro — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 179,
    "name": "كاميرا Xiaomi Yi — Oppo / Mobile Phones",
    "brand": "Oppo",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 180,
    "name": "Apple ID Account — Realme / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Realme",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 181,
    "name": "Netflix Premium Account — Realme / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Realme",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 182,
    "name": "Spotify Premium Account — Realme / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Realme",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 183,
    "name": "PlayStation Network Card — Realme / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Realme",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 184,
    "name": "Samsung Galaxy S24 Ultra — Realme / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Realme",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 185,
    "name": "Apple Watch Series 9 — Realme / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Realme",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 186,
    "name": "Sony WH-1000XM5 — Realme / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Realme",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 187,
    "name": "MacBook Pro 16\" M3 Max — Realme / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Realme",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 188,
    "name": "Canon EOS R5 — Realme / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Realme",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 189,
    "name": "Samsung S24 Ultra — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 190,
    "name": "Apple Watch Ultra 2 — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 191,
    "name": "سماعة Sony WH-1000XM5 — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 192,
    "name": "بطارية ليثيوم Deye — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 193,
    "name": "Honor Magic 6 Pro — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 194,
    "name": "كاميرا Xiaomi Yi — Realme / Mobile Phones",
    "brand": "Realme",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 195,
    "name": "Apple ID Account — Infinix / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Infinix",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 196,
    "name": "Netflix Premium Account — Infinix / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Infinix",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 197,
    "name": "Spotify Premium Account — Infinix / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Infinix",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 198,
    "name": "PlayStation Network Card — Infinix / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Infinix",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 199,
    "name": "Samsung Galaxy S24 Ultra — Infinix / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Infinix",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 200,
    "name": "Apple Watch Series 9 — Infinix / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Infinix",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 201,
    "name": "Sony WH-1000XM5 — Infinix / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Infinix",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 202,
    "name": "MacBook Pro 16\" M3 Max — Infinix / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Infinix",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 203,
    "name": "Canon EOS R5 — Infinix / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Infinix",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 204,
    "name": "Samsung S24 Ultra — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 205,
    "name": "Apple Watch Ultra 2 — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 206,
    "name": "سماعة Sony WH-1000XM5 — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 207,
    "name": "بطارية ليثيوم Deye — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 208,
    "name": "Honor Magic 6 Pro — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 209,
    "name": "كاميرا Xiaomi Yi — Infinix / Mobile Phones",
    "brand": "Infinix",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 210,
    "name": "Apple ID Account — Tecno / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Tecno",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 211,
    "name": "Netflix Premium Account — Tecno / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Tecno",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 212,
    "name": "Spotify Premium Account — Tecno / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Tecno",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 213,
    "name": "PlayStation Network Card — Tecno / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Tecno",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 214,
    "name": "Samsung Galaxy S24 Ultra — Tecno / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Tecno",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 215,
    "name": "Apple Watch Series 9 — Tecno / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Tecno",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 216,
    "name": "Sony WH-1000XM5 — Tecno / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Tecno",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 217,
    "name": "MacBook Pro 16\" M3 Max — Tecno / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Tecno",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 218,
    "name": "Canon EOS R5 — Tecno / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Tecno",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 219,
    "name": "Samsung S24 Ultra — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 220,
    "name": "Apple Watch Ultra 2 — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 221,
    "name": "سماعة Sony WH-1000XM5 — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 222,
    "name": "بطارية ليثيوم Deye — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 223,
    "name": "Honor Magic 6 Pro — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 224,
    "name": "كاميرا Xiaomi Yi — Tecno / Mobile Phones",
    "brand": "Tecno",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 225,
    "name": "Apple ID Account — Honor / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Honor",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 226,
    "name": "Netflix Premium Account — Honor / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Honor",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 227,
    "name": "Spotify Premium Account — Honor / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Honor",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 228,
    "name": "PlayStation Network Card — Honor / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Honor",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 229,
    "name": "Samsung Galaxy S24 Ultra — Honor / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Honor",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 230,
    "name": "Apple Watch Series 9 — Honor / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Honor",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 231,
    "name": "Sony WH-1000XM5 — Honor / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Honor",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 232,
    "name": "MacBook Pro 16\" M3 Max — Honor / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Honor",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 233,
    "name": "Canon EOS R5 — Honor / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Honor",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 234,
    "name": "Samsung S24 Ultra — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 235,
    "name": "Apple Watch Ultra 2 — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 236,
    "name": "سماعة Sony WH-1000XM5 — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 237,
    "name": "بطارية ليثيوم Deye — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 238,
    "name": "Honor Magic 6 Pro — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 239,
    "name": "كاميرا Xiaomi Yi — Honor / Mobile Phones",
    "brand": "Honor",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 240,
    "name": "Apple ID Account — Nokia / Mobile Phones",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Nokia",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 241,
    "name": "Netflix Premium Account — Nokia / Mobile Phones",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Nokia",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 242,
    "name": "Spotify Premium Account — Nokia / Mobile Phones",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Nokia",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 243,
    "name": "PlayStation Network Card — Nokia / Mobile Phones",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "حسابات رقمية",
    "brand": "Nokia",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 244,
    "name": "Samsung Galaxy S24 Ultra — Nokia / Mobile Phones",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "هواتف ذكية",
    "brand": "Nokia",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 245,
    "name": "Apple Watch Series 9 — Nokia / Mobile Phones",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "ساعات ذكية",
    "brand": "Nokia",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 246,
    "name": "Sony WH-1000XM5 — Nokia / Mobile Phones",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "سماعات",
    "brand": "Nokia",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 247,
    "name": "MacBook Pro 16\" M3 Max — Nokia / Mobile Phones",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "لابتوبات",
    "brand": "Nokia",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 248,
    "name": "Canon EOS R5 — Nokia / Mobile Phones",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Mobile Phones",
    "categoryAr": "كاميرات",
    "brand": "Nokia",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 249,
    "name": "Samsung S24 Ultra — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 250,
    "name": "Apple Watch Ultra 2 — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 251,
    "name": "سماعة Sony WH-1000XM5 — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 252,
    "name": "بطارية ليثيوم Deye — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 253,
    "name": "Honor Magic 6 Pro — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 254,
    "name": "كاميرا Xiaomi Yi — Nokia / Mobile Phones",
    "brand": "Nokia",
    "category": "Mobile Phones",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 255,
    "name": "Apple ID Account — Power Banks / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Banks",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 256,
    "name": "Netflix Premium Account — Power Banks / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Banks",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 257,
    "name": "Spotify Premium Account — Power Banks / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Banks",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 258,
    "name": "PlayStation Network Card — Power Banks / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Banks",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 259,
    "name": "Samsung Galaxy S24 Ultra — Power Banks / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Power Banks",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 260,
    "name": "Apple Watch Series 9 — Power Banks / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Power Banks",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 261,
    "name": "Sony WH-1000XM5 — Power Banks / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Power Banks",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 262,
    "name": "MacBook Pro 16\" M3 Max — Power Banks / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Power Banks",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 263,
    "name": "Canon EOS R5 — Power Banks / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Power Banks",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 264,
    "name": "Samsung S24 Ultra — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 265,
    "name": "Apple Watch Ultra 2 — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 266,
    "name": "سماعة Sony WH-1000XM5 — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 267,
    "name": "بطارية ليثيوم Deye — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 268,
    "name": "Honor Magic 6 Pro — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 269,
    "name": "كاميرا Xiaomi Yi — Power Banks / Electronic Accessories",
    "brand": "Power Banks",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 270,
    "name": "Apple ID Account — Wired Headphones / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wired Headphones",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 271,
    "name": "Netflix Premium Account — Wired Headphones / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wired Headphones",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 272,
    "name": "Spotify Premium Account — Wired Headphones / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wired Headphones",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 273,
    "name": "PlayStation Network Card — Wired Headphones / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wired Headphones",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 274,
    "name": "Samsung Galaxy S24 Ultra — Wired Headphones / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Wired Headphones",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 275,
    "name": "Apple Watch Series 9 — Wired Headphones / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Wired Headphones",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 276,
    "name": "Sony WH-1000XM5 — Wired Headphones / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Wired Headphones",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 277,
    "name": "MacBook Pro 16\" M3 Max — Wired Headphones / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Wired Headphones",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 278,
    "name": "Canon EOS R5 — Wired Headphones / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Wired Headphones",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 279,
    "name": "Samsung S24 Ultra — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 280,
    "name": "Apple Watch Ultra 2 — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 281,
    "name": "سماعة Sony WH-1000XM5 — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 282,
    "name": "بطارية ليثيوم Deye — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 283,
    "name": "Honor Magic 6 Pro — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 284,
    "name": "كاميرا Xiaomi Yi — Wired Headphones / Electronic Accessories",
    "brand": "Wired Headphones",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 285,
    "name": "Apple ID Account — Wireless Headphones / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wireless Headphones",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 286,
    "name": "Netflix Premium Account — Wireless Headphones / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wireless Headphones",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 287,
    "name": "Spotify Premium Account — Wireless Headphones / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wireless Headphones",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 288,
    "name": "PlayStation Network Card — Wireless Headphones / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Wireless Headphones",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 289,
    "name": "Samsung Galaxy S24 Ultra — Wireless Headphones / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Wireless Headphones",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 290,
    "name": "Apple Watch Series 9 — Wireless Headphones / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Wireless Headphones",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 291,
    "name": "Sony WH-1000XM5 — Wireless Headphones / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Wireless Headphones",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 292,
    "name": "MacBook Pro 16\" M3 Max — Wireless Headphones / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Wireless Headphones",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 293,
    "name": "Canon EOS R5 — Wireless Headphones / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Wireless Headphones",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 294,
    "name": "Samsung S24 Ultra — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 295,
    "name": "Apple Watch Ultra 2 — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 296,
    "name": "سماعة Sony WH-1000XM5 — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 297,
    "name": "بطارية ليثيوم Deye — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 298,
    "name": "Honor Magic 6 Pro — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 299,
    "name": "كاميرا Xiaomi Yi — Wireless Headphones / Electronic Accessories",
    "brand": "Wireless Headphones",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 300,
    "name": "Apple ID Account — Smart Watches / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Smart Watches",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 301,
    "name": "Netflix Premium Account — Smart Watches / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Smart Watches",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 302,
    "name": "Spotify Premium Account — Smart Watches / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Smart Watches",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 303,
    "name": "PlayStation Network Card — Smart Watches / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Smart Watches",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 304,
    "name": "Samsung Galaxy S24 Ultra — Smart Watches / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Smart Watches",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 305,
    "name": "Apple Watch Series 9 — Smart Watches / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Smart Watches",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 306,
    "name": "Sony WH-1000XM5 — Smart Watches / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Smart Watches",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 307,
    "name": "MacBook Pro 16\" M3 Max — Smart Watches / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Smart Watches",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 308,
    "name": "Canon EOS R5 — Smart Watches / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Smart Watches",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 309,
    "name": "Samsung S24 Ultra — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 310,
    "name": "Apple Watch Ultra 2 — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 311,
    "name": "سماعة Sony WH-1000XM5 — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 312,
    "name": "بطارية ليثيوم Deye — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 313,
    "name": "Honor Magic 6 Pro — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 314,
    "name": "كاميرا Xiaomi Yi — Smart Watches / Electronic Accessories",
    "brand": "Smart Watches",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 315,
    "name": "Apple ID Account — Speakers / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Speakers",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 316,
    "name": "Netflix Premium Account — Speakers / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Speakers",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 317,
    "name": "Spotify Premium Account — Speakers / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Speakers",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 318,
    "name": "PlayStation Network Card — Speakers / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Speakers",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 319,
    "name": "Samsung Galaxy S24 Ultra — Speakers / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Speakers",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 320,
    "name": "Apple Watch Series 9 — Speakers / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Speakers",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 321,
    "name": "Sony WH-1000XM5 — Speakers / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Speakers",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 322,
    "name": "MacBook Pro 16\" M3 Max — Speakers / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Speakers",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 323,
    "name": "Canon EOS R5 — Speakers / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Speakers",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 324,
    "name": "Samsung S24 Ultra — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 325,
    "name": "Apple Watch Ultra 2 — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 326,
    "name": "سماعة Sony WH-1000XM5 — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 327,
    "name": "بطارية ليثيوم Deye — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 328,
    "name": "Honor Magic 6 Pro — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 329,
    "name": "كاميرا Xiaomi Yi — Speakers / Electronic Accessories",
    "brand": "Speakers",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 330,
    "name": "Apple ID Account — Chargers & Cables / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Chargers & Cables",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 331,
    "name": "Netflix Premium Account — Chargers & Cables / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Chargers & Cables",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 332,
    "name": "Spotify Premium Account — Chargers & Cables / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Chargers & Cables",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 333,
    "name": "PlayStation Network Card — Chargers & Cables / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Chargers & Cables",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 334,
    "name": "Samsung Galaxy S24 Ultra — Chargers & Cables / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Chargers & Cables",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 335,
    "name": "Apple Watch Series 9 — Chargers & Cables / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Chargers & Cables",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 336,
    "name": "Sony WH-1000XM5 — Chargers & Cables / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Chargers & Cables",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 337,
    "name": "MacBook Pro 16\" M3 Max — Chargers & Cables / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Chargers & Cables",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 338,
    "name": "Canon EOS R5 — Chargers & Cables / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Chargers & Cables",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 339,
    "name": "Samsung S24 Ultra — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 340,
    "name": "Apple Watch Ultra 2 — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 341,
    "name": "سماعة Sony WH-1000XM5 — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 342,
    "name": "بطارية ليثيوم Deye — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 343,
    "name": "Honor Magic 6 Pro — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 344,
    "name": "كاميرا Xiaomi Yi — Chargers & Cables / Electronic Accessories",
    "brand": "Chargers & Cables",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 345,
    "name": "Apple ID Account — Phone Cases / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Phone Cases",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 346,
    "name": "Netflix Premium Account — Phone Cases / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Phone Cases",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 347,
    "name": "Spotify Premium Account — Phone Cases / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Phone Cases",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 348,
    "name": "PlayStation Network Card — Phone Cases / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Phone Cases",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 349,
    "name": "Samsung Galaxy S24 Ultra — Phone Cases / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Phone Cases",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 350,
    "name": "Apple Watch Series 9 — Phone Cases / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Phone Cases",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 351,
    "name": "Sony WH-1000XM5 — Phone Cases / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Phone Cases",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 352,
    "name": "MacBook Pro 16\" M3 Max — Phone Cases / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Phone Cases",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 353,
    "name": "Canon EOS R5 — Phone Cases / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Phone Cases",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 354,
    "name": "Samsung S24 Ultra — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 355,
    "name": "Apple Watch Ultra 2 — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 356,
    "name": "سماعة Sony WH-1000XM5 — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 357,
    "name": "بطارية ليثيوم Deye — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 358,
    "name": "Honor Magic 6 Pro — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 359,
    "name": "كاميرا Xiaomi Yi — Phone Cases / Electronic Accessories",
    "brand": "Phone Cases",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 360,
    "name": "Apple ID Account — Screen Protectors / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Screen Protectors",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 361,
    "name": "Netflix Premium Account — Screen Protectors / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Screen Protectors",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 362,
    "name": "Spotify Premium Account — Screen Protectors / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Screen Protectors",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 363,
    "name": "PlayStation Network Card — Screen Protectors / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Screen Protectors",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 364,
    "name": "Samsung Galaxy S24 Ultra — Screen Protectors / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Screen Protectors",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 365,
    "name": "Apple Watch Series 9 — Screen Protectors / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Screen Protectors",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 366,
    "name": "Sony WH-1000XM5 — Screen Protectors / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Screen Protectors",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 367,
    "name": "MacBook Pro 16\" M3 Max — Screen Protectors / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Screen Protectors",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 368,
    "name": "Canon EOS R5 — Screen Protectors / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Screen Protectors",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 369,
    "name": "Samsung S24 Ultra — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 370,
    "name": "Apple Watch Ultra 2 — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 371,
    "name": "سماعة Sony WH-1000XM5 — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 372,
    "name": "بطارية ليثيوم Deye — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 373,
    "name": "Honor Magic 6 Pro — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 374,
    "name": "كاميرا Xiaomi Yi — Screen Protectors / Electronic Accessories",
    "brand": "Screen Protectors",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 375,
    "name": "Apple ID Account — iPhone Accessories / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 376,
    "name": "Netflix Premium Account — iPhone Accessories / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 377,
    "name": "Spotify Premium Account — iPhone Accessories / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 378,
    "name": "PlayStation Network Card — iPhone Accessories / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "iPhone Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 379,
    "name": "Samsung Galaxy S24 Ultra — iPhone Accessories / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "iPhone Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 380,
    "name": "Apple Watch Series 9 — iPhone Accessories / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "iPhone Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 381,
    "name": "Sony WH-1000XM5 — iPhone Accessories / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "iPhone Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 382,
    "name": "MacBook Pro 16\" M3 Max — iPhone Accessories / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "iPhone Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 383,
    "name": "Canon EOS R5 — iPhone Accessories / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "iPhone Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 384,
    "name": "Samsung S24 Ultra — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 385,
    "name": "Apple Watch Ultra 2 — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 386,
    "name": "سماعة Sony WH-1000XM5 — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 387,
    "name": "بطارية ليثيوم Deye — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 388,
    "name": "Honor Magic 6 Pro — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 389,
    "name": "كاميرا Xiaomi Yi — iPhone Accessories / Electronic Accessories",
    "brand": "iPhone Accessories",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 390,
    "name": "Apple ID Account — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 391,
    "name": "Netflix Premium Account — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 392,
    "name": "Spotify Premium Account — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 393,
    "name": "PlayStation Network Card — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 394,
    "name": "Samsung Galaxy S24 Ultra — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 395,
    "name": "Apple Watch Series 9 — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 396,
    "name": "Sony WH-1000XM5 — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 397,
    "name": "MacBook Pro 16\" M3 Max — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Memory Cards & Flash Drives",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 398,
    "name": "Canon EOS R5 — Memory Cards & Flash Drives / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Memory Cards & Flash Drives",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 399,
    "name": "Samsung S24 Ultra — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 400,
    "name": "Apple Watch Ultra 2 — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 401,
    "name": "سماعة Sony WH-1000XM5 — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 402,
    "name": "بطارية ليثيوم Deye — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 403,
    "name": "Honor Magic 6 Pro — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 404,
    "name": "كاميرا Xiaomi Yi — Memory Cards & Flash Drives / Electronic Accessories",
    "brand": "Memory Cards & Flash Drives",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 405,
    "name": "Apple ID Account — Other Accessories / Electronic Accessories",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Other Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 406,
    "name": "Netflix Premium Account — Other Accessories / Electronic Accessories",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Other Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 407,
    "name": "Spotify Premium Account — Other Accessories / Electronic Accessories",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Other Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 408,
    "name": "PlayStation Network Card — Other Accessories / Electronic Accessories",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "حسابات رقمية",
    "brand": "Other Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 409,
    "name": "Samsung Galaxy S24 Ultra — Other Accessories / Electronic Accessories",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "هواتف ذكية",
    "brand": "Other Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 410,
    "name": "Apple Watch Series 9 — Other Accessories / Electronic Accessories",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "ساعات ذكية",
    "brand": "Other Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 411,
    "name": "Sony WH-1000XM5 — Other Accessories / Electronic Accessories",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "سماعات",
    "brand": "Other Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 412,
    "name": "MacBook Pro 16\" M3 Max — Other Accessories / Electronic Accessories",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "لابتوبات",
    "brand": "Other Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 413,
    "name": "Canon EOS R5 — Other Accessories / Electronic Accessories",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electronic Accessories",
    "categoryAr": "كاميرات",
    "brand": "Other Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 414,
    "name": "Samsung S24 Ultra — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 415,
    "name": "Apple Watch Ultra 2 — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 416,
    "name": "سماعة Sony WH-1000XM5 — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 417,
    "name": "بطارية ليثيوم Deye — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 418,
    "name": "Honor Magic 6 Pro — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 419,
    "name": "كاميرا Xiaomi Yi — Other Accessories / Electronic Accessories",
    "brand": "Other Accessories",
    "category": "Electronic Accessories",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 420,
    "name": "Apple ID Account — Android Tablets / Tablets & iPads",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Android Tablets",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 421,
    "name": "Netflix Premium Account — Android Tablets / Tablets & iPads",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Android Tablets",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 422,
    "name": "Spotify Premium Account — Android Tablets / Tablets & iPads",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Android Tablets",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 423,
    "name": "PlayStation Network Card — Android Tablets / Tablets & iPads",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Android Tablets",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 424,
    "name": "Samsung Galaxy S24 Ultra — Android Tablets / Tablets & iPads",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "هواتف ذكية",
    "brand": "Android Tablets",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 425,
    "name": "Apple Watch Series 9 — Android Tablets / Tablets & iPads",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "ساعات ذكية",
    "brand": "Android Tablets",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 426,
    "name": "Sony WH-1000XM5 — Android Tablets / Tablets & iPads",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "سماعات",
    "brand": "Android Tablets",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 427,
    "name": "MacBook Pro 16\" M3 Max — Android Tablets / Tablets & iPads",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "لابتوبات",
    "brand": "Android Tablets",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 428,
    "name": "Canon EOS R5 — Android Tablets / Tablets & iPads",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "كاميرات",
    "brand": "Android Tablets",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 429,
    "name": "Samsung S24 Ultra — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 430,
    "name": "Apple Watch Ultra 2 — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 431,
    "name": "سماعة Sony WH-1000XM5 — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 432,
    "name": "بطارية ليثيوم Deye — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 433,
    "name": "Honor Magic 6 Pro — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 434,
    "name": "كاميرا Xiaomi Yi — Android Tablets / Tablets & iPads",
    "brand": "Android Tablets",
    "category": "Tablets & iPads",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 435,
    "name": "Apple ID Account — iPad / Tablets & iPads",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "iPad",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 436,
    "name": "Netflix Premium Account — iPad / Tablets & iPads",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "iPad",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 437,
    "name": "Spotify Premium Account — iPad / Tablets & iPads",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "iPad",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 438,
    "name": "PlayStation Network Card — iPad / Tablets & iPads",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "iPad",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 439,
    "name": "Samsung Galaxy S24 Ultra — iPad / Tablets & iPads",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "هواتف ذكية",
    "brand": "iPad",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 440,
    "name": "Apple Watch Series 9 — iPad / Tablets & iPads",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "ساعات ذكية",
    "brand": "iPad",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 441,
    "name": "Sony WH-1000XM5 — iPad / Tablets & iPads",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "سماعات",
    "brand": "iPad",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 442,
    "name": "MacBook Pro 16\" M3 Max — iPad / Tablets & iPads",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "لابتوبات",
    "brand": "iPad",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 443,
    "name": "Canon EOS R5 — iPad / Tablets & iPads",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "كاميرات",
    "brand": "iPad",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 444,
    "name": "Samsung S24 Ultra — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 445,
    "name": "Apple Watch Ultra 2 — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 446,
    "name": "سماعة Sony WH-1000XM5 — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 447,
    "name": "بطارية ليثيوم Deye — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 448,
    "name": "Honor Magic 6 Pro — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 449,
    "name": "كاميرا Xiaomi Yi — iPad / Tablets & iPads",
    "brand": "iPad",
    "category": "Tablets & iPads",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 450,
    "name": "Apple ID Account — Accessories / Tablets & iPads",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 451,
    "name": "Netflix Premium Account — Accessories / Tablets & iPads",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 452,
    "name": "Spotify Premium Account — Accessories / Tablets & iPads",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 453,
    "name": "PlayStation Network Card — Accessories / Tablets & iPads",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 454,
    "name": "Samsung Galaxy S24 Ultra — Accessories / Tablets & iPads",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "هواتف ذكية",
    "brand": "Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 455,
    "name": "Apple Watch Series 9 — Accessories / Tablets & iPads",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "ساعات ذكية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 456,
    "name": "Sony WH-1000XM5 — Accessories / Tablets & iPads",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "سماعات",
    "brand": "Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 457,
    "name": "MacBook Pro 16\" M3 Max — Accessories / Tablets & iPads",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "لابتوبات",
    "brand": "Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 458,
    "name": "Canon EOS R5 — Accessories / Tablets & iPads",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Tablets & iPads",
    "categoryAr": "كاميرات",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 459,
    "name": "Samsung S24 Ultra — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 460,
    "name": "Apple Watch Ultra 2 — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 461,
    "name": "سماعة Sony WH-1000XM5 — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 462,
    "name": "بطارية ليثيوم Deye — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 463,
    "name": "Honor Magic 6 Pro — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 464,
    "name": "كاميرا Xiaomi Yi — Accessories / Tablets & iPads",
    "brand": "Accessories",
    "category": "Tablets & iPads",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 465,
    "name": "Apple ID Account — Digital Cameras / Cameras & Photography",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Digital Cameras",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 466,
    "name": "Netflix Premium Account — Digital Cameras / Cameras & Photography",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Digital Cameras",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 467,
    "name": "Spotify Premium Account — Digital Cameras / Cameras & Photography",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Digital Cameras",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 468,
    "name": "PlayStation Network Card — Digital Cameras / Cameras & Photography",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Digital Cameras",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 469,
    "name": "Samsung Galaxy S24 Ultra — Digital Cameras / Cameras & Photography",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "هواتف ذكية",
    "brand": "Digital Cameras",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 470,
    "name": "Apple Watch Series 9 — Digital Cameras / Cameras & Photography",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "ساعات ذكية",
    "brand": "Digital Cameras",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 471,
    "name": "Sony WH-1000XM5 — Digital Cameras / Cameras & Photography",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "سماعات",
    "brand": "Digital Cameras",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 472,
    "name": "MacBook Pro 16\" M3 Max — Digital Cameras / Cameras & Photography",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "لابتوبات",
    "brand": "Digital Cameras",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 473,
    "name": "Canon EOS R5 — Digital Cameras / Cameras & Photography",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "كاميرات",
    "brand": "Digital Cameras",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 474,
    "name": "Samsung S24 Ultra — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 475,
    "name": "Apple Watch Ultra 2 — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 476,
    "name": "سماعة Sony WH-1000XM5 — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 477,
    "name": "بطارية ليثيوم Deye — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 478,
    "name": "Honor Magic 6 Pro — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 479,
    "name": "كاميرا Xiaomi Yi — Digital Cameras / Cameras & Photography",
    "brand": "Digital Cameras",
    "category": "Cameras & Photography",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 480,
    "name": "Apple ID Account — Action Cameras / Cameras & Photography",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Action Cameras",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 481,
    "name": "Netflix Premium Account — Action Cameras / Cameras & Photography",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Action Cameras",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 482,
    "name": "Spotify Premium Account — Action Cameras / Cameras & Photography",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Action Cameras",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 483,
    "name": "PlayStation Network Card — Action Cameras / Cameras & Photography",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Action Cameras",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 484,
    "name": "Samsung Galaxy S24 Ultra — Action Cameras / Cameras & Photography",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "هواتف ذكية",
    "brand": "Action Cameras",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 485,
    "name": "Apple Watch Series 9 — Action Cameras / Cameras & Photography",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "ساعات ذكية",
    "brand": "Action Cameras",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 486,
    "name": "Sony WH-1000XM5 — Action Cameras / Cameras & Photography",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "سماعات",
    "brand": "Action Cameras",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 487,
    "name": "MacBook Pro 16\" M3 Max — Action Cameras / Cameras & Photography",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "لابتوبات",
    "brand": "Action Cameras",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 488,
    "name": "Canon EOS R5 — Action Cameras / Cameras & Photography",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "كاميرات",
    "brand": "Action Cameras",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 489,
    "name": "Samsung S24 Ultra — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 490,
    "name": "Apple Watch Ultra 2 — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 491,
    "name": "سماعة Sony WH-1000XM5 — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 492,
    "name": "بطارية ليثيوم Deye — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 493,
    "name": "Honor Magic 6 Pro — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 494,
    "name": "كاميرا Xiaomi Yi — Action Cameras / Cameras & Photography",
    "brand": "Action Cameras",
    "category": "Cameras & Photography",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 495,
    "name": "Apple ID Account — Security Cameras / Cameras & Photography",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Security Cameras",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 496,
    "name": "Netflix Premium Account — Security Cameras / Cameras & Photography",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Security Cameras",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 497,
    "name": "Spotify Premium Account — Security Cameras / Cameras & Photography",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Security Cameras",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 498,
    "name": "PlayStation Network Card — Security Cameras / Cameras & Photography",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Security Cameras",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 499,
    "name": "Samsung Galaxy S24 Ultra — Security Cameras / Cameras & Photography",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "هواتف ذكية",
    "brand": "Security Cameras",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 500,
    "name": "Apple Watch Series 9 — Security Cameras / Cameras & Photography",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "ساعات ذكية",
    "brand": "Security Cameras",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 501,
    "name": "Sony WH-1000XM5 — Security Cameras / Cameras & Photography",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "سماعات",
    "brand": "Security Cameras",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 502,
    "name": "MacBook Pro 16\" M3 Max — Security Cameras / Cameras & Photography",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "لابتوبات",
    "brand": "Security Cameras",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 503,
    "name": "Canon EOS R5 — Security Cameras / Cameras & Photography",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "كاميرات",
    "brand": "Security Cameras",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 504,
    "name": "Samsung S24 Ultra — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 505,
    "name": "Apple Watch Ultra 2 — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 506,
    "name": "سماعة Sony WH-1000XM5 — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 507,
    "name": "بطارية ليثيوم Deye — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 508,
    "name": "Honor Magic 6 Pro — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 509,
    "name": "كاميرا Xiaomi Yi — Security Cameras / Cameras & Photography",
    "brand": "Security Cameras",
    "category": "Cameras & Photography",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 510,
    "name": "Apple ID Account — Camera Accessories / Cameras & Photography",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Camera Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 511,
    "name": "Netflix Premium Account — Camera Accessories / Cameras & Photography",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Camera Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 512,
    "name": "Spotify Premium Account — Camera Accessories / Cameras & Photography",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Camera Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 513,
    "name": "PlayStation Network Card — Camera Accessories / Cameras & Photography",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "حسابات رقمية",
    "brand": "Camera Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 514,
    "name": "Samsung Galaxy S24 Ultra — Camera Accessories / Cameras & Photography",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "هواتف ذكية",
    "brand": "Camera Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 515,
    "name": "Apple Watch Series 9 — Camera Accessories / Cameras & Photography",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "ساعات ذكية",
    "brand": "Camera Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 516,
    "name": "Sony WH-1000XM5 — Camera Accessories / Cameras & Photography",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "سماعات",
    "brand": "Camera Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 517,
    "name": "MacBook Pro 16\" M3 Max — Camera Accessories / Cameras & Photography",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "لابتوبات",
    "brand": "Camera Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 518,
    "name": "Canon EOS R5 — Camera Accessories / Cameras & Photography",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Cameras & Photography",
    "categoryAr": "كاميرات",
    "brand": "Camera Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 519,
    "name": "Samsung S24 Ultra — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 520,
    "name": "Apple Watch Ultra 2 — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 521,
    "name": "سماعة Sony WH-1000XM5 — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 522,
    "name": "بطارية ليثيوم Deye — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 523,
    "name": "Honor Magic 6 Pro — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 524,
    "name": "كاميرا Xiaomi Yi — Camera Accessories / Cameras & Photography",
    "brand": "Camera Accessories",
    "category": "Cameras & Photography",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 525,
    "name": "Apple ID Account — Electric Scooters / Electric Scooters",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Electric Scooters",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 526,
    "name": "Netflix Premium Account — Electric Scooters / Electric Scooters",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Electric Scooters",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 527,
    "name": "Spotify Premium Account — Electric Scooters / Electric Scooters",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Electric Scooters",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 528,
    "name": "PlayStation Network Card — Electric Scooters / Electric Scooters",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Electric Scooters",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 529,
    "name": "Samsung Galaxy S24 Ultra — Electric Scooters / Electric Scooters",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "هواتف ذكية",
    "brand": "Electric Scooters",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 530,
    "name": "Apple Watch Series 9 — Electric Scooters / Electric Scooters",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "ساعات ذكية",
    "brand": "Electric Scooters",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 531,
    "name": "Sony WH-1000XM5 — Electric Scooters / Electric Scooters",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "سماعات",
    "brand": "Electric Scooters",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 532,
    "name": "MacBook Pro 16\" M3 Max — Electric Scooters / Electric Scooters",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "لابتوبات",
    "brand": "Electric Scooters",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 533,
    "name": "Canon EOS R5 — Electric Scooters / Electric Scooters",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "كاميرات",
    "brand": "Electric Scooters",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 534,
    "name": "Samsung S24 Ultra — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 535,
    "name": "Apple Watch Ultra 2 — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 536,
    "name": "سماعة Sony WH-1000XM5 — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 537,
    "name": "بطارية ليثيوم Deye — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 538,
    "name": "Honor Magic 6 Pro — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 539,
    "name": "كاميرا Xiaomi Yi — Electric Scooters / Electric Scooters",
    "brand": "Electric Scooters",
    "category": "Electric Scooters",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 540,
    "name": "Apple ID Account — Scooter Accessories / Electric Scooters",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Scooter Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 541,
    "name": "Netflix Premium Account — Scooter Accessories / Electric Scooters",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Scooter Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 542,
    "name": "Spotify Premium Account — Scooter Accessories / Electric Scooters",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Scooter Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 543,
    "name": "PlayStation Network Card — Scooter Accessories / Electric Scooters",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "حسابات رقمية",
    "brand": "Scooter Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 544,
    "name": "Samsung Galaxy S24 Ultra — Scooter Accessories / Electric Scooters",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "هواتف ذكية",
    "brand": "Scooter Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 545,
    "name": "Apple Watch Series 9 — Scooter Accessories / Electric Scooters",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "ساعات ذكية",
    "brand": "Scooter Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 546,
    "name": "Sony WH-1000XM5 — Scooter Accessories / Electric Scooters",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "سماعات",
    "brand": "Scooter Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 547,
    "name": "MacBook Pro 16\" M3 Max — Scooter Accessories / Electric Scooters",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "لابتوبات",
    "brand": "Scooter Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 548,
    "name": "Canon EOS R5 — Scooter Accessories / Electric Scooters",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Electric Scooters",
    "categoryAr": "كاميرات",
    "brand": "Scooter Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 549,
    "name": "Samsung S24 Ultra — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 550,
    "name": "Apple Watch Ultra 2 — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 551,
    "name": "سماعة Sony WH-1000XM5 — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 552,
    "name": "بطارية ليثيوم Deye — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 553,
    "name": "Honor Magic 6 Pro — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 554,
    "name": "كاميرا Xiaomi Yi — Scooter Accessories / Electric Scooters",
    "brand": "Scooter Accessories",
    "category": "Electric Scooters",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 555,
    "name": "Apple ID Account — Portable Power Units / Power Stations & Solar",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Portable Power Units",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 556,
    "name": "Netflix Premium Account — Portable Power Units / Power Stations & Solar",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Portable Power Units",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 557,
    "name": "Spotify Premium Account — Portable Power Units / Power Stations & Solar",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Portable Power Units",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 558,
    "name": "PlayStation Network Card — Portable Power Units / Power Stations & Solar",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Portable Power Units",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 559,
    "name": "Samsung Galaxy S24 Ultra — Portable Power Units / Power Stations & Solar",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "هواتف ذكية",
    "brand": "Portable Power Units",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 560,
    "name": "Apple Watch Series 9 — Portable Power Units / Power Stations & Solar",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "ساعات ذكية",
    "brand": "Portable Power Units",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 561,
    "name": "Sony WH-1000XM5 — Portable Power Units / Power Stations & Solar",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "سماعات",
    "brand": "Portable Power Units",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 562,
    "name": "MacBook Pro 16\" M3 Max — Portable Power Units / Power Stations & Solar",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "لابتوبات",
    "brand": "Portable Power Units",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 563,
    "name": "Canon EOS R5 — Portable Power Units / Power Stations & Solar",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "كاميرات",
    "brand": "Portable Power Units",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 564,
    "name": "Samsung S24 Ultra — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 565,
    "name": "Apple Watch Ultra 2 — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 566,
    "name": "سماعة Sony WH-1000XM5 — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 567,
    "name": "بطارية ليثيوم Deye — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 568,
    "name": "Honor Magic 6 Pro — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 569,
    "name": "كاميرا Xiaomi Yi — Portable Power Units / Power Stations & Solar",
    "brand": "Portable Power Units",
    "category": "Power Stations & Solar",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 570,
    "name": "Apple ID Account — Solar Generators / Power Stations & Solar",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Solar Generators",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 571,
    "name": "Netflix Premium Account — Solar Generators / Power Stations & Solar",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Solar Generators",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 572,
    "name": "Spotify Premium Account — Solar Generators / Power Stations & Solar",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Solar Generators",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 573,
    "name": "PlayStation Network Card — Solar Generators / Power Stations & Solar",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Solar Generators",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 574,
    "name": "Samsung Galaxy S24 Ultra — Solar Generators / Power Stations & Solar",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "هواتف ذكية",
    "brand": "Solar Generators",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 575,
    "name": "Apple Watch Series 9 — Solar Generators / Power Stations & Solar",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "ساعات ذكية",
    "brand": "Solar Generators",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 576,
    "name": "Sony WH-1000XM5 — Solar Generators / Power Stations & Solar",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "سماعات",
    "brand": "Solar Generators",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 577,
    "name": "MacBook Pro 16\" M3 Max — Solar Generators / Power Stations & Solar",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "لابتوبات",
    "brand": "Solar Generators",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 578,
    "name": "Canon EOS R5 — Solar Generators / Power Stations & Solar",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "كاميرات",
    "brand": "Solar Generators",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 579,
    "name": "Samsung S24 Ultra — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 580,
    "name": "Apple Watch Ultra 2 — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 581,
    "name": "سماعة Sony WH-1000XM5 — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 582,
    "name": "بطارية ليثيوم Deye — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 583,
    "name": "Honor Magic 6 Pro — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 584,
    "name": "كاميرا Xiaomi Yi — Solar Generators / Power Stations & Solar",
    "brand": "Solar Generators",
    "category": "Power Stations & Solar",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 585,
    "name": "Apple ID Account — Power Stations / Power Stations & Solar",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Stations",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 586,
    "name": "Netflix Premium Account — Power Stations / Power Stations & Solar",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Stations",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 587,
    "name": "Spotify Premium Account — Power Stations / Power Stations & Solar",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Stations",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 588,
    "name": "PlayStation Network Card — Power Stations / Power Stations & Solar",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Power Stations",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 589,
    "name": "Samsung Galaxy S24 Ultra — Power Stations / Power Stations & Solar",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "هواتف ذكية",
    "brand": "Power Stations",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 590,
    "name": "Apple Watch Series 9 — Power Stations / Power Stations & Solar",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "ساعات ذكية",
    "brand": "Power Stations",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 591,
    "name": "Sony WH-1000XM5 — Power Stations / Power Stations & Solar",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "سماعات",
    "brand": "Power Stations",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 592,
    "name": "MacBook Pro 16\" M3 Max — Power Stations / Power Stations & Solar",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "لابتوبات",
    "brand": "Power Stations",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 593,
    "name": "Canon EOS R5 — Power Stations / Power Stations & Solar",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "كاميرات",
    "brand": "Power Stations",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 594,
    "name": "Samsung S24 Ultra — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 595,
    "name": "Apple Watch Ultra 2 — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 596,
    "name": "سماعة Sony WH-1000XM5 — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 597,
    "name": "بطارية ليثيوم Deye — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 598,
    "name": "Honor Magic 6 Pro — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 599,
    "name": "كاميرا Xiaomi Yi — Power Stations / Power Stations & Solar",
    "brand": "Power Stations",
    "category": "Power Stations & Solar",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 600,
    "name": "Apple ID Account — Accessories / Power Stations & Solar",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 601,
    "name": "Netflix Premium Account — Accessories / Power Stations & Solar",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 602,
    "name": "Spotify Premium Account — Accessories / Power Stations & Solar",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 603,
    "name": "PlayStation Network Card — Accessories / Power Stations & Solar",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "حسابات رقمية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 604,
    "name": "Samsung Galaxy S24 Ultra — Accessories / Power Stations & Solar",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "هواتف ذكية",
    "brand": "Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 605,
    "name": "Apple Watch Series 9 — Accessories / Power Stations & Solar",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "ساعات ذكية",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 606,
    "name": "Sony WH-1000XM5 — Accessories / Power Stations & Solar",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "سماعات",
    "brand": "Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 607,
    "name": "MacBook Pro 16\" M3 Max — Accessories / Power Stations & Solar",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "لابتوبات",
    "brand": "Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 608,
    "name": "Canon EOS R5 — Accessories / Power Stations & Solar",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Power Stations & Solar",
    "categoryAr": "كاميرات",
    "brand": "Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 609,
    "name": "Samsung S24 Ultra — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 610,
    "name": "Apple Watch Ultra 2 — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 611,
    "name": "سماعة Sony WH-1000XM5 — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 612,
    "name": "بطارية ليثيوم Deye — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 613,
    "name": "Honor Magic 6 Pro — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 614,
    "name": "كاميرا Xiaomi Yi — Accessories / Power Stations & Solar",
    "brand": "Accessories",
    "category": "Power Stations & Solar",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 615,
    "name": "Apple ID Account — Game Consoles / Gaming & Entertainment",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Consoles",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 616,
    "name": "Netflix Premium Account — Game Consoles / Gaming & Entertainment",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Consoles",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 617,
    "name": "Spotify Premium Account — Game Consoles / Gaming & Entertainment",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Consoles",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 618,
    "name": "PlayStation Network Card — Game Consoles / Gaming & Entertainment",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Consoles",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 619,
    "name": "Samsung Galaxy S24 Ultra — Game Consoles / Gaming & Entertainment",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "هواتف ذكية",
    "brand": "Game Consoles",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 620,
    "name": "Apple Watch Series 9 — Game Consoles / Gaming & Entertainment",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "ساعات ذكية",
    "brand": "Game Consoles",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 621,
    "name": "Sony WH-1000XM5 — Game Consoles / Gaming & Entertainment",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "سماعات",
    "brand": "Game Consoles",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 622,
    "name": "MacBook Pro 16\" M3 Max — Game Consoles / Gaming & Entertainment",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "لابتوبات",
    "brand": "Game Consoles",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 623,
    "name": "Canon EOS R5 — Game Consoles / Gaming & Entertainment",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "كاميرات",
    "brand": "Game Consoles",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 624,
    "name": "Samsung S24 Ultra — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 625,
    "name": "Apple Watch Ultra 2 — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 626,
    "name": "سماعة Sony WH-1000XM5 — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 627,
    "name": "بطارية ليثيوم Deye — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 628,
    "name": "Honor Magic 6 Pro — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 629,
    "name": "كاميرا Xiaomi Yi — Game Consoles / Gaming & Entertainment",
    "brand": "Game Consoles",
    "category": "Gaming & Entertainment",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 630,
    "name": "Apple ID Account — Game Accessories / Gaming & Entertainment",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Accessories",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 631,
    "name": "Netflix Premium Account — Game Accessories / Gaming & Entertainment",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Accessories",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 632,
    "name": "Spotify Premium Account — Game Accessories / Gaming & Entertainment",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Accessories",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 633,
    "name": "PlayStation Network Card — Game Accessories / Gaming & Entertainment",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Accessories",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 634,
    "name": "Samsung Galaxy S24 Ultra — Game Accessories / Gaming & Entertainment",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "هواتف ذكية",
    "brand": "Game Accessories",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 635,
    "name": "Apple Watch Series 9 — Game Accessories / Gaming & Entertainment",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "ساعات ذكية",
    "brand": "Game Accessories",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 636,
    "name": "Sony WH-1000XM5 — Game Accessories / Gaming & Entertainment",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "سماعات",
    "brand": "Game Accessories",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 637,
    "name": "MacBook Pro 16\" M3 Max — Game Accessories / Gaming & Entertainment",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "لابتوبات",
    "brand": "Game Accessories",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 638,
    "name": "Canon EOS R5 — Game Accessories / Gaming & Entertainment",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "كاميرات",
    "brand": "Game Accessories",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 639,
    "name": "Samsung S24 Ultra — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 640,
    "name": "Apple Watch Ultra 2 — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 641,
    "name": "سماعة Sony WH-1000XM5 — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 642,
    "name": "بطارية ليثيوم Deye — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 643,
    "name": "Honor Magic 6 Pro — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 644,
    "name": "كاميرا Xiaomi Yi — Game Accessories / Gaming & Entertainment",
    "brand": "Game Accessories",
    "category": "Gaming & Entertainment",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 645,
    "name": "Apple ID Account — Game Library / Gaming & Entertainment",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Library",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 646,
    "name": "Netflix Premium Account — Game Library / Gaming & Entertainment",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Library",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 647,
    "name": "Spotify Premium Account — Game Library / Gaming & Entertainment",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Library",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 648,
    "name": "PlayStation Network Card — Game Library / Gaming & Entertainment",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Game Library",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 649,
    "name": "Samsung Galaxy S24 Ultra — Game Library / Gaming & Entertainment",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "هواتف ذكية",
    "brand": "Game Library",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 650,
    "name": "Apple Watch Series 9 — Game Library / Gaming & Entertainment",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "ساعات ذكية",
    "brand": "Game Library",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 651,
    "name": "Sony WH-1000XM5 — Game Library / Gaming & Entertainment",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "سماعات",
    "brand": "Game Library",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 652,
    "name": "MacBook Pro 16\" M3 Max — Game Library / Gaming & Entertainment",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "لابتوبات",
    "brand": "Game Library",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 653,
    "name": "Canon EOS R5 — Game Library / Gaming & Entertainment",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "كاميرات",
    "brand": "Game Library",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 654,
    "name": "Samsung S24 Ultra — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 655,
    "name": "Apple Watch Ultra 2 — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 656,
    "name": "سماعة Sony WH-1000XM5 — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 657,
    "name": "بطارية ليثيوم Deye — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 658,
    "name": "Honor Magic 6 Pro — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 659,
    "name": "كاميرا Xiaomi Yi — Game Library / Gaming & Entertainment",
    "brand": "Game Library",
    "category": "Gaming & Entertainment",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 660,
    "name": "Apple ID Account — Subscriptions / Gaming & Entertainment",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Subscriptions",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 661,
    "name": "Netflix Premium Account — Subscriptions / Gaming & Entertainment",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Subscriptions",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 662,
    "name": "Spotify Premium Account — Subscriptions / Gaming & Entertainment",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Subscriptions",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 663,
    "name": "PlayStation Network Card — Subscriptions / Gaming & Entertainment",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "حسابات رقمية",
    "brand": "Subscriptions",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 664,
    "name": "Samsung Galaxy S24 Ultra — Subscriptions / Gaming & Entertainment",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "هواتف ذكية",
    "brand": "Subscriptions",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 665,
    "name": "Apple Watch Series 9 — Subscriptions / Gaming & Entertainment",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "ساعات ذكية",
    "brand": "Subscriptions",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 666,
    "name": "Sony WH-1000XM5 — Subscriptions / Gaming & Entertainment",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "سماعات",
    "brand": "Subscriptions",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 667,
    "name": "MacBook Pro 16\" M3 Max — Subscriptions / Gaming & Entertainment",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "لابتوبات",
    "brand": "Subscriptions",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 668,
    "name": "Canon EOS R5 — Subscriptions / Gaming & Entertainment",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Gaming & Entertainment",
    "categoryAr": "كاميرات",
    "brand": "Subscriptions",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 669,
    "name": "Samsung S24 Ultra — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 670,
    "name": "Apple Watch Ultra 2 — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 671,
    "name": "سماعة Sony WH-1000XM5 — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 672,
    "name": "بطارية ليثيوم Deye — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 673,
    "name": "Honor Magic 6 Pro — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 674,
    "name": "كاميرا Xiaomi Yi — Subscriptions / Gaming & Entertainment",
    "brand": "Subscriptions",
    "category": "Gaming & Entertainment",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 675,
    "name": "Apple ID Account — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "حسابات رقمية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 676,
    "name": "Netflix Premium Account — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "حسابات رقمية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 677,
    "name": "Spotify Premium Account — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "حسابات رقمية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 678,
    "name": "PlayStation Network Card — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "حسابات رقمية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 679,
    "name": "Samsung Galaxy S24 Ultra — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "هواتف ذكية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 680,
    "name": "Apple Watch Series 9 — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "ساعات ذكية",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 681,
    "name": "Sony WH-1000XM5 — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "سماعات",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 682,
    "name": "MacBook Pro 16\" M3 Max — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "لابتوبات",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 683,
    "name": "Canon EOS R5 — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Repair & Spare Parts",
    "categoryAr": "كاميرات",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 684,
    "name": "Samsung S24 Ultra — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 685,
    "name": "Apple Watch Ultra 2 — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 686,
    "name": "سماعة Sony WH-1000XM5 — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 687,
    "name": "بطارية ليثيوم Deye — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 688,
    "name": "Honor Magic 6 Pro — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 689,
    "name": "كاميرا Xiaomi Yi — Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia) / Repair & Spare Parts",
    "brand": "Mobile Repair Parts (Samsung, iPhone, Huawei, Xiaomi, Oppo, Realme, Infinix, Tecno, Honor, Nokia)",
    "category": "Repair & Spare Parts",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 690,
    "name": "Apple ID Account — Printing Services / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Printing Services",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 691,
    "name": "Netflix Premium Account — Printing Services / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Printing Services",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 692,
    "name": "Spotify Premium Account — Printing Services / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Printing Services",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 693,
    "name": "PlayStation Network Card — Printing Services / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Printing Services",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 694,
    "name": "Samsung Galaxy S24 Ultra — Printing Services / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Printing Services",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 695,
    "name": "Apple Watch Series 9 — Printing Services / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Printing Services",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 696,
    "name": "Sony WH-1000XM5 — Printing Services / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Printing Services",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 697,
    "name": "MacBook Pro 16\" M3 Max — Printing Services / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Printing Services",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 698,
    "name": "Canon EOS R5 — Printing Services / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Printing Services",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 699,
    "name": "Samsung S24 Ultra — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 700,
    "name": "Apple Watch Ultra 2 — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 701,
    "name": "سماعة Sony WH-1000XM5 — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 702,
    "name": "بطارية ليثيوم Deye — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 703,
    "name": "Honor Magic 6 Pro — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 704,
    "name": "كاميرا Xiaomi Yi — Printing Services / Printing & Digital Services",
    "brand": "Printing Services",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 705,
    "name": "Apple ID Account — Product Comparison / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Product Comparison",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 706,
    "name": "Netflix Premium Account — Product Comparison / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Product Comparison",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 707,
    "name": "Spotify Premium Account — Product Comparison / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Product Comparison",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 708,
    "name": "PlayStation Network Card — Product Comparison / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Product Comparison",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 709,
    "name": "Samsung Galaxy S24 Ultra — Product Comparison / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Product Comparison",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 710,
    "name": "Apple Watch Series 9 — Product Comparison / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Product Comparison",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 711,
    "name": "Sony WH-1000XM5 — Product Comparison / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Product Comparison",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 712,
    "name": "MacBook Pro 16\" M3 Max — Product Comparison / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Product Comparison",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 713,
    "name": "Canon EOS R5 — Product Comparison / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Product Comparison",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 714,
    "name": "Samsung S24 Ultra — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 715,
    "name": "Apple Watch Ultra 2 — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 716,
    "name": "سماعة Sony WH-1000XM5 — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 717,
    "name": "بطارية ليثيوم Deye — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 718,
    "name": "Honor Magic 6 Pro — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 719,
    "name": "كاميرا Xiaomi Yi — Product Comparison / Printing & Digital Services",
    "brand": "Product Comparison",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 720,
    "name": "Apple ID Account — Apps / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Apps",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 721,
    "name": "Netflix Premium Account — Apps / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Apps",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 722,
    "name": "Spotify Premium Account — Apps / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Apps",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 723,
    "name": "PlayStation Network Card — Apps / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Apps",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 724,
    "name": "Samsung Galaxy S24 Ultra — Apps / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Apps",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 725,
    "name": "Apple Watch Series 9 — Apps / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Apps",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 726,
    "name": "Sony WH-1000XM5 — Apps / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Apps",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 727,
    "name": "MacBook Pro 16\" M3 Max — Apps / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Apps",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 728,
    "name": "Canon EOS R5 — Apps / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Apps",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 729,
    "name": "Samsung S24 Ultra — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 730,
    "name": "Apple Watch Ultra 2 — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 731,
    "name": "سماعة Sony WH-1000XM5 — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 732,
    "name": "بطارية ليثيوم Deye — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 733,
    "name": "Honor Magic 6 Pro — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 734,
    "name": "كاميرا Xiaomi Yi — Apps / Printing & Digital Services",
    "brand": "Apps",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 735,
    "name": "Apple ID Account — Online Payment / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Online Payment",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 736,
    "name": "Netflix Premium Account — Online Payment / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Online Payment",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 737,
    "name": "Spotify Premium Account — Online Payment / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Online Payment",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 738,
    "name": "PlayStation Network Card — Online Payment / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Online Payment",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 739,
    "name": "Samsung Galaxy S24 Ultra — Online Payment / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Online Payment",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 740,
    "name": "Apple Watch Series 9 — Online Payment / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Online Payment",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 741,
    "name": "Sony WH-1000XM5 — Online Payment / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Online Payment",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 742,
    "name": "MacBook Pro 16\" M3 Max — Online Payment / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Online Payment",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 743,
    "name": "Canon EOS R5 — Online Payment / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Online Payment",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 744,
    "name": "Samsung S24 Ultra — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 745,
    "name": "Apple Watch Ultra 2 — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 746,
    "name": "سماعة Sony WH-1000XM5 — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 747,
    "name": "بطارية ليثيوم Deye — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 748,
    "name": "Honor Magic 6 Pro — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 749,
    "name": "كاميرا Xiaomi Yi — Online Payment / Printing & Digital Services",
    "brand": "Online Payment",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 750,
    "name": "Apple ID Account — Offers & Promotions / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Offers & Promotions",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 751,
    "name": "Netflix Premium Account — Offers & Promotions / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Offers & Promotions",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 752,
    "name": "Spotify Premium Account — Offers & Promotions / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Offers & Promotions",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 753,
    "name": "PlayStation Network Card — Offers & Promotions / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Offers & Promotions",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 754,
    "name": "Samsung Galaxy S24 Ultra — Offers & Promotions / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Offers & Promotions",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 755,
    "name": "Apple Watch Series 9 — Offers & Promotions / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Offers & Promotions",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 756,
    "name": "Sony WH-1000XM5 — Offers & Promotions / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Offers & Promotions",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 757,
    "name": "MacBook Pro 16\" M3 Max — Offers & Promotions / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Offers & Promotions",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 758,
    "name": "Canon EOS R5 — Offers & Promotions / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Offers & Promotions",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 759,
    "name": "Samsung S24 Ultra — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 760,
    "name": "Apple Watch Ultra 2 — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 761,
    "name": "سماعة Sony WH-1000XM5 — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 762,
    "name": "بطارية ليثيوم Deye — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 763,
    "name": "Honor Magic 6 Pro — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 764,
    "name": "كاميرا Xiaomi Yi — Offers & Promotions / Printing & Digital Services",
    "brand": "Offers & Promotions",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 765,
    "name": "Apple ID Account — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 766,
    "name": "Netflix Premium Account — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 767,
    "name": "Spotify Premium Account — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 768,
    "name": "PlayStation Network Card — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "حسابات رقمية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 769,
    "name": "Samsung Galaxy S24 Ultra — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "سامسونج جالاكسي S24 الترا",
    "basePrice": 1299000,
    "price": "1,299,000",
    "oldPrice": "1,499,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "هواتف ذكية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.8,
    "reviews": 234,
    "badge": "NEW",
    "isNew": true,
    "description": "Experience the future with S Pen, 200MP camera, and AI features",
    "descriptionAr": "اختبر المستقبل مع قلم S Pen وكاميرا 200 ميجابكسل وميزات الذكاء الاصطناعي",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ]
  },
  {
    "id": 770,
    "name": "Apple Watch Series 9 — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "ساعة آبل سيريس 9",
    "basePrice": 549000,
    "price": "549,000",
    "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "ساعات ذكية",
    "brand": "Maintenance & Technical Support",
    "rating": 4.9,
    "reviews": 189,
    "isNew": true,
    "description": "Double-tap gesture, brighter display, and carbon neutral options",
    "descriptionAr": "إيماءة النقر المزدوج، شاشة أكثر سطوعاً، وخيارات محايدة للكربون",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ]
  },
  {
    "id": 771,
    "name": "Sony WH-1000XM5 — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "سوني WH-1000XM5",
    "basePrice": 449000,
    "price": "449,000",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "سماعات",
    "brand": "Maintenance & Technical Support",
    "rating": 4.7,
    "reviews": 456,
    "isHot": true,
    "badge": "HOT",
    "description": "Industry-leading noise cancellation, 30hr battery, multipoint connection",
    "descriptionAr": "إلغاء ضوضاء رائد في الصناعة، بطارية 30 ساعة، اتصال متعدد النقاط",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ]
  },
  {
    "id": 772,
    "name": "MacBook Pro 16\" M3 Max — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "ماك بوك برو 16 بوصة M3 Max",
    "basePrice": 3299000,
    "price": "3,299,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "لابتوبات",
    "brand": "Maintenance & Technical Support",
    "rating": 5,
    "reviews": 89,
    "isNew": true,
    "badge": "NEW",
    "description": "M3 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display",
    "descriptionAr": "معالج M3 Max، ذاكرة 48 جيجابايت، SSD 1 تيرابايت، شاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ]
  },
  {
    "id": 773,
    "name": "Canon EOS R5 — Maintenance & Technical Support / Printing & Digital Services",
    "nameAr": "كانون EOS R5",
    "basePrice": 3899000,
    "price": "3,899,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1606980591165-23028d3a1c8a?w=500&q=80",
    "category": "Printing & Digital Services",
    "categoryAr": "كاميرات",
    "brand": "Maintenance & Technical Support",
    "rating": 4.9,
    "reviews": 267,
    "description": "45MP full-frame, 8K video, 5-axis IBIS, dual card slots",
    "descriptionAr": "45 ميجابكسل كامل الإطار، فيديو 8K، تثبيت 5 محاور، فتحتي بطاقة"
  },
  {
    "id": 774,
    "name": "Samsung S24 Ultra — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "4,200,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.8 بوصة AMOLED 2K"
      },
      {
        "icon": "Camera",
        "title": "ا��كاميرا",
        "value": "200MP + 50MP + 12MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5000 mAh"
      },
      {
        "icon": "Laptop",
        "title": "المعالج",
        "value": "Snapdragon 8 Gen 3"
      }
    ]
  },
  {
    "id": 775,
    "name": "Apple Watch Ultra 2 — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "2,800,000",
    "image": "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyNjYzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Watch",
        "title": "الشاشة",
        "value": "1.9 بوصة Retina"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "36 ساعة"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "100m مقاوم للماء"
      }
    ]
  },
  {
    "id": 776,
    "name": "سماعة Sony WH-1000XM5 — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 777,
    "name": "بطارية ليثيوم Deye — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "3,500,000",
    "image": "https://images.unsplash.com/photo-1635861321688-b63d28749a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjBkZXZpY2V8ZW58MXx8fHwxNzYwMjY2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "حار",
    "isHot": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ]
  },
  {
    "id": 778,
    "name": "Honor Magic 6 Pro — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "2,900,000",
    "image": "https://images.unsplash.com/photo-1758186355698-bd0183fc75ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjAxNjgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ]
  },
  {
    "id": 779,
    "name": "كاميرا Xiaomi Yi — Maintenance & Technical Support / Printing & Digital Services",
    "brand": "Maintenance & Technical Support",
    "category": "Printing & Digital Services",
    "price": "650,000",
    "image": "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAyMDc2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ]
  },
  {
    "id": 5,
    "name": "Apple Watch Series 9",
    "nameAr": "آبل ووتش سلسلة 9",
    "basePrice": 1800000,
    "price": "1,800,000",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "Wearables",
    "categoryAr": "أجهزة قابلة للارتداء",
    "brand": "Apple",
    "rating": 4.8,
    "reviews": 432,
    "description": "Apple Watch Series 9 with advanced health features",
    "descriptionAr": "آبل ووتش سلسلة 9 مع ميزات صحية متقدمة",
    "specs": [
      {
        "title": "Display",
        "value": "Always-On Retina",
        "icon": "Watch"
      },
      {
        "title": "Chip",
        "value": "S9 SiP",
        "icon": "Settings"
      },
      {
        "title": "Battery",
        "value": "18 hours",
        "icon": "Battery"
      },
      {
        "title": "Sensors",
        "value": "Advanced Health",
        "icon": "Shield"
      }
    ],
    "offers": [
      {
        "type": "free_product",
        "freeProductId": 21,
        "titleEn": "Free Extra Band",
        "titleAr": "حزام إضافي مجاني",
        "descriptionEn": "Get a premium sport band free with your Apple Watch purchase",
        "descriptionAr": "احصل على حزام رياضي مجاني مع شراء آبل ووتش"
      }
    ]
  },
  {
    "id": 13,
    "name": "Wireless Charger",
    "nameAr": "شاحن لاسلكي",
    "basePrice": 120000,
    "price": "120,000",
    "image": "https://images.unsplash.com/photo-1591290619762-c588e0c7d4de?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.7,
    "reviews": 321,
    "description": "Fast wireless charging pad",
    "descriptionAr": "قاعدة شحن لاسلكي سريع"
  },
  {
    "id": 14,
    "name": "Car Phone Mount",
    "nameAr": "حامل هاتف للسيارة",
    "basePrice": 60000,
    "price": "60,000",
    "image": "https://images.unsplash.com/photo-1609269291096-19f728ab7c3e?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.5,
    "reviews": 543,
    "description": "Magnetic car phone holder",
    "descriptionAr": "حامل هاتف مغناطيسي للسيارة"
  },
  {
    "id": 15,
    "name": "AirPods Pro (2nd Gen)",
    "nameAr": "إيربودز برو (الجيل الثاني)",
    "basePrice": 950000,
    "price": "950,000",
    "image": "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80",
    "category": "Audio",
    "categoryAr": "صوتيات",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 1876,
    "description": "Premium wireless earbuds with ANC",
    "descriptionAr": "سماعات لاسلكية مميزة مع إلغاء ضوضاء"
  },
  {
    "id": 16,
    "name": "Magic Mouse",
    "nameAr": "ماوس ماجيك",
    "basePrice": 350000,
    "price": "350,000",
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Apple",
    "rating": 4.6,
    "reviews": 432,
    "description": "Wireless Magic Mouse",
    "descriptionAr": "ماوس ماجيك لاسلكي"
  },
  {
    "id": 17,
    "name": "Magic Keyboard",
    "nameAr": "لوحة مفاتيح ماجيك",
    "basePrice": 450000,
    "price": "450,000",
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Apple",
    "rating": 4.7,
    "reviews": 321,
    "description": "Wireless Magic Keyboard",
    "descriptionAr": "لوحة مفاتيح ماجيك لاسلكية"
  },
  {
    "id": 18,
    "name": "USB-C Hub 7-in-1",
    "nameAr": "موزع USB-C 7 في 1",
    "basePrice": 280000,
    "price": "280,000",
    "image": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.5,
    "reviews": 234,
    "description": "7-in-1 USB-C hub for MacBook",
    "descriptionAr": "موزع USB-C 7 في 1 للماك بوك"
  },
  {
    "id": 19,
    "name": "iPad Pencil (2nd Gen)",
    "nameAr": "قلم آيباد (الجيل الثاني)",
    "basePrice": 480000,
    "price": "480,000",
    "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 765,
    "description": "Precision stylus for iPad",
    "descriptionAr": "قلم دقيق للآيباد"
  },
  {
    "id": 20,
    "name": "iPad Smart Folio",
    "nameAr": "غطاء آيباد الذكي",
    "basePrice": 220000,
    "price": "220,000",
    "image": "https://images.unsplash.com/photo-1585790050230-5dd28404f905?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Apple",
    "rating": 4.6,
    "reviews": 543,
    "description": "Smart protective cover for iPad",
    "descriptionAr": "غطاء واقي ذكي للآيباد"
  },
  {
    "id": 21,
    "name": "Apple Watch Sport Band",
    "nameAr": "حزام رياضي لآبل ووتش",
    "basePrice": 180000,
    "price": "180,000",
    "image": "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Apple",
    "rating": 4.7,
    "reviews": 432,
    "description": "Premium sport band for Apple Watch",
    "descriptionAr": "حزام رياضي مميز لآبل ووتش"
  },
  {
    "id": 22,
    "name": "Headphone Carrying Case",
    "nameAr": "حقيبة حمل للسماعات",
    "basePrice": 85000,
    "price": "85,000",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.5,
    "reviews": 234,
    "description": "Protective carrying case",
    "descriptionAr": "حقيبة حمل واقية"
  },
  {
    "id": 23,
    "name": "Audio Cable 3.5mm",
    "nameAr": "كابل صوت 3.5 ملم",
    "basePrice": 35000,
    "price": "35,000",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.4,
    "reviews": 123,
    "description": "Premium audio cable",
    "descriptionAr": "كابل صوت مميز"
  },
  {
    "id": 24,
    "name": "Headphone Cleaning Kit",
    "nameAr": "طقم تنظيف السماعات",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1600087626014-e652e18bbff2?w=500&q=80",
    "category": "Accessories",
    "categoryAr": "إكسسوارات",
    "brand": "Generic",
    "rating": 4.3,
    "reviews": 98,
    "description": "Professional cleaning kit",
    "descriptionAr": "طقم تنظيف احترافي"
  },
  {
    "id": 25,
    "name": "DualSense Wireless Controller",
    "nameAr": "يد تحكم لاسلكية DualSense",
    "basePrice": 280000,
    "price": "280,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Gaming",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.8,
    "reviews": 1234,
    "description": "Next-gen wireless controller",
    "descriptionAr": "يد تحكم لاسلكية من الجيل القادم"
  },
  {
    "id": 26,
    "name": "Spider-Man 2",
    "nameAr": "سبايدر مان 2",
    "basePrice": 300000,
    "price": "300,000",
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80",
    "category": "Games",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 2345,
    "description": "Latest Spider-Man game",
    "descriptionAr": "أحدث لعبة سبايدر مان"
  },
  {
    "id": 27,
    "name": "FIFA 24",
    "nameAr": "فيفا 24",
    "basePrice": 280000,
    "price": "280,000",
    "image": "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=500&q=80",
    "category": "Games",
    "categoryAr": "ألعاب",
    "brand": "EA Sports",
    "rating": 4.7,
    "reviews": 1876,
    "description": "Latest FIFA football game",
    "descriptionAr": "أحدث لعبة فيفا لكرة القدم"
  },
  {
    "id": 28,
    "name": "God of War Ragnarök",
    "nameAr": "جود أوف وور راجناروك",
    "basePrice": 300000,
    "price": "300,000",
    "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    "category": "Games",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 3456,
    "description": "Epic Norse mythology adventure",
    "descriptionAr": "مغامرة ملحمية في الأساطير الإسكندنافية"
  },
  {
    "id": 29,
    "name": "PS5 Camera HD",
    "nameAr": "كاميرا PS5 عالية الدقة",
    "basePrice": 240000,
    "price": "240,000",
    "image": "https://images.unsplash.com/photo-1612198188632-b711ef3fb3e1?w=500&q=80",
    "category": "Gaming",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.6,
    "reviews": 432,
    "description": "HD camera for PS5",
    "descriptionAr": "كاميرا عالية الدقة لـ PS5"
  },
  {
    "id": 30,
    "name": "PS5 Headset",
    "nameAr": "سماعة PS5",
    "basePrice": 380000,
    "price": "380,000",
    "image": "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80",
    "category": "Gaming",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.8,
    "reviews": 765,
    "description": "3D Audio gaming headset",
    "descriptionAr": "سماعة ألعاب بصوت ثلاثي الأبعاد"
  },
  {
    "id": 31,
    "name": "PS5 Charging Station",
    "nameAr": "محطة شحن PS5",
    "basePrice": 120000,
    "price": "120,000",
    "image": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&q=80",
    "category": "Gaming",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.7,
    "reviews": 543,
    "description": "Dual controller charging station",
    "descriptionAr": "محطة شحن ليدين تحكم"
  },
  {
    "id": 32,
    "name": "PS5 Media Remote",
    "nameAr": "ريموت وسائط PS5",
    "basePrice": 95000,
    "price": "95,000",
    "image": "https://images.unsplash.com/photo-1615750185825-4f89e92f9d55?w=500&q=80",
    "category": "Gaming",
    "categoryAr": "ألعاب",
    "brand": "Sony",
    "rating": 4.5,
    "reviews": 321,
    "description": "Media playback remote control",
    "descriptionAr": "ريموت تحكم لتشغيل الوسائط"
  }
];

export const productsBySection = {
  mostBought: [
  {
    "id": 101,
    "name": "Apple ID Account",
    "nameAr": "حساب آبل آي دي",
    "basePrice": 25000,
    "price": "25,000",
    "image": "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 523,
    "badge": "HOT",
    "isHot": true,
    "description": "Apple ID account with multiple balance options",
    "descriptionAr": "حساب آبل آي دي مع خيارات رصيد متعددة",
    "chargeOptions": [
      {
        "id": "apple-5",
        "value": "$5 Credit",
        "valueAr": "5 دولار",
        "price": 25000
      },
      {
        "id": "apple-10",
        "value": "$10 Credit",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "apple-25",
        "value": "$25 Credit",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "apple-50",
        "value": "$50 Credit",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "apple-100",
        "value": "$100 Credit",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "keyAr": "النوع",
        "value": "Digital Account",
        "valueAr": "حساب رقمي"
      },
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/Global",
        "valueAr": "أمريكا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Instant",
        "valueAr": "فوري"
      }
    ]
  },
  {
    "id": 102,
    "name": "Netflix Premium Account",
    "nameAr": "حساب نتفليكس بريميوم",
    "basePrice": 20000,
    "price": "20,000",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Netflix",
    "rating": 4.8,
    "reviews": 892,
    "badge": "HOT",
    "isHot": true,
    "description": "Netflix Premium subscription with flexible durations",
    "descriptionAr": "اشتراك نتفليكس بريميوم مع مدد مرنة",
    "chargeOptions": [
      {
        "id": "netflix-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 20000
      },
      {
        "id": "netflix-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 55000
      },
      {
        "id": "netflix-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 100000
      },
      {
        "id": "netflix-12m",
        "value": "12 Months",
        "valueAr": "12 شهر",
        "price": 180000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "4K UHD",
        "valueAr": "4K UHD"
      },
      {
        "key": "Screens",
        "keyAr": "الشاشات",
        "value": "4 Devices",
        "valueAr": "4 أجهزة"
      },
      {
        "key": "Profile",
        "keyAr": "الحسابات الفرعية",
        "value": "Private",
        "valueAr": "خاص"
      }
    ]
  },
  {
    "id": 103,
    "name": "Spotify Premium Account",
    "nameAr": "حساب سبوتيفاي بريميوم",
    "basePrice": 15000,
    "price": "15,000",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Spotify",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "Spotify Premium with ad-free music streaming",
    "descriptionAr": "سبوتيفاي بريميوم مع بث موسيقى بدون إعلانات",
    "chargeOptions": [
      {
        "id": "spotify-1m",
        "value": "1 Month",
        "valueAr": "شهر واحد",
        "price": 15000
      },
      {
        "id": "spotify-3m",
        "value": "3 Months",
        "valueAr": "3 أشهر",
        "price": 40000
      },
      {
        "id": "spotify-6m",
        "value": "6 Months",
        "valueAr": "6 أشهر",
        "price": 75000
      }
    ],
    "specifications": [
      {
        "key": "Quality",
        "keyAr": "الجودة",
        "value": "320kbps",
        "valueAr": "320kbps"
      },
      {
        "key": "Downloads",
        "keyAr": "التحميل",
        "value": "Unlimited",
        "valueAr": "غير محدود"
      },
      {
        "key": "Ads",
        "keyAr": "الإعلانات",
        "value": "No Ads",
        "valueAr": "بدون إعلانات"
      }
    ]
  },
  {
    "id": 104,
    "name": "PlayStation Network Card",
    "nameAr": "بطاقة بلايستيشن نتورك",
    "basePrice": 50000,
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    "category": "Digital Accounts",
    "categoryAr": "حسابات رقمية",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 1203,
    "description": "PSN wallet top-up cards for all your gaming needs",
    "descriptionAr": "بطاقات شحن محفظة PSN لجميع احتياجاتك في الألعاب",
    "chargeOptions": [
      {
        "id": "psn-10",
        "value": "$10 Card",
        "valueAr": "10 دولار",
        "price": 50000
      },
      {
        "id": "psn-25",
        "value": "$25 Card",
        "valueAr": "25 دولار",
        "price": 125000
      },
      {
        "id": "psn-50",
        "value": "$50 Card",
        "valueAr": "50 دولار",
        "price": 250000
      },
      {
        "id": "psn-100",
        "value": "$100 Card",
        "valueAr": "100 دولار",
        "price": 500000
      }
    ],
    "specifications": [
      {
        "key": "Region",
        "keyAr": "المنطقة",
        "value": "US/EU/Global",
        "valueAr": "أمريكا/أوروبا/عالمي"
      },
      {
        "key": "Delivery",
        "keyAr": "التوصيل",
        "value": "Digital Code",
        "valueAr": "كود رقمي"
      },
      {
        "key": "Expiry",
        "keyAr": "الصلاحية",
        "value": "No Expiration",
        "valueAr": "بدون انتهاء"
      }
    ]
  },
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "nameAr": "آيفون 15 برو",
    "basePrice": 4500000,
    "price": "3,825,000",
    "oldPrice": "4,500,000",
    "image": "https://images.unsplash.com/photo-1632633173522-966f15363c5e?w=500&q=80",
    "category": "Smartphones",
    "categoryAr": "هواتف ذكية",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 1234,
    "badge": "NEW",
    "isNew": true,
    "description": "The latest iPhone 15 Pro with A17 Pro chip and titanium design",
    "descriptionAr": "أحدث آيفون 15 برو مع معالج A17 Pro وتصميم تيتانيوم",
    "colorVariants": [
      {
        "name": "Titanium Black",
        "nameAr": "أسود تيتانيوم",
        "hexCode": "#2C3539",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
        "images": [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
        ],
        "stock": 15,
        "sku": "SAM-S24U-BLK"
      },
      {
        "name": "Titanium Gray",
        "nameAr": "رمادي تيتانيوم",
        "hexCode": "#6B7280",
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        "stock": 8,
        "sku": "SAM-S24U-GRY"
      },
      {
        "name": "Titanium Violet",
        "nameAr": "بنفسجي تيتانيوم",
        "hexCode": "#8B5CF6",
        "image": "https://images.unsplash.com/photo-1592286927505-c80d1b3c0c8c?w=500&q=80",
        "stock": 12,
        "sku": "SAM-S24U-VIO"
      },
      {
        "name": "Titanium Yellow",
        "nameAr": "أصفر تيتانيوم",
        "hexCode": "#F59E0B",
        "image": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80",
        "stock": 5,
        "sku": "SAM-S24U-YEL"
      }
    ],
    "specifications": [
      {
        "key": "Display",
        "keyAr": "الشاشة",
        "value": "6.8\" Dynamic AMOLED 2X",
        "valueAr": "6.8 بوصة Dynamic AMOLED 2X"
      },
      {
        "key": "Processor",
        "keyAr": "المعالج",
        "value": "Snapdragon 8 Gen 3",
        "valueAr": "Snapdragon 8 Gen 3"
      },
      {
        "key": "RAM",
        "keyAr": "الذاكرة",
        "value": "12GB",
        "valueAr": "12 جيجابايت"
      },
      {
        "key": "Storage",
        "keyAr": "التخزين",
        "value": "256GB/512GB/1TB",
        "valueAr": "256/512 جيجابايت/1 تيرابايت"
      },
      {
        "key": "Camera",
        "keyAr": "الكاميرا",
        "value": [
          "200MP Main + 50MP Telephoto + 12MP Ultra-wide"
        ],
        "valueAr": [
          "200 ميجابكسل رئيسية + 50 ميجابكسل تقريب + 12 ميجابكسل واسعة"
        ]
      }
    ],
    "specs": [
      {
        "title": "Screen",
        "value": "6.1 inch",
        "icon": "Smartphone"
      },
      {
        "title": "Chip",
        "value": "A17 Pro",
        "icon": "Settings"
      },
      {
        "title": "Camera",
        "value": "48MP Pro",
        "icon": "Camera"
      },
      {
        "title": "Storage",
        "value": "256GB",
        "icon": "Laptop"
      }
    ],
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 15,
        "titleEn": "15% OFF Special Deal",
        "titleAr": "خصم 15٪ عرض خاص",
        "descriptionEn": "Save 15% on the latest iPhone 15 Pro. Limited time offer!",
        "descriptionAr": "وفر 15٪ على أحدث آيفون 15 برو. عرض لفترة محدودة!"
      }
    ]
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S24",
    "nameAr": "سامسونج جالاكسي S24",
    "basePrice": 3800000,
    "price": "3,800,000",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    "category": "Smartphones",
    "categoryAr": "هواتف ذكية",
    "brand": "Samsung",
    "rating": 4.8,
    "reviews": 987,
    "isNew": true,
    "description": "Samsung Galaxy S24 with AI features and 200MP camera",
    "descriptionAr": "سامسونج جالاكسي S24 مع ميزات الذكاء الاصطناعي وكاميرا 200 ميجابكسل",
    "colorVariants": [
      {
        "name": "Midnight",
        "nameAr": "أسود منتصف الليل",
        "hexCode": "#1a1a1a",
        "image": "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=500&q=80",
        "stock": 20,
        "sku": "APL-AW9-MID"
      },
      {
        "name": "Starlight",
        "nameAr": "فضي ستارلايت",
        "hexCode": "#E5E5EA",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        "stock": 18,
        "sku": "APL-AW9-STR"
      },
      {
        "name": "Pink",
        "nameAr": "وردي",
        "hexCode": "#FFC0CB",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        "stock": 10,
        "sku": "APL-AW9-PNK"
      },
      {
        "name": "(PRODUCT)RED",
        "nameAr": "أحمر",
        "hexCode": "#E1251B",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        "stock": 7,
        "sku": "APL-AW9-RED"
      }
    ],
    "specs": [
      {
        "title": "Screen",
        "value": "6.2 inch",
        "icon": "Smartphone"
      },
      {
        "title": "Processor",
        "value": "Snapdragon 8 Gen 3",
        "icon": "Settings"
      },
      {
        "title": "Camera",
        "value": "200MP",
        "icon": "Camera"
      },
      {
        "title": "RAM",
        "value": "12GB",
        "icon": "Laptop"
      }
    ],
    "offers": [
      {
        "type": "coupon",
        "couponValue": 100000,
        "titleEn": "Buy & Get 100,000 Coupon",
        "titleAr": "اشتري واحصل على كوبون 100,000",
        "descriptionEn": "Purchase Samsung Galaxy S24 and receive a 100,000 SYP coupon to spend on selected accessories",
        "descriptionAr": "اشترِ سامسونج جالاكسي S24 واحصل على كوبون بقيمة 100,000 ل.س للإنفاق على الإكسسوارات المختارة",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14
        ],
        "validityDays": 30
      }
    ]
  },
  {
    "id": 3,
    "name": "MacBook Pro 14\"",
    "nameAr": "ماك بوك برو 14 إنش",
    "basePrice": 8500000,
    "price": "8,500,000",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "category": "Laptops",
    "categoryAr": "حواسيب محمولة",
    "brand": "Apple",
    "rating": 4.9,
    "reviews": 856,
    "isHot": true,
    "badge": "HOT",
    "description": "MacBook Pro with M3 Pro chip and Liquid Retina XDR display",
    "descriptionAr": "ماك بوك برو مع معالج M3 Pro وشاشة Liquid Retina XDR",
    "colorVariants": [
      {
        "name": "Black",
        "nameAr": "أسود",
        "hexCode": "#000000",
        "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
        "stock": 25,
        "sku": "SNY-WH1K-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#C0C0C0",
        "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        "stock": 15,
        "sku": "SNY-WH1K-SLV"
      }
    ],
    "specs": [
      {
        "title": "Chip",
        "value": "M3 Pro",
        "icon": "Settings"
      },
      {
        "title": "RAM",
        "value": "18GB",
        "icon": "Laptop"
      },
      {
        "title": "Storage",
        "value": "512GB SSD",
        "icon": "Laptop"
      },
      {
        "title": "Display",
        "value": "14.2 inch XDR",
        "icon": "Smartphone"
      }
    ],
    "offers": [
      {
        "type": "free_product",
        "freeProductId": 15,
        "titleEn": "Free AirPods with MacBook",
        "titleAr": "إيربودز مجانية مع ماك بوك",
        "descriptionEn": "Get AirPods Pro absolutely free when you purchase MacBook Pro",
        "descriptionAr": "احصل على إيربودز برو مجاناً تماماً عند شراء ماك بوك برو"
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 25,
        "relatedProductIds": [
          16,
          17,
          18
        ],
        "titleEn": "25% OFF on Accessories",
        "titleAr": "خصم 25٪ على الإكسسوارات",
        "descriptionEn": "Get 25% discount on MacBook accessories when you buy this product",
        "descriptionAr": "احصل على خصم 25٪ على إكسسوارات ماك بوك عند شراء هذا المنتج"
      }
    ]
  },
  {
    "id": 4,
    "name": "iPad Air 11\"",
    "nameAr": "آيباد إير 11 إنش",
    "basePrice": 2500000,
    "price": "2,450,000",
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    "category": "Tablets",
    "categoryAr": "أجهزة لوحية",
    "brand": "Apple",
    "rating": 4.7,
    "reviews": 654,
    "isNew": true,
    "badge": "NEW",
    "description": "iPad Air with M2 chip and stunning 11-inch display",
    "descriptionAr": "آيباد إير مع معالج M2 وشاشة مذهلة 11 إنش",
    "colorVariants": [
      {
        "name": "Space Black",
        "nameAr": "أسود فضائي",
        "hexCode": "#1f1f1f",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        "stock": 8,
        "sku": "APL-MBP16-BLK"
      },
      {
        "name": "Silver",
        "nameAr": "فضي",
        "hexCode": "#E8E8E8",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        "stock": 12,
        "sku": "APL-MBP16-SLV"
      }
    ],
    "oldPrice": "2,500,000",
    "specs": [
      {
        "title": "Chip",
        "value": "M2",
        "icon": "Settings"
      },
      {
        "title": "Display",
        "value": "11 inch Liquid Retina",
        "icon": "Smartphone"
      },
      {
        "title": "Storage",
        "value": "128GB",
        "icon": "Laptop"
      },
      {
        "title": "Camera",
        "value": "12MP",
        "icon": "Camera"
      }
    ],
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 50000,
        "titleEn": "Save 50,000 SYP",
        "titleAr": "وفّر 50,000 ل.س",
        "descriptionEn": "Instant discount of 50,000 SYP on iPad Air",
        "descriptionAr": "خصم فوري 50,000 ل.س على آيباد إير"
      },
      {
        "type": "coupon",
        "couponValue": 75000,
        "titleEn": "Bonus 75,000 Coupon",
        "titleAr": "كوبون إضافي 75,000",
        "descriptionEn": "Receive an additional 75,000 SYP coupon for future purchases",
        "descriptionAr": "احصل على كوبون إضافي بقيمة 75,000 ل.س للمشتريات المستقبلية",
        "eligibleProductIds": [
          10,
          11,
          12,
          13,
          14,
          19,
          20
        ],
        "validityDays": 45
      }
    ]
  },
  {
    "id": 6,
    "name": "Sony WH-1000XM5 Headphones",
    "nameAr": "سماعات سوني WH-1000XM5",
    "basePrice": 1200000,
    "price": "1,200,000",
    "oldPrice": "4,299,000",
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    "category": "Audio",
    "categoryAr": "صوتيات",
    "brand": "Sony",
    "rating": 4.9,
    "reviews": 765,
    "description": "Industry-leading noise canceling headphones",
    "descriptionAr": "سماعات بتقنية إلغاء ضوضاء رائدة في الصناعة",
    "specs": [
      {
        "title": "Noise Canceling",
        "value": "Advanced ANC",
        "icon": "Headphones"
      },
      {
        "title": "Battery",
        "value": "30 hours",
        "icon": "Battery"
      },
      {
        "title": "Sound",
        "value": "Hi-Res Audio",
        "icon": "Settings"
      },
      {
        "title": "Connectivity",
        "value": "Bluetooth 5.2",
        "icon": "Settings"
      }
    ],
    "offers": [
      {
        "type": "bundle_discount",
        "discountPercentage": 20,
        "relatedProductIds": [
          22,
          23,
          24
        ],
        "titleEn": "20% OFF Bundle",
        "titleAr": "خصم 20٪ على الحزمة",
        "descriptionEn": "Save 20% when you bundle with headphone accessories",
        "descriptionAr": "وفر 20٪ عند الشراء مع إكسسوارات السماعات"
      }
    ]
  }
],
  newProducts: [
  {
    "id": 7,
    "name": "Anker PowerCore 20000mAh",
    "brand": "Anker",
    "category": "Power Banks",
    "price": "245,000",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.7,
    "specs": [
      {
        "title": "Capacity",
        "value": "20000mAh",
        "icon": "Battery"
      },
      {
        "title": "Ports",
        "value": "USB-C + USB-A",
        "icon": "Settings"
      },
      {
        "title": "Output",
        "value": "18W Fast Charge",
        "icon": "Battery"
      },
      {
        "title": "Weight",
        "value": "356g",
        "icon": "Settings"
      }
    ],
    "nameAr": "بطارية أنكر محمولة 20000 مللي أمبير",
    "basePrice": 350000,
    "oldPrice": "350,000",
    "categoryAr": "بطاريات محمولة",
    "reviews": 1543,
    "description": "High-capacity portable charger with fast charging",
    "descriptionAr": "شاحن محمول بسعة عالية مع شحن سريع",
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "percentage",
        "discountValue": 30,
        "titleEn": "30% Flash Sale",
        "titleAr": "تخفيضات سريعة 30٪",
        "descriptionEn": "Limited flash sale - 30% off on premium power banks",
        "descriptionAr": "تخفيضات سريعة محدودة - خصم 30٪ على البطاريات المحمولة المميزة"
      }
    ]
  },
  {
    "id": 8,
    "name": "PlayStation 5 Console",
    "brand": "Sony",
    "category": "Gaming",
    "price": "4,850,000",
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
    "badge": "حار",
    "isHot": true,
    "rating": 4.9,
    "specs": [
      {
        "title": "GPU",
        "value": "10.28 TFLOPs",
        "icon": "Gamepad2"
      },
      {
        "title": "SSD",
        "value": "825GB Ultra-fast",
        "icon": "Laptop"
      },
      {
        "title": "Resolution",
        "value": "8K Support",
        "icon": "Smartphone"
      },
      {
        "title": "Ray Tracing",
        "value": "Hardware RT",
        "icon": "Settings"
      }
    ],
    "nameAr": "جهاز بلاي ستيشن 5",
    "basePrice": 5000000,
    "oldPrice": "5,000,000",
    "categoryAr": "ألعاب",
    "reviews": 2341,
    "description": "Next-gen gaming console with stunning graphics",
    "descriptionAr": "جهاز ألعاب من الجيل القادم برسومات مذهلة",
    "offers": [
      {
        "type": "direct_discount",
        "discountType": "value",
        "discountValue": 150000,
        "titleEn": "Mega Deal - 150,000 OFF",
        "titleAr": "عرض ضخم - خصم 150,000",
        "descriptionEn": "Massive savings of 150,000 SYP on gaming console",
        "descriptionAr": "توفير هائل 150,000 ل.س على جهاز الألعاب"
      },
      {
        "type": "free_product",
        "freeProductId": 25,
        "titleEn": "Free Extra Controller",
        "titleAr": "يد تحكم إضافية مجانية",
        "descriptionEn": "Receive a wireless controller absolutely free",
        "descriptionAr": "احصل على يد تحكم لاسلكية مجاناً تماماً"
      },
      {
        "type": "coupon",
        "couponValue": 200000,
        "titleEn": "200,000 Gaming Coupon",
        "titleAr": "كوبون ألعاب 200,000",
        "descriptionEn": "Get 200,000 SYP coupon for games and accessories",
        "descriptionAr": "احصل على كوبون 200,000 ل.س للألعاب والإكسسوارات",
        "eligibleProductIds": [
          26,
          27,
          28,
          29,
          30
        ],
        "validityDays": 60
      },
      {
        "type": "bundle_discount",
        "discountPercentage": 35,
        "relatedProductIds": [
          26,
          27,
          28,
          29,
          30,
          31,
          32
        ],
        "titleEn": "35% Bundle Discount",
        "titleAr": "خصم 35٪ على الحزمة",
        "descriptionEn": "Save 35% on all gaming accessories and games",
        "descriptionAr": "وفر 35٪ على جميع إكسسوارات وألعاب الجيمنج"
      }
    ]
  },
  {
    "id": 9,
    "name": "سماعة Sony WH-1000XM5",
    "brand": "Sony",
    "category": "سماعات",
    "price": "1,100,000",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYwMjI5NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "badge": "جديد",
    "isNew": true,
    "rating": 5,
    "specs": [
      {
        "icon": "Headphones",
        "title": "نوع الاتصال",
        "value": "Bluetooth 5.3"
      },
      {
        "icon": "Battery",
        "title": "عمر البطارية",
        "value": "30 ساعة"
      },
      {
        "icon": "Settings",
        "title": "إلغاء الضوضاء",
        "value": "Active ANC"
      }
    ]
  },
  {
    "id": 10,
    "name": "USB-C Cable 2m",
    "brand": "Generic",
    "category": "Accessories",
    "price": "50,000",
    "image": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=500&q=80",
    "badge": "حار",
    "isHot": true,
    "rating": 4.5,
    "specs": [
      {
        "icon": "Battery",
        "title": "السعة",
        "value": "5kWh"
      },
      {
        "icon": "Settings",
        "title": "الجهد",
        "value": "48V"
      },
      {
        "icon": "Shield",
        "title": "العمر الافتراضي",
        "value": "6000 دورة"
      }
    ],
    "nameAr": "كابل USB-C 2 متر",
    "basePrice": 50000,
    "categoryAr": "إكسسوارات",
    "reviews": 234,
    "description": "High-quality USB-C charging cable",
    "descriptionAr": "كابل شحن USB-C عالي الجودة"
  },
  {
    "id": 11,
    "name": "Phone Case Premium",
    "brand": "Generic",
    "category": "Accessories",
    "price": "75,000",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.6,
    "specs": [
      {
        "icon": "Smartphone",
        "title": "الشاشة",
        "value": "6.78 بوصة OLED"
      },
      {
        "icon": "Camera",
        "title": "الكاميرا",
        "value": "50MP + 180MP + 50MP"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "5600 mAh"
      }
    ],
    "nameAr": "حافظة هاتف مميزة",
    "basePrice": 75000,
    "categoryAr": "إكسسوارات",
    "reviews": 456,
    "description": "Premium protective phone case",
    "descriptionAr": "حافظة هاتف واقية مميزة"
  },
  {
    "id": 12,
    "name": "Screen Protector",
    "brand": "Generic",
    "category": "Accessories",
    "price": "40,000",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    "badge": "جديد",
    "isNew": true,
    "rating": 4.4,
    "specs": [
      {
        "icon": "Camera",
        "title": "الدقة",
        "value": "4K 60fps"
      },
      {
        "icon": "Battery",
        "title": "البطارية",
        "value": "1400 mAh"
      },
      {
        "icon": "Shield",
        "title": "المقاومة",
        "value": "مقاوم للماء 40m"
      }
    ],
    "nameAr": "واقي شاشة",
    "basePrice": 40000,
    "categoryAr": "إكسسوارات",
    "reviews": 678,
    "description": "Tempered glass screen protector",
    "descriptionAr": "واقي شاشة زجاجي مقوى"
  }
]
};

export const getProductById = (id: number | string) => products.find((p) => String(p.id) === String(id));

export const getProductOffers = (productId: number): ProductOffer[] => {
  return offersDatabase.find((p) => p.productId === productId)?.offers || [];
};

export const hasOffers = (productId: number): boolean => {
  return getProductOffers(productId).length > 0;
};

export const getOfferBadgeText = (offers: ProductOffer[], language: "ar" | "en"): string => {
  if (offers.length === 0) return "";
  const directDiscount = offers.find((o) => o.type === "direct_discount") as DirectDiscountOffer | undefined;
  const freeProduct = offers.find((o) => o.type === "free_product");
  const coupon = offers.find((o) => o.type === "coupon");
  const bundle = offers.find((o) => o.type === "bundle_discount");
  if (directDiscount) {
    if (directDiscount.discountType === "percentage") {
      return `${directDiscount.discountValue}% ${language === "ar" ? "خصم" : "OFF"}`;
    }
    return language === "ar" ? "خصم خاص" : "SPECIAL";
  }
  if (freeProduct) return language === "ar" ? "هدية مجانية" : "FREE GIFT";
  if (coupon) return language === "ar" ? "كوبون" : "COUPON";
  if (bundle) return language === "ar" ? "عرض حزمة" : "BUNDLE";
  return "";
};

export const calculateDiscountedPrice = (basePrice: number, offers: ProductOffer[]): number => {
  let finalPrice = basePrice;
  const directDiscount = offers.find((o) => o.type === "direct_discount") as DirectDiscountOffer | undefined;
  if (directDiscount) {
    if (directDiscount.discountType === "percentage") {
      finalPrice = basePrice * (1 - directDiscount.discountValue / 100);
    } else {
      finalPrice = basePrice - directDiscount.discountValue;
    }
  }
  return Math.max(0, finalPrice);
};

export const getTotalSavings = (basePrice: number, offers: ProductOffer[]) => basePrice - calculateDiscountedPrice(basePrice, offers);
