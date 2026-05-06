import { Calendar, ChevronRight, Clock, Home, Locate, MapPin, Phone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import translations from "../../../i18n/translations";
import { setSeo } from '../../../services/seo';

interface Showroom {
  Loc_code: string;
  City_name: string;
  Loc_name: string;
  Phone: string;
  Address: string;
  Winter_from_date: string;
  Winter_to_date: string;
  warranty_type?: string;

  Longitude: string;
  Latitude: string;
  Image_Link: string;
  week_end: string;
  isActive?: boolean;
}

interface ShowroomRaw {
  Loc_code: string;
  City_name: string;
  City_name_ar: string;
  Loc_name: string;
  Loc_name_ar: string;
  Phone: string;
  Address: string;
  Address_ar: string;
  Winter_from_date: string;
  Winter_from_date_ar: string;
  Winter_to_date: string;
  Winter_to_date_ar: string;
  warranty_type?: string;
  Longitude: string;
  Latitude: string;
  Image_Link: string;
  week_end: string;
  week_end_ar: string;
  isActive?: boolean;
}

interface ShowroomsPageProps {
  // kept for compatibility if needed elsewhere
  language?: "ar" | "en";
  onBack?: () => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

// Showrooms are now served from a static JSON file under /static/showrooms.json

import { useLanguage } from '../../../context/LanguageContext';

interface ShowroomWithDistance extends Showroom {
  distanceKm: number | null;
}

let cachedOrderedShowrooms: { showrooms: ShowroomWithDistance[]; position: Coordinates; timestamp: number } | null = null;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const getCachedPosition = (): { position: Coordinates; timestamp: number } | null => {
  try {
    const stored = localStorage.getItem('mabco_user_location');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.position && parsed.timestamp) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

const setCachedPosition = (position: Coordinates) => {
  try {
    localStorage.setItem('mabco_user_location', JSON.stringify({ position, timestamp: Date.now() }));
  } catch {
    // ignore
  }
};

export function ShowroomsPage(_: ShowroomsPageProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<{ lat: string; lng: string; name: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [showroomsData, setShowroomsData] = useState<ShowroomRaw[]>([]);
  const [currentUserPosition, setCurrentUserPosition] = useState<Coordinates | null>(() => {
    const cached = getCachedPosition();
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return cached.position;
    }
    return null;
  });
  const [nearestShowroomCode, setNearestShowroomCode] = useState<string | null>(null);
  const [nearestLoading, setNearestLoading] = useState(false);
  const [nearestError, setNearestError] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    const title =
      language === 'ar'
        ? 'صالات عرض مابكو | مابكو'
        : 'MABCO Showrooms | MABCO';
    const description =
      language === 'ar'
        ? 'استعرض صالات عرض مابكو في مدن سوريا واختر الموقع الأقرب لك.'
        : 'Explore MABCO showrooms across Syrian cities and find the nearest location.';

    setSeo({
      title,
      description,
      url: window.location.href,
      image: 'https://mabcoonline.com/images/giphy.gif',
    });
  }, [language]);

  useEffect(() => {
    if (selectedMap) {
      const title =
        language === 'ar'
          ? `${selectedMap.name} | صالة عرض مابكو`
          : `${selectedMap.name} | MABCO Showroom`;
      const description =
        language === 'ar'
          ? `تعرف على موقع ${selectedMap.name} في صالات عرض مابكو، مع إحداثيات جوجل ماب.`
          : `Learn about ${selectedMap.name} in MABCO showrooms with location details.`;

      setSeo({
        title,
        description,
        url: window.location.href,
        image: 'https://mabcoonline.com/images/giphy.gif',
      });
    }
  }, [selectedMap, language]);

  useEffect(() => {
    if (selectedImage) {
      const title =
        language === 'ar'
          ? `${selectedImage.name} - صورة الصالة`
          : `${selectedImage.name} - Showroom Image`;
      const description =
        language === 'ar'
          ? `عرض صورة ${selectedImage.name} في صالات عرض مابكو.`
          : `Viewing image of ${selectedImage.name} in MABCO showrooms.`;

      setSeo({
        title,
        description,
        url: window.location.href,
        image: selectedImage.url || 'https://mabcoonline.com/images/giphy.gif',
      });
    }
  }, [selectedImage, language]);

  // Load showrooms from API (with fallback to static JSON) - optimized for speed
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const normalizeFromDb = (item: any): ShowroomRaw => {
      const loc = item.location || {};
      const isGeoPoint = loc.type === 'Point' && Array.isArray(loc.coordinates);
      return {
        Loc_code: String(item.Loc_code || item.code || ''),
        City_name: String(item.City_name || item.city?.en || ''),
        City_name_ar: String(item.City_name_ar || item.city?.ar || item.City_name || ''),
        Loc_name: String(item.Loc_name || item.name?.en || ''),
        Loc_name_ar: String(item.Loc_name_ar || item.name?.ar || item.Loc_name || ''),
        Phone: String(item.Phone || item.phone || ''),
        Address: String(item.Address || item.address?.en || item.address || ''),
        Address_ar: String(item.Address_ar || item.address?.ar || item.Address || ''),
        Winter_from_date: String(item.Winter_from_date || item.hours?.from?.en || item.hours?.from || ''),
        Winter_from_date_ar: String(item.Winter_from_date_ar || item.hours?.from?.ar || item.Winter_from_date || ''),
        Winter_to_date: String(item.Winter_to_date || item.hours?.to?.en || item.hours?.to || ''),
        Winter_to_date_ar: String(item.Winter_to_date_ar || item.hours?.to?.ar || item.Winter_to_date || ''),
        warranty_type: String(item.warranty_type || ''),
        Longitude: isGeoPoint ? String(loc.coordinates[0] || '') : String(item.Longitude || loc.longitude || ''),
        Latitude: isGeoPoint ? String(loc.coordinates[1] || '') : String(item.Latitude || loc.latitude || ''),
        Image_Link: String(item.Image_Link || item.image_link || ''),
        week_end: String(item.week_end || item.week_end?.en || ''),
        week_end_ar: String(item.week_end_ar || item.week_end?.ar || item.week_end || ''),
        isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
      };
    };

    const resolveList = (data: any, lang: "ar" | "en") => {
      if (Array.isArray(data)) {
        const directList = data.find((item) => item && Array.isArray(item?.[lang]));
        if (directList) return directList[lang];
        if (data.length > 0 && Array.isArray(data[0]?.[lang])) return data[0][lang];
        return [];
      }
      if (data && Array.isArray(data[lang])) return data[lang];
      return [];
    };

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

    (async () => {
      try {
        // Try API first with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
          const res = await fetch(`${apiBase}/showrooms`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error('API failed');
          const json = await res.json();
          const data = json?.data || json;
          if (Array.isArray(data)) {
            const isNested = data.length > 0 && data.some((item: any) => item?.ar && Array.isArray(item.ar));
            if (isNested) {
              const rawList = resolveList(data, language) as any[];
              setShowroomsData(rawList.map((item: any) => ({
                ...item,
                City_name_ar: item.City_name,
                Loc_name_ar: item.Loc_name,
                Address_ar: item.Address,
                Winter_from_date_ar: item.Winter_from_date,
                Winter_to_date_ar: item.Winter_to_date,
                week_end_ar: item.week_end,
                isActive: true,
              })));
            } else {
              setShowroomsData(data.map(normalizeFromDb).filter((s: ShowroomRaw) => s.isActive !== false));
            }
          }
        } catch {
          clearTimeout(timeoutId);
          // API failed, load from static JSON
          const res = await fetch('/static/showrooms.json');
          if (!res.ok) return;
          const json = await res.json();
          const data = json?.data || json;
          if (Array.isArray(data)) {
            const isNested = data.length > 0 && data.some((item: any) => item?.ar && Array.isArray(item.ar));
            if (isNested) {
              const rawList = resolveList(data, language) as any[];
              setShowroomsData(rawList.map((item: any) => ({
                ...item,
                City_name_ar: item.City_name,
                Loc_name_ar: item.Loc_name,
                Address_ar: item.Address,
                Winter_from_date_ar: item.Winter_from_date,
                Winter_to_date_ar: item.Winter_to_date,
                week_end_ar: item.week_end,
                isActive: true,
              })));
            } else {
              setShowroomsData(data.map(normalizeFromDb).filter((s: ShowroomRaw) => s.isActive !== false));
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load showrooms', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [language]);

  const openMapDialog = (lat: string, lng: string, name: string) => {
    setSelectedMap({ lat, lng, name });
  };

  const openImageDialog = (url: string, name: string) => {
    setSelectedImage({ url, name });
  };

  const toRadians = (value: number) => (value * Math.PI) / 180;

  const calculateDistanceKm = (from: Coordinates, to: Coordinates) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(to.lat - from.lat);
    const dLng = toRadians(to.lng - from.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(from.lat)) *
        Math.cos(toRadians(to.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const showroomsWithDistance = useMemo(() => {
    const position = currentUserPosition || getCachedPosition()?.position;
    if (position) {
      if (cachedOrderedShowrooms && cachedOrderedShowrooms.position.lat === position.lat && cachedOrderedShowrooms.position.lng === position.lng) {
        const age = Date.now() - cachedOrderedShowrooms.timestamp;
        if (age < CACHE_DURATION_MS) {
          return cachedOrderedShowrooms.showrooms;
        }
      }

      const withDistance = showroomsData.map((showroom) => {
        const latitude = Number(showroom.Latitude);
        const longitude = Number(showroom.Longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return { ...showroom, distanceKm: null as number | null };
        }
        return {
          ...showroom,
          distanceKm: calculateDistanceKm(position, { lat: latitude, lng: longitude }),
        };
      });

      cachedOrderedShowrooms = {
        showrooms: withDistance,
        position,
        timestamp: Date.now(),
      };

      return withDistance;
    }

    return showroomsData.map((showroom) => ({ ...showroom, distanceKm: null as number | null }));
  }, [currentUserPosition, showroomsData]);

  const showroomsByCity = showroomsWithDistance.reduce((acc, showroom) => {
    const cityKey = isRTL ? showroom.City_name_ar : showroom.City_name;
    if (!acc[cityKey]) {
      acc[cityKey] = [];
    }
    acc[cityKey].push(showroom);
    return acc;
  }, {} as Record<string, ShowroomWithDistance[]>);

  const sortedCities = Object.keys(showroomsByCity).sort((a, b) => {
    const aNearest = showroomsByCity[a].find((s) => typeof s.distanceKm === 'number');
    const bNearest = showroomsByCity[b].find((s) => typeof s.distanceKm === 'number');
    const aDist = aNearest?.distanceKm ?? Number.MAX_SAFE_INTEGER;
    const bDist = bNearest?.distanceKm ?? Number.MAX_SAFE_INTEGER;
    return aDist - bDist;
  });

  const nearestShowroom = showroomsWithDistance
    .filter((showroom) => typeof showroom.distanceKm === "number")
    .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER))[0];

  const handleFindNearestShowroom = () => {
    if (!navigator.geolocation) {
      setNearestError(
        language === "ar"
          ? "المتصفح لا يدعم تحديد الموقع الجغرافي."
          : "Your browser does not support geolocation.",
      );
      return;
    }

    setNearestLoading(true);
    setNearestError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentUserPosition(pos);
        setCachedPosition(pos);
        setNearestLoading(false);
      },
      () => {
        setNearestLoading(false);
        setNearestError(
          language === "ar"
            ? "تعذر تحديد موقعك الحالي."
            : "Unable to determine your current location.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  useEffect(() => {
    if (nearestShowroom?.Loc_code) {
      setNearestShowroomCode(nearestShowroom.Loc_code);
    }
  }, [nearestShowroom?.Loc_code]);

  // Auto-request location on page load for closest ordering
  useEffect(() => {
    if (!navigator.geolocation || currentUserPosition) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentUserPosition(pos);
        setCachedPosition(pos);
      },
      () => {
        // User denied or unavailable - showrooms will display without distance sorting
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      },
    );
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-gray-50">
      {/* Breadcrumb - Sticky */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <button
                onClick={() => navigate(-1)}
                className="group cursor-pointer flex items-center gap-1 text-gray-600 hover:text-[#009FE3] transition-colors"
              >
                <Home className="w-4 h-4 group-hover:scale-105 transition-transform duration-200" />
                <span>{t.home}</span>
              </button>
              <ChevronRight className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-[#009FE3]">{t.showrooms}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Showrooms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 rounded-2xl border border-[#009FE3]/15 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === "ar" ? "البحث عن أقرب معرض" : "Find Nearest Showroom"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {language === "ar"
                  ? "استخدم موقعك الحالي لمعرفة أقرب صالة عرض."
                  : "Use your current location to find the closest showroom."}
              </p>
            </div>
            <button
              onClick={handleFindNearestShowroom}
              disabled={nearestLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009FE3] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0080b8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Locate className="h-5 w-5" />
              {nearestLoading
                ? language === "ar"
                  ? "جاري التحديد..."
                  : "Locating..."
                : language === "ar"
                ? "اختيار أقرب معرض"
                : "Choose Nearest Showroom"}
            </button>
          </div>
          {nearestError && (
            <p className="mt-3 text-sm font-medium text-red-600">{nearestError}</p>
          )}
          {nearestShowroom && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                    {language === "ar" ? "أقرب معرض" : "Nearest Showroom"}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">
                    {isRTL ? nearestShowroom.Loc_name_ar : nearestShowroom.Loc_name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {isRTL ? nearestShowroom.City_name_ar : nearestShowroom.City_name}
                    {typeof nearestShowroom.distanceKm === "number" &&
                      ` • ${nearestShowroom.distanceKm.toFixed(1)} ${
                        language === "ar" ? "كم" : "km"
                      }`}
                  </p>
                </div>
                <button
                  onClick={() =>
                    openMapDialog(
                      nearestShowroom.Latitude,
                      nearestShowroom.Longitude,
                      isRTL ? nearestShowroom.Loc_name_ar : nearestShowroom.Loc_name,
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#009FE3] px-4 py-2 font-semibold text-[#009FE3] transition-colors hover:bg-[#009FE3] hover:text-white"
                >
                  <MapPin className="h-4 w-4" />
                  {t.showrooms_view_on_map}
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="mb-16">
            <div className="h-9 w-56 skeleton-line shimmer-surface mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`showroom-skeleton-${idx}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 skeleton-card"
                >
                  <div className="h-48 shimmer-surface" />
                  <div className="p-5 space-y-4">
                    <div className="h-5 w-2/3 skeleton-line shimmer-surface" />
                    <div className="h-4 w-full skeleton-line shimmer-surface" />
                    <div className="h-4 w-5/6 skeleton-line shimmer-surface" />
                    <div className="h-10 w-full rounded-lg shimmer-surface mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && sortedCities.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {language === "ar" ? "لا توجد صالات عرض متاحة حالياً" : "No showrooms available right now"}
          </div>
        )}

        {!isLoading && sortedCities.map((city) => {
          const cityShowrooms = showroomsByCity[city]
            .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER));
          const city_ar = cityShowrooms[0]?.City_name_ar || city;
          return (
          <div key={city} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-[#009FE3]" />
              <h2 className="text-3xl text-gray-800">
                {isRTL ? city_ar : city}
                <span className={`text-lg text-gray-500 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  ({cityShowrooms.length} {t.showrooms_count_label})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityShowrooms.map((showroom) => {
                const locName = isRTL ? showroom.Loc_name_ar : showroom.Loc_name;
                const cityName = isRTL ? showroom.City_name_ar : showroom.City_name;
                const address = isRTL ? showroom.Address_ar : showroom.Address;
                const hoursFrom = isRTL ? showroom.Winter_from_date_ar : showroom.Winter_from_date;
                const hoursTo = isRTL ? showroom.Winter_to_date_ar : showroom.Winter_to_date;
                const weekEnd = isRTL ? showroom.week_end_ar : showroom.week_end;
                return (
                <div
                  key={showroom.Loc_code}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border ${
                    nearestShowroomCode === showroom.Loc_code
                      ? "border-[#009FE3] ring-2 ring-[#009FE3]/15"
                      : "border-gray-100"
                  }`}
                >
                  <div 
                    className="relative h-48 bg-gray-200 overflow-hidden cursor-pointer group"
                    onClick={() => openImageDialog(showroom.Image_Link, locName)}
                  >
                    <ImageWithFallback
                      src={`https://${showroom.Image_Link}`}
                      alt={locName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl text-white drop-shadow-lg inline-block bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">{locName}</h3>
                        {nearestShowroomCode === showroom.Loc_code && (
                          <span className="inline-flex items-center rounded-lg bg-[#009FE3] px-3 py-1 text-xs font-bold text-white">
                            {language === "ar" ? "الأقرب إليك" : "Nearest to You"}
                          </span>
                        )}
                        {typeof showroom.distanceKm === 'number' && nearestShowroomCode !== showroom.Loc_code && (
                          <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white">
                            {showroom.distanceKm.toFixed(1)} {language === "ar" ? "كم" : "km"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-[#009FE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t.showrooms_address}</p>
                        <p className="text-gray-800">{address}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t.showrooms_phone}</p>
                        <a
                          href={`tel:${showroom.Phone}`}
                          className="text-gray-800 hover:text-[#009FE3] transition-colors"
                          dir="ltr"
                        >
                          {showroom.Phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t.showrooms_working_hours}</p>
                        <p className="text-gray-800 text-sm">{hoursFrom}</p>
                        <p className="text-gray-800 text-sm">{hoursTo}</p>
                      </div>
                    </div>

                    {weekEnd && (
                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{t.showrooms_weekend}</p>
                          <p className="text-gray-800">{weekEnd}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => openMapDialog(showroom.Latitude, showroom.Longitude, locName)}
                      className="w-full mt-4 bg-[#009FE3] text-white py-2.5 rounded-lg hover:bg-[#0080b8] transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {t.showrooms_view_on_map}
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
          );
        })}
      </div>

      {/* Map Dialog */}
      {selectedMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"  style={{ zIndex: 2000 }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-[#009FE3] to-[#0080b8] text-white p-4 flex items-center justify-between">
              <h3 className="text-xl">{selectedMap.name}</h3>
              <button
                onClick={() => setSelectedMap(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Embed */}
            <div className="relative" style={{ height: '70vh' }}>
              <iframe
                src={`https://www.google.com/maps?q=${selectedMap.lat},${selectedMap.lng}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Dialog Footer */}
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMap(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                {t.showrooms_close}
              </button>
              <a
                href={`https://www.google.com/maps?q=${selectedMap.lat},${selectedMap.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#009FE3] hover:bg-[#0080b8] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {language === "ar" ? "فتح في خرائط Google" : "Open in Google Maps"}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"  style={{ zIndex: 2000 }}
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-[#009FE3] to-[#0080b8] text-white p-4 flex items-center justify-between">
              <h3 className="text-xl truncate pr-4">{selectedImage.name}</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container with scroll */}
            <div className="relative overflow-auto" style={{ maxHeight: 'calc(95vh - 120px)' }}>
              <div className="flex items-center justify-center min-h-[300px] md:min-h-[500px] p-4 bg-gray-50">
                <img
                  src={`https://${selectedImage.url}`}
                  alt={selectedImage.name}
                  className="max-w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                {t.showrooms_close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ShowroomsPage;
