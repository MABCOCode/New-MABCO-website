import { useState } from "react";
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
const showroomsData: Showroom[] = [
  {"Loc_code":"S222","City_name":"دمشق","Loc_name":"البرامكة","Phone":"011-9909","warranty_type":"","Address":"البرامكة - مقابل جامع مصعب بن عمير","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 07:00 مساءً","Longitude":"36.285","Latitude":"33.5064","Image_Link":"mabcoonline.com/images/Branches/baramkah.jpg","week_end":"الجمعة"},
  {"Loc_code":"S031","City_name":"دمشق","Loc_name":"جرمانا","Phone":"011-5660445","warranty_type":"","Address":"ساحة الرئيس - بجانب مركز خدمة سيرياتيل","Winter_from_date":"مــن 11:30 صباحاً","Winter_to_date":"إلى 10:30 مساءً","Longitude":"36.3421","Latitude":"33.4873","Image_Link":"mabcoonline.com/images/Branches/New Jaramana.jpg","week_end":"الجمعة"},
  {"Loc_code":"S102","City_name":"دمشق","Loc_name":"مزة - أوتستراد","Phone":"011-6111447","warranty_type":"","Address":"أوتوستراد المزة - بعد مشفى الرازي","Winter_from_date":"مــن 009:00 صباحاً","Winter_to_date":"إلى 10:00 مساءً","Longitude":"36.2623","Latitude":"33.5051","Image_Link":"mabcoonline.com/images/Branches/Mazzeh.jpg","week_end":"الجمعة"},
  {"Loc_code":"S115","City_name":"دمشق","Loc_name":"دمر","Phone":"011-3127001","warranty_type":"","Address":"دمر-سوق الشام المركزي","Winter_from_date":"مــن 11:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.2326","Latitude":"33.5299","Image_Link":"mabcoonline.com/images/Branches/Dummar.jpg","week_end":"الجمعة"},
  {"Loc_code":"S017","City_name":"دمشق","Loc_name":"البرج الجديدة","Phone":"011-6341999","warranty_type":"","Address":" البرج- طابق أرضي","Winter_from_date":"من 09:00 صباحاً","Winter_to_date":"إلى 07:30 مساءا","Longitude":"36.2976","Latitude":"33.5141","Image_Link":"mabcoonline.com/images/Branches/albrjnew.jpg","week_end":"الجمعة"},
  {"Loc_code":"S003","City_name":"دمشق","Loc_name":"القصاع","Phone":"011-4450292","warranty_type":"","Address":"القصاع - الغساني - مقابل مشفى الزهراوي","Winter_from_date":"مــن 11:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.3166","Latitude":"33.5212","Image_Link":"mabcoonline.com/images/Branches/kassa.jpg","week_end":""},
  {"Loc_code":"S004","City_name":"دمشق","Loc_name":"المحافظة","Phone":"011-2325612","warranty_type":"","Address":"ساحة المحافظة، بناء المحافظة","Winter_from_date":"مــن 9:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.297","Latitude":"33.5154","Image_Link":"mabcoonline.com/images//Mohafaza.jpg","week_end":"الجمعة"},
  {"Loc_code":"S006","City_name":"دمشق","Loc_name":"النصر","Phone":"011-2225842","warranty_type":"","Address":" النصر - بناء جامع تنكز","Winter_from_date":"مــن 08:30 صباحاً","Winter_to_date":"إلى 07:00 مساءً","Longitude":"36.2969","Latitude":"33.5113","Image_Link":"mabcoonline.com/images/Branches/Naser.jpg","week_end":"الجمعة"},
  {"Loc_code":"S520","City_name":"دمشق","Loc_name":"خالد ابن الوليد","Phone":"011-2228436","warranty_type":"","Address":"شارع خالد ابن الوليد - مقابل مشفى الكندي","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى 08:30 مساءً","Longitude":"36.2955","Latitude":"33.5061","Image_Link":"mabcoonline.com/images/Branches/Khaled abn alwaleed.jpg","week_end":"الجمعة"},
  {"Loc_code":"S526","City_name":"دمشق","Loc_name":"دويلعة","Phone":"011-4728439","warranty_type":"","Address":"دويلعة - مقابل كنيسة مار يوسف","Winter_from_date":"مــن 10:30 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.3205","Latitude":"33.5033","Image_Link":"mabcoonline.com/images/Branches/doyl3a.jpg","week_end":"الجمعة"},
  {"Loc_code":"S134","City_name":"دمشق","Loc_name":"الجاحظ","Phone":"011-3339282","warranty_type":"","Address":"الشعلان- حبوبي ثالث - جانب ملبوسات400","Winter_from_date":"مــن 12:00 مساءً","Winter_to_date":"إلى 10:00 مساءً","Longitude":"36.2821","Latitude":"33.5181","Image_Link":"mabcoonline.com/images/Branches/Jahez.jpg","week_end":"الجمعة"},
  {"Loc_code":"S135","City_name":"دمشق","Loc_name":"الشعلان","Phone":"011-3344816","warranty_type":"","Address":"الشعلان- حبوبي ثالث - مقابل أديداس","Winter_from_date":"مــن 11:00 صباحاً","Winter_to_date":"إلى 09:30 مساءً","Longitude":"36.288","Latitude":"33.5183","Image_Link":"mabcoonline.com/images/Branches/Sha3lan.jpg","week_end":"الجمعة"},
  {"Loc_code":"S648","City_name":"دمشق","Loc_name":"مساكن برزة","Phone":"011-5111176","warranty_type":"","Address":"مساكن برزة-مقابل محل الجابي","Winter_from_date":"مــن 11:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.3143","Latitude":"33.5465","Image_Link":"mabcoonline.com/images/Branches/Msaken Barzeh 2.jpg","week_end":"الجمعة"},
  {"Loc_code":"S739","City_name":"دمشق","Loc_name":"حريقة","Phone":"011-2222933","warranty_type":"","Address":"شارع فخري البارودي - خلف القصر العدلي","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى 08:30 مساءً","Longitude":"36.3003","Latitude":"33.5099","Image_Link":"mabcoonline.com/images/Branches/Harika.jpg","week_end":"الجمعة"},
  {"Loc_code":"S868","City_name":"دمشق","Loc_name":"صحنايا - مفرق الجديدة","Phone":"011-6730963","warranty_type":"","Address":"صحنايا-جانب مركز الهاتف","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى 007:30 مساءً","Longitude":"36.226","Latitude":"33.431","Image_Link":"mabcoonline.com/images/Branches/sahnaya.jpg","week_end":"الجمعة"},
  {"Loc_code":"S119","City_name":"حلب","Loc_name":"الجميلية","Phone":"021-2227081","warranty_type":"","Address":"الجميلية-جانب مسرح نقابة الفنانين","Winter_from_date":"مــن 10:30 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"37.1449","Latitude":"36.2075","Image_Link":"mabcoonline.com/images/Branches/Aleppo jamilia.jpg","week_end":"الجمعة"},
  {"Loc_code":"S794","City_name":"حماه","Loc_name":"العلمين","Phone":"013-2521096","warranty_type":"","Address":" شارع العلمين جانب شركة الفؤاد","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 07:30 مساءً","Longitude":"36.7572","Latitude":"35.1296","Image_Link":"mabcoonline.com/images/Branches/Alameen.jpg","week_end":"الجمعة"},
  {"Loc_code":"S009","City_name":"حماه","Loc_name":"القوتلي","Phone":"013-2516930","warranty_type":"","Address":" القوتلي - مقابل بنك سورية والمهجر","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 08:00 مساءً","Longitude":"36.7535","Latitude":"35.1305","Image_Link":"mabcoonline.com/images/Branches/Quwatli.jpg","week_end":"الجمعة"},
  {"Loc_code":"S340","City_name":"حمص","Loc_name":"الغوطة","Phone":"012-2460661","warranty_type":"","Address":"شارع الغوطة","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.704","Latitude":"34.7318","Image_Link":"mabcoonline.com/images/Branches/Ghota.jpg","week_end":"الجمعة"},
  {"Loc_code":"S401","City_name":"حمص","Loc_name":"الحضارة","Phone":"012-2120088","warranty_type":"","Address":"الحضارة-دوار النزهة","Winter_from_date":"من 1100 صباحاً","Winter_to_date":"الى 10:00 مساءً","Longitude":"36.7165","Latitude":"34.7146","Image_Link":"mabcoonline.com/images/Branches/7adara.jpg","week_end":"الجمعة"},
  {"Loc_code":"S786","City_name":"اللاذقية","Loc_name":"8 آذار","Phone":"041-486239","warranty_type":"","Address":" شارع 8 آذار - مقابل مشفى الأسد","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 9:00 مساءً","Longitude":"35.7749","Latitude":"35.5189","Image_Link":"mabcoonline.com/images/Branches/8azar.jpg","week_end":"الجمعة"},
  {"Loc_code":"S026","City_name":"اللاذقية","Loc_name":"أنطاكية","Phone":"041-219319","warranty_type":"","Address":" أنطاكيا - بناء برج أنطاكيا","Winter_from_date":"مــن 10:30 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"35.7781","Latitude":"35.5241","Image_Link":"mabcoonline.com/images/Branches/Antakia.jpg","week_end":"الجمعة"},
  {"Loc_code":"S012","City_name":"اللاذقية","Loc_name":"بغداد","Phone":"041-467999","warranty_type":"","Address":" بغداد - بناء المهندسين","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 09:00 مساءُ","Longitude":"35.7749","Latitude":"35.5155","Image_Link":"mabcoonline.com/images/Branches/baghdad.jpg","week_end":"الجمعة"},
  {"Loc_code":"S023","City_name":"اللاذقية","Loc_name":"الجمهورية","Phone":"041-556720","warranty_type":"","Address":"الزراعة - شارع حلب - موقف أسبيرو","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"35.8","Latitude":"35.5261","Image_Link":"mabcoonline.com/images/Branches/Jam3a.jpg","week_end":"الجمعة"},
  {"Loc_code":"S823","City_name":"جبلة","Loc_name":"العمارة","Phone":"041-809747","warranty_type":"","Address":"جبلة-شارع العمارة - مقابل مركز  خدمات سيرياتل","Winter_from_date":"مــن 09:30 صباحاً","Winter_to_date":"إلى 06:00 مساءً","Longitude":"35.9306","Latitude":"35.3622","Image_Link":"mabcoonline.com/images/Branches/jableh.jpg","week_end":"الجمعة"},
  {"Loc_code":"S035","City_name":"طرطوس","Loc_name":"هنانو","Phone":"043-2323240","warranty_type":"","Address":" هنانو - بعد المخزن الكبير","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"35.8805","Latitude":"34.8878","Image_Link":"mabcoonline.com/images/Branches/tartus_thaw.JPG","week_end":"الجمعة"},
  {"Loc_code":"S011","City_name":"طرطوس","Loc_name":"الكرامة","Phone":"043-2326665","warranty_type":"","Address":" هنانو - مقابل مدرسة الكرامة","Winter_from_date":"مــن 10:00 صباحاً","Winter_to_date":"إلى08:30 مساءً","Longitude":"35.8808","Latitude":"34.8888","Image_Link":"mabcoonline.com/images/Branches/tartus.jpg","week_end":"الجمعة"},
  {"Loc_code":"S018","City_name":"دمشق","Loc_name":"المرجة","Phone":"011-2222354","warranty_type":"","Address":"ساحة المرجة","Winter_from_date":"مــن 09:00 صباحاً","Winter_to_date":"إلى 09:00 مساءً","Longitude":"36.2975","Latitude":"33.5128","Image_Link":"mabcoonline.com/images/Branches/Marjeh.jpg","week_end":"الجمعة"}
];

import { useLanguage } from '../../../context/LanguageContext';

export function ShowroomsPage(_: ShowroomsPageProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [selectedMap, setSelectedMap] = useState<{ lat: string; lng: string; name: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const t = translations[language];

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
        {cities.map((city) => (
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