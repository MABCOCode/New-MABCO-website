import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../components/ui/carousel';

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

interface OfferSliderProps {
  language: 'ar' | 'en';
}

const OfferSlider: React.FC<OfferSliderProps> = ({ language }) => {
  const offers: Offer[] = [
    {
      id: 1,
      title: "خصم يصل إلى 40%",
      description: "على جميع أجهزة سامسونج الذكية",
      image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "عروض الصيف الحصرية",
      description: "توفير كبير على أجهزة التكييف",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "خصومات الهواتف",
      description: "أفضل العروض على أحدث الموديلات",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-red-500 to-pink-600"
    },
    {
      id: 4,
      title: "تخفيضات التلفزيونات",
      description: "أحدث شاشات 4K و 8K بأسعار مميزة",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: 5,
      title: "عروض الأجهزة المنزلية",
      description: "توفير على جميع الأجهزة الكهربائية",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-yellow-500 to-orange-600"
    },
    {
      id: 6,
      title: "خصومات الألعاب",
      description: "أحدث أجهزة الألعاب بأسعار تنافسية",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const translations = {
    specialOffers: language === 'ar' ? 'عروض خاصة' : 'Special Offers',
    shopNow: language === 'ar' ? 'تسوق الآن' : 'Shop Now'
  };

  return (
    <section className="container mx-auto px-4 py-8">
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: language === 'ar' ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {offers.map((offer) => (
            <CarouselItem
              key={offer.id}
              className="pl-4 basis-full md:basis-1/3 lg:basis-1/4"
            >
              <div className="relative group cursor-pointer h-full">
                {/* 9:16 Aspect Ratio Container */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "177.78%" }}
                >
                  <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-80`}
                    ></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base">
                        {offer.description}
                      </p>
                      <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                        {translations.shopNow}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={`${language === 'ar' ? 'translate-x-1/2' : '-translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-50`}
        />
        <CarouselNext
          className={`${language === 'ar' ? '-translate-x-1/2' : 'translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-50`}
        />
      </Carousel>
    </section>
  );
};

export default OfferSlider;