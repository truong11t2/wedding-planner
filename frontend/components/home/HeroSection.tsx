'use client';

import React, { useEffect, useState } from 'react';
//import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WeddingDateInput from '@/components/common/WeddingDateInput';
import Timeline from '@/components/home/Timeline';
import { useTimeline } from '@/context/TimelineContext';
import { useAuth } from '@/context/AuthContext';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const { setWeddingDate, weddingDate } = useTimeline();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // const scrollToContent = () => {
  //   const element = document.getElementById('stats-section');
  //   element?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleBeginJourney = () => {
    setShowDateInput(true);
    // Scroll to top on mobile to show DateInput
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Ken Burns Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&q=80')",
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
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
          <>
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide">
                Lập Kế Hoạch Đám Cưới
              </h1>
              {/* <p className="text-xl md:text-2xl lg:text-3xl font-light mb-4 tracking-wider">
                Kế Hoạch Hoàn Hảo
              </p> */}
            </div>
            
            <div className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-red-400/20 to-white-400/20 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-300/50 mb-8">
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

                <div className="bg-gradient-to-r from-amber-400/20 to-emerald-400/20 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-300/50">
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
          </>
        ) : (
          <div className="w-full max-w-4xl animate-fade-in">
            <WeddingDateInput
              onSubmit={handleDateSubmit}
              title="Tạo Lịch Trình Đám Cưới"
              description="Nhập ngày cưới của bạn và chúng tôi sẽ tạo một lịch trình cá nhân hóa chỉ dành cho bạn."
            />
          </div>
        )}
      </div>

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
        @keyframes ken-burns {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.3);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
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
