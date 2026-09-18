'use client';

import React, { useEffect, useState } from 'react';
//import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WeddingDateInput from '@/components/common/WeddingDateInput';
import Timeline from '@/components/home/Timeline';
import HeroIconBackground, {
  type HeroIconVariant,
} from '@/components/home/HeroIconBackground';
import { useTimeline } from '@/context/TimelineContext';
import { useAuth } from '@/context/AuthContext';

const SLIDE_INTERVAL = 20000;

const heroSlides: {
  id: string;
  label: string;
  background: HeroIconVariant;
}[] = [
  {
    id: 'invitation',
    label: 'Tạo thiệp cưới online',
    background: 'invitation',
  },
  {
    id: 'planner',
    label: 'Lập kế hoạch đám cưới',
    background: 'planner',
  },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setWeddingDate, weddingDate } = useTimeline();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Carousel chỉ chạy khi đang ở màn hình giới thiệu (không phải form ngày cưới / timeline)
  const isCarouselActive = !showDateInput && !showTimeline;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isCarouselActive) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isCarouselActive, currentSlide]);

  // const scrollToContent = () => {
  //   const element = document.getElementById('stats-section');
  //   element?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleBeginJourney = () => {
    setShowDateInput(true);
    // Scroll to top on mobile to show DateInput
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateInvitation = () => {
    router.push('/invitation');
  };

  const handleDateSubmit = (date: string, location: string) => {
    setWeddingDate(date, location);
    
    if (isLoggedIn) {
      // If user is logged in, redirect to timeline page
      router.push('/timeline');
    } else {
      // If user is not logged in, show timeline inline
      setShowDateInput(false);
      setShowTimeline(true);
    }
  };

  const handleChangeDate = () => {
    setShowTimeline(false);
    setShowDateInput(true);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Nền mỗi slide được dựng từ hoạ tiết icon (không dùng ảnh chụp) */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <HeroIconBackground variant={slide.background} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 md:pt-0 text-center text-white">
        {showTimeline ? (
          <div className="w-full max-w-7xl mx-auto py-12 animate-fade-in">
            <Timeline 
              initialWeddingDate={weddingDate}
              onChangeDate={handleChangeDate}
            />
          </div>
        ) : !showDateInput ? (
          <div className="grid">
          {/* Slide 2 — Lập kế hoạch đám cưới */}
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ${
              currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={currentSlide !== 1}
          >
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible && currentSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide">
                Lập Kế Hoạch Đám Cưới
              </h1>
              {/* <p className="text-xl md:text-2xl lg:text-3xl font-light mb-4 tracking-wider">
                Kế Hoạch Hoàn Hảo
              </p> */}
            </div>
            
            <div className={`transition-all duration-1000 delay-700 ${
              isVisible && currentSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-red-400/20 to-white-400/20 rounded-xl p-6 border-2 border-gray-300/50 mb-8">
                  <p className="text-2xl font-bold mb-3 text-amber-200">
                    Vấn Đề Thường Gặp
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Quá nhiều việc, nên bắt đầu từ đâu?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Ngân sách vượt chi không kiểm soát?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Quên cột mốc quan trọng?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Khó quản lý danh sách khách mời?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Thiếu lựa chọn nhà cung cấp uy tín?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="font-medium">Thuê dịch vụ, tốn kém, gò bó?</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-400/20 to-emerald-400/20 rounded-xl p-6 border-2 border-amber-300/50">
                  <p className="text-2xl font-bold mb-3 text-amber-200">
                    Giải Pháp Toàn Diện
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">Lịch trình tự động theo ngày cưới</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">Quản lý ngân sách thông minh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">Nhắc nhở deadline quan trọng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">Danh bạ nhà cung cấp uy tín</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">Tự do lựa chọn & đánh giá dịch vụ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="font-medium">100% miễn phí, linh hoạt</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleBeginJourney}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-10 py-4 rounded-full hover:scale-105 transition-all duration-300 font-semibold tracking-wide shadow-2xl text-lg mb-12 md:mb-0"
              >
                Bắt đầu ngay bây giờ
              </button>
            </div>
          </div>

          {/* Slide 1 — Tạo thiệp cưới online */}
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ${
              currentSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={currentSlide !== 0}
          >
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible && currentSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide">
                Thiệp Cưới Online
              </h2>
              <p className="text-lg md:text-2xl font-light mb-6 tracking-wide text-amber-100">
                Thiệp mời cưới trực tuyến — thiết kế, cá nhân hóa và gửi tới khách mời chỉ trong vài phút.
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-700 ${
              isVisible && currentSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-amber-400/20 to-purple-400/20 rounded-xl p-6 border-2 border-amber-300/50">
                  <div className="grid md:grid-cols-2 gap-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Miễn phí, không cần biết thiết kế</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Đa dạng mẫu mã thiệp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Dễ dàng tùy chỉnh thông tin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Tự động điền tên người được mời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Bản đồ chỉ đường</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Thêm vào lịch Google</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Gửi qua Zalo, Facebook, SMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Xác nhận tham dự ngay trên thiệp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300">✓</span>
                      <span className="font-medium text-left">Sổ lưu bút và lời chúc online</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreateInvitation}
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-10 py-4 rounded-full hover:scale-105 transition-all duration-300 font-semibold tracking-wide shadow-2xl text-lg"
              >
                Tạo thiệp cưới ngay
              </button>
            </div>
          </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl animate-fade-in">
            <WeddingDateInput
              onSubmit={handleDateSubmit}
              title="Tạo Lịch Trình Đám Cưới"
              description="Nhập ngày cưới của bạn và chúng tôi sẽ tạo một lịch trình cá nhân hóa chỉ dành cho bạn."
            />
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      {isCarouselActive && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Xem: ${slide.label}`}
              aria-current={currentSlide === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      {/* {!showDateInput && !showTimeline && (
        <div 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce"
        >
          <ChevronDown className="text-white w-8 h-8" />
        </div>
      )} */}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
