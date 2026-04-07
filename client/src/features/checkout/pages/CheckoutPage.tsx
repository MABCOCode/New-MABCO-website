import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  Gift,
  Home,
  Locate,
  MapPin,
  Navigation,
  Package,
  Phone,
  Search,
  Sparkles,
  Store,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { getProductOffers, products } from "../../../data/products";
import translations from "../../../i18n/translations";
import type { BundleDiscountOffer, CouponOffer } from "../../../types/product";
import { AppliedOffersSection } from "../../offer/components/AppliedOffersSection";
// Allow using google maps JS types at runtime without requiring TS types
declare const google: any;
declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_MAPS_SRC =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyALOnHuVIdWZKeWhDy2A8MPL_WGWcSMY_8&libraries=places";

interface CartItem {
  id: number | string;
  productId?: number;
  stkCode?: string | null;
  name: string;
  nameAr?: string;
  price: string | undefined;
  oldPrice?: string;
  image?: string;
  quantity: number;
  variant?: string;
  variantColor?: string;
  variantSku?: string | null;
  chargeOptionSku?: string | null;
  chargeOption?: { optionId: string; value: string } | null;
  appliedOffers?: any[] | null;
  isFreeGift?: boolean;
  isBundleItem?: boolean;
  linkedToProductId?: number;
  bundleDiscount?: number;
  bundleDiscountType?: "value" | "percentage" | null;
}

interface Showroom {
  id: string;
  loc_code?: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  nameAr?: string;
  cityAr?: string;
  addressAr?: string;
  nameEn?: string;
  cityEn?: string;
  addressEn?: string;
}

interface RawShowroom {
  Loc_code: string;
  City_name: string;
  Loc_name: string;
  Phone: string;
  Address: string;
  Winter_from_date: string;
  Winter_to_date: string;
  week_end: string;
}

interface CheckoutPageProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onConfirmOrder: (orderData: any) => void;
  language: "ar" | "en";
}

interface LocationData {
  lat: number;
  lng: number;
  formattedAddress: string;
  city: string;
  area: string;
  country: string;
}



// Default center for Syria (Damascus)
const DEFAULT_CENTER = { lat: 33.5138, lng: 36.2765 };

import { CartOfferDisplay } from "@/features/offer/components/CartOfferDisplay";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  applyOfferDiscount,
  formatOfferDiscountLabel,
  getOfferSavings,
  resolveOfferDiscountType,
  resolveOfferDiscountValue,
} from "../../../utils/offerPricing";

