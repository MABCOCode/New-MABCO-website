import { useState, useEffect, useRef } from "react";
// Allow using google maps JS types at runtime without requiring TS types
declare const google: any;
declare global {
  interface Window {
    google?: any;
  }
}
import {
  X,
  Home,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  Search,
  CheckCircle,
  ArrowLeft,
  Package,
  CreditCard,
  Banknote,
  Navigation,
  Locate,
} from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import translations from "../../../i18n/translations";

interface CartItem {
  id: number | string;
  name: string;
  price: string | undefined;
  oldPrice?: string;
  image?: string;
  quantity: number;
  variant?: string;
  variantColor?: string;
  chargeOption?: { optionId: string; value: string } | null;
}

interface Showroom {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
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


const showrooms: Showroom[] = [
  {
    id: 1,
    name: "MABCO Damascus - Main Branch",
    city: "Damascus",
    address: "Damascus, Mazzeh Highway, near Al-Jalaa Stadium",
    phone: "+963 11 9909",
    hours: "9:00 AM - 8:00 PM",
  },
  {
    id: 2,
    name: "MABCO Aleppo",
    city: "Aleppo",
    address: "Aleppo, Al-Furqan Street",
    phone: "+963 21 5555",
    hours: "9:00 AM - 7:00 PM",
  },
  {
    id: 3,
    name: "MABCO Homs",
    city: "Homs",
    address: "Homs, Al-Quwatli Street",
    phone: "+963 31 4444",
    hours: "9:00 AM - 7:00 PM",
  },
];

// Default center for Syria (Damascus)
const DEFAULT_CENTER = { lat: 33.5138, lng: 36.2765 };

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";

export function CheckoutPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);

  // Load Google Maps
  useEffect(() => {
    if (fulfillmentType === "delivery" && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, [fulfillmentType]);

  // Initialize Map
  useEffect(() => {
    if (mapLoaded && mapRef.current && fulfillmentType === "delivery" && !googleMapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const marker = new google.maps.Marker({
        position: DEFAULT_CENTER,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      // Update location when marker is dragged
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          updateLocationFromLatLng(position.lat(), position.lng());
        }
      });

      googleMapRef.current = map;
      markerRef.current = marker;

      // Set initial location
      updateLocationFromLatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
    }
  }, [mapLoaded, fulfillmentType]);

  const updateLocationFromLatLng = (lat: number, lng: number) => {
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

        setLocationData({
          lat,
          lng,
          formattedAddress: results[0].formatted_address,
          city: city || "",
          area: area || "",
          country: country || "",
        });
      }
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (googleMapRef.current && markerRef.current) {
            const newPosition = { lat, lng };
            googleMapRef.current.setCenter(newPosition);
            markerRef.current.setPosition(newPosition);
            updateLocationFromLatLng(lat, lng);
          }
        },
        (error) => {
          alert(isArabic ? "لا يمكن الوصول إلى موقعك الحالي" : "Cannot access your current location");
        }
      );
    }
  };

  // Calculate prices
  const parsePrice = (price: string | undefined) => {
    if (!price || typeof price !== 'string') return 0;
    return parseInt(price.replace(/,/g, "")) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  // original subtotal before discounts (uses oldPrice when available)
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const unit = item.oldPrice ? parsePrice(item.oldPrice) : parsePrice(item.price);
    return sum + unit * item.quantity;
  }, 0);
  const totalSavings = Math.max(0, originalSubtotal - subtotal);
  
  let deliveryFee = 0;
  if (fulfillmentType === "delivery" && locationData) {
    // Calculate delivery fee based on distance (mock calculation)
    deliveryFee = 50000; // Base fee in IQD
  }
  
  const total = subtotal + deliveryFee;
  const formatPrice = (price: number) => price.toLocaleString();

  // Filter showrooms
  const filteredShowrooms = showrooms.filter((showroom) =>
    showroom.name.toLowerCase().includes(showroomSearch.toLowerCase()) ||
    showroom.city.toLowerCase().includes(showroomSearch.toLowerCase())
  );

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
      if (!locationData) newErrors.location = asText(t.required);
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

  const handleConfirm = () => {
    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const orderData = {
      items: cartItems,
      fulfillmentType,
      ...(fulfillmentType === "delivery" ? { 
        delivery: { 
          ...formData, 
          location: locationData 
        }, 
        deliveryFee 
      } : {}),
      ...(fulfillmentType === "pickup" ? { showroom: selectedShowroom } : {}),
      subtotal,
      total,
      timestamp: new Date().toISOString(),
    };
    // Clear cart and navigate to a simple confirmation route (or home)
    clearCart();
    navigate("/", { state: { confirmedOrder: orderData } });
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
                      ref={mapRef}
                      className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-gray-200"
                    >
                      {!mapLoaded && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-[#009FE3] border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">{t.loadingMap}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      {t.dragMarker}
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

                  {/* Showroom List */}
                  <div className="space-y-3">
                    {filteredShowrooms.map((showroom) => (
                      <button
                        key={showroom.id}
                        onClick={() => setSelectedShowroom(showroom)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedShowroom?.id === showroom.id
                            ? "border-[#009FE3] bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-[#009FE3]/50 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{showroom.name}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {showroom.address}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {showroom.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {showroom.hours}
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
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.name}
                      </h4>

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
                      {item.oldPrice ? (
                        (() => {
                          const itemPrice = parsePrice(item.price);
                          const oldPrice = parsePrice(item.oldPrice);
                          const saved = Math.max(0, oldPrice - itemPrice);
                          const percent = oldPrice > 0 ? Math.round((saved / oldPrice) * 100) : 0;
                          return (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(oldPrice)} {t.currency}
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                  {isArabic ? `${percent}% خصم` : `${percent}% OFF`}
                                </span>
                                <span className="text-xs text-gray-600 ml-2">
                                  {isArabic ? `وفّر ${formatPrice(saved)} ${t.currency}` : `Save ${formatPrice(saved)} ${t.currency}`}
                                </span>
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span className="line-through">{isArabic ? "المجموع قبل الخصم" : "Original Subtotal"}</span>
                    <span className="line-through">{formatPrice(originalSubtotal)} {t.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">{formatPrice(subtotal)} {t.currency}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span className="font-medium">{isArabic ? "الخصم" : "Discount"}</span>
                    <span className="font-semibold">- {formatPrice(totalSavings)} {t.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>{t.deliveryFee}</span>
                  <span className="font-semibold">
                    {fulfillmentType === "delivery" && deliveryFee > 0
                      ? `${formatPrice(deliveryFee)} ${t.currency}`
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
              <button
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                {t.confirmOrder}
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
