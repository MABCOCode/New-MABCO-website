import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Calendar, X, Home, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { useNavigate } from 'react-router-dom';
import translations from "../../../i18n/translations";

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
}

interface ShowroomsPageProps {
  // kept for compatibility if needed elsewhere
  language?: "ar" | "en";
  onBack?: () => void;
}

// Showrooms are now served from a static JSON file under /static/showrooms.json

import { useLanguage } from '../../../context/LanguageContext';

export function ShowroomsPage(_: ShowroomsPageProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<{ lat: string; lng: string; name: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [showroomsData, setShowroomsData] = useState<Showroom[]>([]);
  const t = translations[language];

  // Load showrooms from public/static/showrooms.json
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/static/showrooms.json');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setShowroomsData(json);
      } catch (err) {
        console.warn('Failed to load showrooms.json', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Group showrooms by city
  const showroomsByCity = showroomsData.reduce((acc, showroom) => {
    if (!acc[showroom.City_name]) {
      acc[showroom.City_name] = [];
    }
    acc[showroom.City_name].push(showroom);
    return acc;
  }, {} as Record<string, Showroom[]>);

  const cities = Object.keys(showroomsByCity);

  const openMapDialog = (lat: string, lng: string, name: string) => {
    setSelectedMap({ lat, lng, name });
  };

  const openImageDialog = (url: string, name: string) => {
    setSelectedImage({ url, name });
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Breadcrumb - Sticky */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-600 hover:text-[#009FE3] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>{t.home}</span>
              </button>
              <ChevronRight className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-[#009FE3]">{t.showrooms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Showrooms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
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

        {!isLoading && cities.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {language === "ar" ? "لا توجد صالات عرض متاحة حالياً" : "No showrooms available right now"}
          </div>
        )}

        {!isLoading && cities.map((city) => (
          <div key={city} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-[#009FE3]" />
              <h2 className="text-3xl text-gray-800">
                {city}
                <span className={`text-lg text-gray-500 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  ({showroomsByCity[city].length} {t.showrooms_count_label})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showroomsByCity[city].map((showroom) => (
                <div
                  key={showroom.Loc_code}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Showroom Image */}
                  <div 
                    className="relative h-48 bg-gray-200 overflow-hidden cursor-pointer group"
                    onClick={() => openImageDialog(showroom.Image_Link, showroom.Loc_name)}
                  >
                    <ImageWithFallback
                      src={`https://${showroom.Image_Link}`}
                      alt={showroom.Loc_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 right-4">
                      <h3 className="text-xl text-white drop-shadow-lg inline-block bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">{showroom.Loc_name}</h3>
                    </div>
                    {/* Hover overlay to indicate clickable */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-[#009FE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Showroom Details */}
                  <div className="p-5 space-y-4">
                    {/* Address */}
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t.showrooms_address}</p>
                        <p className="text-gray-800">{showroom.Address}</p>
                      </div>
                    </div>

                    {/* Phone */}
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

                    {/* Working Hours */}
                    <div className="flex gap-3">
                      <Clock className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t.showrooms_working_hours}</p>
                        <p className="text-gray-800 text-sm">
                          {showroom.Winter_from_date}
                        </p>
                        <p className="text-gray-800 text-sm">
                          {showroom.Winter_to_date}
                        </p>
                      </div>
                    </div>

                    {/* Weekend */}
                    {showroom.week_end && (
                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{t.showrooms_weekend}</p>
                          <p className="text-gray-800">{showroom.week_end}</p>
                        </div>
                      </div>
                    )}

                    {/* View on Map Button */}
                    <button
                      onClick={() => openMapDialog(showroom.Latitude, showroom.Longitude, showroom.Loc_name)}
                      className="w-full mt-4 bg-[#009FE3] text-white py-2.5 rounded-lg hover:bg-[#0080b8] transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {t.showrooms_view_on_map}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