export function CheckoutPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const { cartItems, clearCart, addToCart, removeFromCart } = useCart();
  const asText = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value.join(" ") : value ?? "";

  // State
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup" | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    area: "",
    street: "",
    building: "",
    addressNotes: "",
    preferredDate: "",
    preferredTime: "morning",
    deliveryInstructions: "",
  });
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom | null>(null);
  const [showroomSearch, setShowroomSearch] = useState("");
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showroomsLoading, setShowroomsLoading] = useState(true);
  const [showroomsError, setShowroomsError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSubmitError, setOrderSubmitError] = useState<string | null>(null);
  const [appliedCoupons, setAppliedCoupons] = useState<Map<string, CouponOffer>>(new Map());
  const [freeProductsAdded, setFreeProductsAdded] = useState<Map<string, number>>(new Map());
  const [bundleProductsAdded, setBundleProductsAdded] = useState<Map<string, number[]>>(new Map());

  const showroomSliderRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapsLoaderRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let mounted = true;
    const resolveList = (data: any, lang: "ar" | "en") => {
      if (Array.isArray(data)) {
        const directList = data.find((item) => item && Array.isArray(item?.[lang]));
        if (directList) return directList[lang];
        if (data.length > 0 && Array.isArray(data[0]?.[lang])) return data[0][lang];
        return data;
      }
      if (data && Array.isArray(data[lang])) return data[lang];
      return [];
    };

    (async () => {
      setShowroomsLoading(true);
      setShowroomsError(null);
      try {
        const res = await fetch("/static/showrooms.json");
        if (!res.ok) throw new Error(`Failed to load showrooms: ${res.status}`);
        const json = await res.json();
        if (!mounted) return;

        const arList: RawShowroom[] = resolveList(json, "ar");
        const enList: RawShowroom[] = resolveList(json, "en");
        const byCode = new Map<string, { ar?: RawShowroom; en?: RawShowroom }>();

        arList.forEach((row) => {
          if (!row?.Loc_code) return;
          const entry = byCode.get(row.Loc_code) || {};
          entry.ar = row;
          byCode.set(row.Loc_code, entry);
        });

        enList.forEach((row) => {
          if (!row?.Loc_code) return;
          const entry = byCode.get(row.Loc_code) || {};
          entry.en = row;
          byCode.set(row.Loc_code, entry);
        });

        const rows: Showroom[] = Array.from(byCode.values())
          .map(({ ar, en }) => {
            const chosen = (language === "ar" ? ar : en) || ar || en;
            if (!chosen) return null;
            const hours = `${chosen.Winter_from_date || ""} ${chosen.Winter_to_date || ""}`.trim();
            return {
              id: chosen.Loc_code,
              loc_code: chosen.Loc_code,
              name:
                (language === "ar" ? ar?.Loc_name : en?.Loc_name) ||
                chosen.Loc_name ||
                "",
              city:
                (language === "ar" ? ar?.City_name : en?.City_name) ||
                chosen.City_name ||
                "",
              address:
                (language === "ar" ? ar?.Address : en?.Address) ||
                chosen.Address ||
                "",
              phone: chosen.Phone || ar?.Phone || en?.Phone || "",
              hours,
              nameAr: ar?.Loc_name,
              cityAr: ar?.City_name,
              addressAr: ar?.Address,
              nameEn: en?.Loc_name,
              cityEn: en?.City_name,
              addressEn: en?.Address,
            };
          })
          .filter(Boolean) as Showroom[];

        setShowrooms(rows);
      } catch (err: any) {
        setShowroomsError(err?.message || "Failed to load showrooms.");
        setShowrooms([]);
      } finally {
        if (mounted) setShowroomsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [language]);

  // Initialize map when component mounts for delivery
  useEffect(() => {
    if (fulfillmentType === "delivery") {
      const timer = setTimeout(() => {
        showMap();
        setTimeout(() => {
          const mapElement = document.getElementById("map");
          if (mapElement) {
            // Map element found, event listener should be attached
          }
        }, 200);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fulfillmentType]);

  // Listen for map location changes
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const handleMapLocationChange = (event: any) => {
      const { lat, lng } = event.detail;
      updateLocationFromLatLng(lat, lng);
    };

    // Function to attach event listener
    const attachEventListener = () => {
      const mapElement = document.getElementById("map");
      if (mapElement && !cleanup) {
        mapElement.addEventListener("mapLocationChange", handleMapLocationChange);
        cleanup = () => {
          mapElement.removeEventListener("mapLocationChange", handleMapLocationChange);
        };
      }
    };

    // Attach immediately if map exists
    attachEventListener();

    // Set up a mutation observer to watch for the map element
    const observer = new MutationObserver(() => {
      attachEventListener();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also attach when map is shown (with a delay to ensure DOM is ready)
    const timer = setTimeout(() => {
      attachEventListener();
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    const nextFree = new Map<string, number>();
    const nextBundle = new Map<string, number[]>();

    cartItems.forEach((item) => {
      if (!item.linkedToProductId) return;
      const linkedKey = String(item.linkedToProductId);
      const rawRelatedId = item.productId ?? item.id;
      const relatedId = typeof rawRelatedId === "number" ? rawRelatedId : Number(rawRelatedId);
      if (!Number.isFinite(relatedId) || relatedId <= 0) return;

      if (item.isFreeGift) {
        nextFree.set(linkedKey, relatedId);
      }

      if (item.isBundleItem) {
        const list = nextBundle.get(linkedKey) ?? [];
        if (!list.includes(relatedId)) {
          nextBundle.set(linkedKey, [...list, relatedId]);
        }
      }
    });

    setFreeProductsAdded(nextFree);
    setBundleProductsAdded(nextBundle);
  }, [cartItems]);

  const loadGoogleMaps = () => {
    if (window.google?.maps) {
      return Promise.resolve();
    }
    if (mapsLoaderRef.current) {
      return mapsLoaderRef.current;
    }
    mapsLoaderRef.current = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-google-maps="true"]',
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
        return;
      }
      const script = document.createElement("script");
      script.src = GOOGLE_MAPS_SRC;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-google-maps", "true");
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(script);
    });
    return mapsLoaderRef.current;
  };

  const emitMapLocationChange = (lat: number, lng: number) => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;
    mapContainer.setAttribute("data-lat", String(lat));
    mapContainer.setAttribute("data-lng", String(lng));
    const event = new CustomEvent("mapLocationChange", {
      detail: { lat, lng },
    });
    mapContainer.dispatchEvent(event);
  };

  const updateMapLocation = (location: { lat: number; lng: number }) => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setCenter(location);
    markerRef.current.setPosition(location);
    emitMapLocationChange(location.lat, location.lng);
  };

  const initMap = () => {
    if (!window.google?.maps) return;
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    if (mapRef.current && markerRef.current) return;

    const defaultLocation = DEFAULT_CENTER;
    mapRef.current = new google.maps.Map(mapElement, {
      center: defaultLocation,
      zoom: 12,
    });

    markerRef.current = new google.maps.Marker({
      position: defaultLocation,
      map: mapRef.current,
      draggable: true,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateMapLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          updateMapLocation(defaultLocation);
        },
      );
    } else {
      updateMapLocation(defaultLocation);
    }

    google.maps.event.addListener(markerRef.current, "dragend", (event: any) => {
      emitMapLocationChange(event.latLng.lat(), event.latLng.lng());
    });

    google.maps.event.addListener(mapRef.current, "click", (event: any) => {
      markerRef.current.setPosition(event.latLng);
      emitMapLocationChange(event.latLng.lat(), event.latLng.lng());
    });
  };

  const showMap = async () => {
    try {
      await loadGoogleMaps();
      if (!mapRef.current) {
        initMap();
      } else {
        google.maps.event.trigger(mapRef.current, "resize");
        mapRef.current.setCenter(markerRef.current?.getPosition?.());
      }
    } catch (err) {
      console.warn("Failed to initialize Google Maps", err);
    }
  };

  const getCurrentLocation = async () => {
    try {
      await loadGoogleMaps();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateMapLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            alert(
              language === "ar"
                ? "تعذر الحصول على موقعك الحالي. يرجى التحقق من إعدادات الموقع."
                : "Unable to get your current location. Please check location settings.",
            );
          },
        );
      } else {
        alert(
          language === "ar"
            ? "المتصفح لا يدعم خاصية تحديد الموقع الجغرافي."
            : "Your browser does not support geolocation.",
        );
      }
    } catch (err) {
      console.warn("Failed to load Google Maps for location", err);
    }
  };

  const updateLocationFromLatLng = (lat: number, lng: number) => {
    if (!window.google) {
      // Fallback: set basic location data even without geocoding
      setLocationData({
        lat,
        lng,
        formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: "",
        area: "",
        country: "",
      });
      // Clear any location error when location is successfully set
      setErrors(prev => ({ ...prev, location: "" }));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components;
        let city = "";
        let area = "";
        let country = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("sublocality") || component.types.includes("neighborhood")) {
            area = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        const locationData = {
          lat,
          lng,
          formattedAddress: results[0].formatted_address,
          city: city || "",
          area: area || "",
          country: country || "",
        };
        setLocationData(locationData);
        // Clear any location error when location is successfully set
        setErrors(prev => ({ ...prev, location: "" }));
      } else {
        // Geocoding failed, but still set basic location data
        const locationData = {
          lat,
          lng,
          formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: "",
          area: "",
          country: "",
        };
        setLocationData(locationData);
        // Clear any location error when location is successfully set
        setErrors(prev => ({ ...prev, location: "" }));
      }
    });
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  // Calculate prices
  const parsePrice = (price: string | number | undefined) => {
    if (price === null || typeof price === "undefined") return 0;
    if (typeof price === "number") return Number.isFinite(price) ? price : 0;
    return parseInt(price.replace(/,/g, "")) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  const couponDiscount = (() => {
    let discount = 0;
    cartItems.forEach((source, idx) => {
      const offer = (source as any).appliedOffers?.find((o: any) => o?.type === "coupon");
      if (!offer) return;
      const offerValue = resolveOfferDiscountValue(offer);
      const isPercent = resolveOfferDiscountType(offer) === "percentage";
      let remaining = offerValue * (source.quantity || 1);
      if (!isPercent && remaining <= 0) return;
      for (let j = idx + 1; j < cartItems.length && (isPercent || remaining > 0); j += 1) {
        const target = cartItems[j];
        if (target.isFreeGift || target.isBundleItem || target.linkedToProductId) continue;
        const lineTotal = parsePrice(target.price) * target.quantity;
        if (lineTotal <= 0) continue;
        const applied = isPercent ? (lineTotal * offerValue) / 100 : Math.min(remaining, lineTotal);
        if (!isPercent) remaining -= applied;
        discount += applied;
      }
    });
    return discount;
  })();

  const calculateTotalSavings = () => {
    let savings = 0;

    cartItems.forEach((item) => {
      if (item.isFreeGift) {
        const giftValue = item.oldPrice ? parsePrice(item.oldPrice) : parsePrice(item.price);
        savings += giftValue * item.quantity;
        return;
      }

      if (item.isBundleItem && item.oldPrice) {
        const bundleSavings = Math.max(0, parsePrice(item.oldPrice) - parsePrice(item.price));
        savings += bundleSavings * item.quantity;
      }

      const productId = item.productId ?? item.id;
      if (!productId) return;
      const offers = item.appliedOffers?.length
        ? getProductOffers({ offers: item.appliedOffers } as any)
        : getProductOffers(productId);
      offers.forEach((offer) => {
        if (offer.type === "direct_discount") {
          const itemPrice =
            typeof (item as any).basePrice === "number"
              ? (item as any).basePrice
              : item.oldPrice
              ? parsePrice(item.oldPrice)
              : parsePrice(item.price);
          savings += getOfferSavings(itemPrice, offer) * item.quantity;
        }
      });
    });

    return Math.max(0, savings);
  };

  const totalSavings = calculateTotalSavings() + couponDiscount;
  
  let deliveryFee = 0;
  // Free shipping - delivery fee is always 0
  // if (fulfillmentType === "delivery" && locationData) {
  //   // Calculate delivery fee based on distance (mock calculation)
  //   deliveryFee = 50000; // Base fee in IQD
  // }
  
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const formatPrice = (price: number) => price.toLocaleString();
  const getItemDiscountBadge = (item: CartItem) => {
    if (item.isBundleItem && item.bundleDiscount) {
      return formatOfferDiscountLabel(
        { type: "bundle_discount", discountValue: item.bundleDiscount, discountType: item.bundleDiscountType ?? "percentage" },
        language,
        t.currency,
        isArabic ? "خصم" : "Off",
      );
    }
    const offer = (item.appliedOffers || []).find((entry: any) =>
      entry?.type === "direct_discount" || entry?.type === "coupon",
    );
    if (offer) {
      return formatOfferDiscountLabel(
        offer,
        language,
        t.currency,
        isArabic ? "خصم" : "Off",
      );
    }
    return "";
  };

  // Filter showrooms
  const filteredShowrooms = showrooms
    .slice()
    .sort((a, b) => {
      const cityCompare = a.city.localeCompare(b.city);
      if (cityCompare !== 0) return cityCompare;
      return a.name.localeCompare(b.name);
    })
    .filter((showroom) =>
      [
        showroom.name,
        showroom.city,
        showroom.address,
        showroom.nameAr,
        showroom.cityAr,
        showroom.addressAr,
        showroom.nameEn,
        showroom.cityEn,
        showroom.addressEn,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(showroomSearch.toLowerCase())
    );

  const clearCouponOffer = (productId: number | string) => {
    setAppliedCoupons((prev) => {
      const key = String(productId);
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const clearFreeOffer = (productId: number | string) => {
    const key = String(productId);
    cartItems
      .filter((item) => item.isFreeGift && String(item.linkedToProductId) === key)
      .forEach((item) => removeFromCart(item.id));
    setFreeProductsAdded((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const clearBundleOffer = (productId: number | string) => {
    const key = String(productId);
    cartItems
      .filter((item) => item.isBundleItem && String(item.linkedToProductId) === key)
      .forEach((item) => removeFromCart(item.id));
    setBundleProductsAdded((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const handleApplyCoupon = (productId: number, coupon: CouponOffer) => {
    clearFreeOffer(productId);
    clearBundleOffer(productId);
    setAppliedCoupons((prev) => {
      const next = new Map(prev);
      next.set(productId, coupon);
      return next;
    });
  };

  const handleAddFreeProduct = (productId: number, freeProductId: number) => {
    clearCouponOffer(productId);
    clearBundleOffer(productId);
    if (freeProductsAdded.has(productId)) return;
    const freeProduct = products.find((p) => p.id === freeProductId);
    if (!freeProduct) return;

    const basePrice = parsePrice(freeProduct.price);
    addToCart(freeProduct, {
      customId: `free-${productId}-${freeProductId}`,
      quantity: 1,
      overridePrice: 0,
      overrideOldPrice: basePrice,
      isFreeGift: true,
      linkedToProductId: productId,
    });

    setFreeProductsAdded((prev) => {
      const next = new Map(prev);
      next.set(productId, freeProductId);
      return next;
    });
  };

  const handleAddBundleProduct = (productId: number, bundleProductId: number) => {
    clearCouponOffer(productId);
    clearFreeOffer(productId);
    const existing = bundleProductsAdded.get(productId) || [];
    if (existing.includes(bundleProductId)) return;
    const bundleProduct = products.find((p) => p.id === bundleProductId);
    if (!bundleProduct) return;

    const offers = getProductOffers(productId);
    const bundleOffer = offers.find((offer) => offer.type === "bundle_discount") as BundleDiscountOffer | undefined;
    const discountValue = resolveOfferDiscountValue(bundleOffer);
    const basePrice = parsePrice(bundleProduct.price);
    const discountedPrice = Math.round(applyOfferDiscount(basePrice, bundleOffer));

    addToCart(bundleProduct, {
      customId: `bundle-${productId}-${bundleProductId}`,
      quantity: 1,
      overridePrice: discountedPrice,
      overrideOldPrice: basePrice,
      isBundleItem: true,
      linkedToProductId: productId,
      bundleDiscount: discountValue,
      bundleDiscountType: resolveOfferDiscountType(bundleOffer),
    });

    setBundleProductsAdded((prev) => {
      const next = new Map(prev);
      const updated = next.get(productId) ?? [];
      if (!updated.includes(bundleProductId)) {
        next.set(productId, [...updated, bundleProductId]);
      }
      return next;
    });
  };

  const normalizeOfferForOrder = (offer: any) => {
    if (!offer || typeof offer !== "object") return null;
    const offerNo = offer.offer_no ?? offer.offerNo ?? offer.offerNumber ?? offer.offerId ?? null;
    const type = offer.type ?? offer.offer_type ?? offer.offerType ?? offer.offer ?? null;
    const title = offer.title ?? offer.titleEn ?? offer.name ?? "";
    const titleAr = offer.title_ar ?? offer.titleAr ?? offer.nameAr ?? "";
    const description = offer.description ?? offer.descriptionEn ?? "";
    const descriptionAr = offer.description_ar ?? offer.descriptionAr ?? "";
    return {
      offer_no: offerNo ? String(offerNo) : null,
      type,
      title,
      title_ar: titleAr,
      name: title,
      nameAr: titleAr,
      description,
      description_ar: descriptionAr,
      descriptionAr,
      discount: resolveOfferDiscountValue(offer),
      discount_type: resolveOfferDiscountType(offer) === "percentage" ? "p" : "v",
    };
  };

  const buildAppliedOffersSnapshot = () => {
    const offersMap = new Map<string, any>();

    cartItems.forEach((item) => {
      const offers = (item as any).appliedOffers ?? [];
      offers.forEach((raw: any) => {
        const normalized = normalizeOfferForOrder(raw);
        if (!normalized || !normalized.type) return;
        const key = `${normalized.type}:${normalized.offer_no ?? normalized.title ?? ""}`;
        const existing = offersMap.get(key) || { ...normalized, discountAmount: 0 };

        const basePrice =
          typeof (item as any).basePrice === "number"
            ? (item as any).basePrice
            : item.oldPrice
            ? parsePrice(item.oldPrice)
            : parsePrice(item.price);

        if (normalized.type === "direct_discount") {
          if (normalized.discount_type === "percentage" || normalized.discount_type === "p") {
            existing.discountAmount += (basePrice * Number(normalized.discount || 0) / 100) * item.quantity;
          } else {
            existing.discountAmount += Number(normalized.discount || 0) * item.quantity;
          }
        }

        if (normalized.type === "bundle_discount" && item.isBundleItem && item.oldPrice) {
          const bundleSavings = Math.max(0, parsePrice(item.oldPrice) - parsePrice(item.price));
          existing.discountAmount += bundleSavings * item.quantity;
        }

        if (normalized.type === "free_product" && item.isFreeGift) {
          const giftValue = item.oldPrice ? parsePrice(item.oldPrice) : parsePrice(item.price);
          existing.discountAmount += giftValue * item.quantity;
        }

        offersMap.set(key, existing);
      });
    });

    // Apply coupon discount total once (if any)
    if (couponDiscount > 0) {
      const couponOffer = Array.from(offersMap.values()).find((o) => o.type === "coupon");
      if (couponOffer) {
        couponOffer.discountAmount = couponDiscount;
      }
    }

    return Array.from(offersMap.values());
  };

  const buildOrderPayload = () => {
    const sessionRaw = localStorage.getItem("session");
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const user = session?.user;
    const items = cartItems.map((item) => {
      const appliedOffers = ((item as any).appliedOffers ?? [])
        .map((offer: any) => normalizeOfferForOrder(offer))
        .filter(Boolean);

      return {
        id: String(item.id),
        productId: item.productId ?? null,
        stk_code: (item as any).stkCode ?? (item as any).stk_code ?? null,
        name: item.name,
        nameAr: (item as any).nameAr ?? "",
        image: item.image ?? "",
        quantity: item.quantity,
        price: parsePrice(item.price),
        basePrice:
          typeof (item as any).basePrice === "number"
            ? (item as any).basePrice
            : item.oldPrice
            ? parsePrice(item.oldPrice)
            : parsePrice(item.price),
        variant: item.variant ?? null,
        variantColor: item.variantColor ?? null,
        variantSku: (item as any).variantSku ?? null,
        chargeOptionSku: (item as any).chargeOptionSku ?? null,
        chargeOption: item.chargeOption ?? null,
        isFreeGift: Boolean(item.isFreeGift),
        isBundleItem: Boolean(item.isBundleItem),
        linkedToProductId: item.linkedToProductId ?? null,
        bundleDiscount: item.bundleDiscount ?? null,
        bundleDiscountType: item.bundleDiscountType ?? null,
        appliedOffers,
      };
    });

    const appliedOffersSnapshot = buildAppliedOffersSnapshot();

    const notificationToken = localStorage.getItem("fcmToken");

    return {
      userId: user?.id || user?._id || user?.userId || null,
      customerSnapshot: {
        fullName: formData.fullName,
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone,
        email: formData.email,
      },
      fulfillment: {
        type: fulfillmentType,
        preferredDate: formData.preferredDate || null,
        preferredTime: formData.preferredTime || null,
        deliveryInstructions: formData.deliveryInstructions || "",
        showroom:
          fulfillmentType === "pickup"
            ? {
                ...selectedShowroom,
                loc_code: selectedShowroom?.loc_code ?? selectedShowroom?.id ?? null,
              }
            : null,
        location: fulfillmentType === "delivery" ? locationData : null,
      },
      addresses: {
        delivery:
          fulfillmentType === "delivery"
            ? {
                area: formData.area,
                street: formData.street,
                building: formData.building,
                addressNotes: formData.addressNotes,
                formattedAddress: locationData?.formattedAddress ?? "",
                city: locationData?.city ?? "",
                country: locationData?.country ?? "",
              }
            : null,
      },
      items,
      pricing: {
        subtotal,
        shipping: deliveryFee,
        tax: 0,
        discount: totalSavings,
        total,
      },
      appliedOffersSnapshot,
      payment: {
        method: "cash",
        status: "pending",
      },
      status: "pending",
      locale: language,
      notificationToken: notificationToken || null,
    };
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fulfillmentType) {
      newErrors.fulfillmentType = asText(t.selectFulfillment);
      setErrors(newErrors);
      return false;
    }

    if (fulfillmentType === "delivery") {
      if (!formData.fullName.trim()) newErrors.fullName = asText(t.required);
      if (!formData.phone.trim()) newErrors.phone = asText(t.required);
      if (!locationData) newErrors.location = asText(t.selectLocation);
      if (!formData.area.trim()) newErrors.area = asText(t.required);
      if (!formData.street.trim()) newErrors.street = asText(t.required);
      if (!formData.building.trim()) newErrors.building = asText(t.required);
    }

    if (fulfillmentType === "pickup") {
      if (!formData.fullName.trim()) newErrors.fullName = asText(t.required);
      if (!formData.phone.trim()) newErrors.phone = asText(t.required);
      if (!selectedShowroom) {
        newErrors.showroom = asText(t.selectShowroom);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setOrderSubmitting(true);
    setOrderSubmitError(null);
    const orderPayload = buildOrderPayload();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const message =
          (await res.json().catch(() => null))?.message ||
          (language === "ar" ? "تعذر حفظ الطلب." : "Failed to save order.");
        throw new Error(message);
      }

      const json = await res.json().catch(() => null);
      const savedOrder = json?.data ?? orderPayload;

      const token = localStorage.getItem("fcmToken");
      if (token) {
        const normalizePhone = (rawPhone: string) => {
          let digits = String(rawPhone || "").replace(/[^0-9]/g, "");
          if (digits.startsWith("00963")) digits = `0${digits.slice(4)}`;
          else if (digits.startsWith("963")) digits = `0${digits.slice(3)}`;
          else if (digits.startsWith("9") && digits.length === 9) digits = `0${digits}`;
          return digits;
        };
        fetch("/api/notifications/device-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            phone: normalizePhone(formData.phone),
            locale: language,
            platform: "web",
            preferences: {
              allowOrderUpdates: true,
            },
          }),
        }).catch(() => null);
      }

      clearCart();
      const orderMessage =
        language === "ar"
          ? "سيتم التعامل مع طلبك بكل عناية، وسيتواصل معك الفريق المسؤول قريباً."
          : "Your order will be managed with care, and the responsible team will contact you soon.";
      navigate("/", { state: { confirmedOrder: savedOrder, orderMessage } });
    } catch (err: any) {
      setOrderSubmitError(
        err?.message ||
          (language === "ar" ? "تعذر حفظ الطلب." : "Failed to save order.")
      );
    } finally {
      setOrderSubmitting(false);
    }
  };


  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="fixed inset-0 z-[110] bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
              >
                <ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
              </button>
              <h1 className="text-2xl font-bold">{t.checkout}</h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Fulfillment Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#009FE3]" />
                {t.fulfillmentType}
                <span className="text-red-500 text-sm">*</span>
              </h2>

              {errors.fulfillmentType && (
                <div className="error-message bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                  {errors.fulfillmentType}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home Delivery Option */}
                <button
                  onClick={() => setFulfillmentType("delivery")}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    fulfillmentType === "delivery"
                      ? "border-[#009FE3] bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-[#009FE3]/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        fulfillmentType === "delivery"
                          ? "bg-[#009FE3] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Home className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {t.homeDelivery}
                      </h3>
                      {fulfillmentType === "delivery" && (
                        <CheckCircle className="w-5 h-5 text-[#009FE3] mx-auto mt-2" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Pickup Option */}
                <button
                  onClick={() => setFulfillmentType("pickup")}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    fulfillmentType === "pickup"
                      ? "border-[#009FE3] bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-[#009FE3]/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        fulfillmentType === "pickup"
                          ? "bg-[#009FE3] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Store className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {t.pickupFromShowroom}
                      </h3>
                      {fulfillmentType === "pickup" && (
                        <CheckCircle className="w-5 h-5 text-[#009FE3] mx-auto mt-2" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Delivery Form (Conditional) */}
            {fulfillmentType === "delivery" && (
              <div className="space-y-6 animate-fadeInUp">
                {/* Customer Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Phone className="w-6 h-6 text-[#009FE3]" />
                    {t.customerInfo}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.fullName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={asText(t.enterFullName)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.fullName ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.fullName && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Mobile Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.mobilePhone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={asText(t.enterPhone)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.phone ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.phone && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Secondary Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.secondaryPhone}
                      </label>
                      <input
                        type="tel"
                        value={formData.secondaryPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Maps Location Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#009FE3]" />
                    {t.selectLocation}
                    <span className="text-red-500 text-sm">*</span>
                  </h2>

                  {errors.location && (
                    <div className="error-message bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                      {errors.location}
                    </div>
                  )}

                  {/* Current Location Button */}
                  <button
                    onClick={handleUseCurrentLocation}
                    className="mb-4 w-full md:w-auto bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Locate className="w-5 h-5" />
                    {t.currentLocation}
                  </button>

                  {/* Map Container */}
                  <div className="relative mb-4">
                    <div
                      id="map"
                      className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-gray-200"
                    ></div>
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      {isArabic ? "اسحب العلامة لتحديد موقعك" : "Drag the marker to set your location"}
                    </div>
                  </div>

                  {/* Detected Location Display */}
                  {locationData && (
                    <div className="bg-blue-50 border-2 border-[#009FE3]/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#009FE3] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">{t.locationSelected}</h3>
                          <p className="text-sm text-gray-700">{locationData.formattedAddress}</p>
                          {locationData.city && (
                            <p className="text-sm text-gray-600 mt-1">
                              {isArabic ? "المدينة:" : "City:"} {locationData.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Area */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.area} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder={asText(locationData?.area ?? t.enterArea)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.area ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.area && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.area}</p>
                      )}
                    </div>

                    {/* Street */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.street} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder={asText(t.enterStreet)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.street ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.street && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.street}</p>
                      )}
                    </div>

                    {/* Building */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.building} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.building}
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        placeholder={asText(t.enterBuilding)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.building ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.building && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.building}</p>
                      )}
                    </div>

                    {/* Address Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.addressNotes}
                      </label>
                      <textarea
                        value={formData.addressNotes}
                        onChange={(e) =>
                          setFormData({ ...formData, addressNotes: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#009FE3]" />
                    {t.deliveryDetails}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.preferredDate}
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredDate: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.preferredTime}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["morning", "afternoon", "evening"].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, preferredTime: time })}
                            className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              formData.preferredTime === time
                                ? "border-[#009FE3] bg-blue-50 text-[#009FE3]"
                                : "border-gray-200 hover:border-[#009FE3]/50"
                            }`}
                          >
                            {t[time as keyof typeof t]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Instructions */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.deliveryInstructions}
                      </label>
                      <textarea
                        value={formData.deliveryInstructions}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryInstructions: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Showroom Selection (Conditional) */}
            {fulfillmentType === "pickup" && (
              <div className="space-y-6 animate-fadeInUp">
                {/* Customer Info for Pickup */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Phone className="w-6 h-6 text-[#009FE3]" />
                    {t.customerInfo}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.fullName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={asText(t.enterFullName)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.fullName ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.fullName && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.mobilePhone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={asText(t.enterPhone)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.phone ? "border-red-500" : "border-gray-200"
                        } focus:border-[#009FE3] focus:outline-none transition-all`}
                      />
                      {errors.phone && (
                        <p className="error-message text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Secondary Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.secondaryPhone}
                      </label>
                      <input
                        type="tel"
                        value={formData.secondaryPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Showroom Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Store className="w-6 h-6 text-[#009FE3]" />
                    {t.showroomSelection}
                    <span className="text-red-500 text-sm">*</span>
                  </h2>

                  {errors.showroom && (
                    <div className="error-message bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                      {errors.showroom}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={showroomSearch}
                      onChange={(e) => setShowroomSearch(e.target.value)}
                      placeholder={asText(t.searchShowroom)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#009FE3] focus:outline-none transition-all"
                    />
                  </div>

                  {showroomsLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                          key={`showroom-skeleton-${idx}`}
                          className="rounded-xl border-2 border-gray-100 bg-white p-4"
                        >
                          <div className="h-4 w-2/3 skeleton-line shimmer-surface mb-3" />
                          <div className="h-3 w-full skeleton-line shimmer-surface mb-2" />
                          <div className="h-3 w-5/6 skeleton-line shimmer-surface mb-2" />
                          <div className="h-3 w-1/2 skeleton-line shimmer-surface" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!showroomsLoading && showroomsError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                      {showroomsError}
                    </div>
                  )}

                  {!showroomsLoading && !showroomsError && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">
                          {language === "ar" ? "اختر المعرض" : "Select a showroom"}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (showroomSliderRef.current) {
                                showroomSliderRef.current.scrollBy({ top: -240, behavior: "smooth" });
                              }
                            }}
                            className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-[#009FE3] hover:border-[#009FE3] transition-colors"
                            aria-label="Scroll up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (showroomSliderRef.current) {
                                showroomSliderRef.current.scrollBy({ top: 240, behavior: "smooth" });
                              }
                            }}
                            className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-[#009FE3] hover:border-[#009FE3] transition-colors"
                            aria-label="Scroll down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>

                      <div className="overflow-hidden" style={{ height: "420px" }}>
                        <div
                          ref={showroomSliderRef}
                          className="space-y-3 overflow-y-auto pr-1 scrollbar-hide snap-y snap-mandatory"
                          style={{ height: "100%" }}
                        >
                        {filteredShowrooms.map((showroom) => (
                          <button
                            key={showroom.id}
                            onClick={() => setSelectedShowroom(showroom)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 snap-start overflow-hidden ${
                              selectedShowroom?.id === showroom.id
                                ? "border-[#009FE3] bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-[#009FE3]/50 hover:bg-gray-50"
                            }`}
                            style={{ height: "130px", direction: isArabic ? "rtl" : "ltr", textAlign: isArabic ? "right" : "left" }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{showroom.name}</h3>
                                <p className="text-xs text-gray-500 mb-2 truncate">{showroom.city}</p>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{showroom.address}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="truncate">{showroom.phone}</span>
                                  </p>
                                </div>
                              </div>
                              {selectedShowroom?.id === showroom.id && (
                                <CheckCircle className="w-6 h-6 text-[#009FE3] flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedShowroom && (
                    <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t.pickupReady}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method */}
            {fulfillmentType && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 animate-fadeInUp">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Banknote className="w-6 h-6 text-[#009FE3]" />
                  {t.paymentMethod}
                </h2>

                <div className="p-4 rounded-xl border-2 border-[#009FE3] bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-6 h-6 text-[#009FE3] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {fulfillmentType === "delivery" ? t.cashOnDelivery : t.cashOnPickup}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {fulfillmentType === "delivery" ? t.codDescription : t.copDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AppliedOffersSection
              cartItems={cartItems}
              language={language}
              currencyLabel={asText(t.currency)}
              onApplyCoupon={handleApplyCoupon}
              onAddFreeProduct={handleAddFreeProduct}
              onAddBundleProduct={handleAddBundleProduct}
              appliedCoupons={appliedCoupons}
              freeProductsAdded={freeProductsAdded}
              bundleProductsAdded={bundleProductsAdded}
            />
          </div>

          {/* Order Summary - Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t.orderSummary}</h2>

              {/* Products List */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          {isArabic ? "إزالة" : "Remove"}
                        </button>
                      </div>

                      {item.isFreeGift && (
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold mb-1">
                          <Gift className="w-3 h-3" />
                          {isArabic ? "هدية مجانية" : "Free Gift"}
                        </div>
                      )}
                      {item.isBundleItem && item.bundleDiscount && (
                        <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold mb-1">
                          <Sparkles className="w-3 h-3" />
                          {formatOfferDiscountLabel(
                            { type: "bundle_discount", discountValue: item.bundleDiscount, discountType: item.bundleDiscountType ?? "percentage" },
                            language,
                            t.currency,
                            isArabic ? "خصم" : "Off",
                          )}
                        </div>
                      )}
                      {item.isCouponItem && (
                        <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold mb-1">
                          <Gift className="w-3 h-3" />
                          {isArabic ? "قسيمة" : "Coupon"}
                        </div>
                      )}

                      {/* Variant / Color info */}
                      {item.variant && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          {item.variantColor && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.variantColor }}
                            />
                          )}
                          <span>
                            {isArabic ? "اللون:" : "Color:"} {item.variant}
                          </span>
                        </div>
                      )}

                      {/* Charge option info */}
                      {item.chargeOption && (
                        <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                          <span className="font-medium">{item.chargeOption.value}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">{t.quantity}</span>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-sm font-semibold rounded-md">{item.quantity}</span>
                        <span className="text-xs text-gray-500">
                          {item.quantity > 1 ? `${item.quantity} ${asText(t.items)}` : asText(t.item)}
                        </span>
                      </div>
                      {item.isFreeGift ? (
                        <div>
                          {item.oldPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(parsePrice(item.oldPrice) * item.quantity)} {t.currency}
                            </p>
                          )}
                          <p className="text-sm font-bold text-green-600">{t.free}</p>
                        </div>
                      ) : item.oldPrice ? (
                        (() => {
                          const itemPrice = parsePrice(item.price);
                          const oldPrice = parsePrice(item.oldPrice);
                          const discountBadge = getItemDiscountBadge(item);
                          return (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(oldPrice)} {t.currency}
                                </span>
                                {discountBadge && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                    {discountBadge}
                                  </span>
                                )}
                               
                              </div>
                              <p className="text-sm font-bold text-[#009FE3]">
                                {formatPrice(itemPrice * item.quantity)} {t.currency}
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-sm font-bold text-[#009FE3]">
                          {formatPrice(parsePrice(item.price) * item.quantity)} {t.currency}
                        </p>
                      )}

                      {(() => {
                        const productId = Number(item.productId ?? item.id);
                        if (!productId) return null;
                        const hasOffers =
                          ((item as any).appliedOffers?.length ?? 0) > 0 ||
                          getProductOffers(productId).length > 0;
                        if (!hasOffers) return null;
                        return (
                          <div className="mt-2">
                            <CartOfferDisplay
                              productId={productId}
                              quantity={item.quantity}
                              language={language}
                              currencyLabel={asText(t.currency)}
                              onAddBundleItem={handleAddBundleProduct}
                              offers={(item as any).appliedOffers || undefined}
                              basePrice={(item as any).basePrice ?? undefined}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {totalSavings > 0 && (
                <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg animate-fadeInUp">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                        {isArabic ? "إجمالي التوفير" : "Total Savings"}
                      </p>
                      <p className="text-xl font-bold text-white">
                        {formatPrice(totalSavings)} {t.currency}
                      </p>
                    </div>
                    <Gift className="w-8 h-8 text-white/30" />
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">{formatPrice(subtotal)} {t.currency}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t.deliveryFee}</span>
                  <span className="font-semibold">
                    {fulfillmentType === "delivery"
                      ? t.free
                      : fulfillmentType === "pickup"
                      ? t.free
                      : t.tbd}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">{t.total}</span>
                    <span className="text-2xl font-bold text-[#009FE3]">
                      {formatPrice(total)} {t.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              {orderSubmitError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                  {orderSubmitError}
                </div>
              )}
              <button
                onClick={handleConfirm}
                disabled={orderSubmitting}
                className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-6 h-6" />
                {orderSubmitting
                  ? language === "ar"
                    ? "جاري التأكيد..."
                    : "Confirming..."
                  : t.confirmOrder}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                {t.backToCart}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

