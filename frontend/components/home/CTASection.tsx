'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Heart, Send, Mail, MessageSquare, Loader2, CheckCircle2, User } from 'lucide-react';
import { submitContact } from '@/api/other';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorMessage, setVendorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToHero = () => {
    const heroSection = document.querySelector('section');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const targetButton = buttons.find(btn => 
        btn.textContent?.includes('Bắt đầu ngay bây giờ')
      ) as HTMLButtonElement;
      targetButton?.click();
    }, 800);
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await submitContact({ name: vendorName, email: vendorEmail, message: vendorMessage });
      setSubmitSuccess(true);
      setVendorName('');
      setVendorEmail('');
      setVendorMessage('');
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch {
      setSubmitError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-linear-to-br from-rose-900 via-purple-900 to-indigo-900"
    >
      {/* Decorative Watermark */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="font-serif text-[20rem] md:text-[30rem] text-gray-900 select-none">
          &amp;
        </div>
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-5">
            Bắt Đầu Hành Trình Của Bạn
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Dành cho các cặp đôi muốn lập kế hoạch đám cưới hoàn hảo và các nhà cung cấp dịch vụ muốn hợp tác với chúng tôi.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Couples Column */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white/10 hover:bg-white/20 rounded-2xl shadow-xl p-8 lg:p-10 h-full border border-rose-100 flex flex-col">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse" />
                  {/* <div className="absolute inset-0 w-16 h-16 bg-rose-400/20 rounded-full blur-xl animate-pulse" /> */}
                </div>
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 text-center">
                Dành Cho Các Cặp Đôi
              </h3>
              
              <p className="text-white text-lg mb-8 text-center leading-relaxed">
                Bắt đầu lập kế hoạch đám cưới hoàn hảo của bạn ngay hôm nay. 
                Hoàn toàn miễn phí và dễ dàng sử dụng.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-white">Tổng hợp ngân sách chi tiêu, nhiệm vụ cần làm</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-white">Tạo lịch trình chi tiết cho ngày cưới</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-white">Quản lý ngân sách và danh sách khách mời</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-white">Kết nối với nhà cung cấp dịch vụ uy tín</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-white">Tạo album ảnh và chia sẻ dễ dàng</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={scrollToHero}
                  className="w-full group relative inline-flex items-center justify-center gap-3 bg-linear-to-r from-rose-500 to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  {/* <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/30 to-transparent" /> */}
                  <span className="relative z-10">Lên Kế Hoạch</span>
                </button>
                
                <p className="text-center text-sm text-white/80 mt-4">
                  ✨ 100% miễn phí • Không cần thẻ tín dụng
                </p>
              </div>
            </div>
          </div>

          {/* Vendors Column */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white/10 hover:bg-white/20 rounded-2xl shadow-xl p-8 lg:p-10 h-full border border-purple-100 flex flex-col">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Send className="w-16 h-16 text-amber-300 animate-pulse" />
                  {/* <div className="absolute inset-0 w-16 h-16 bg-purple-400/20 rounded-full blur-xl" /> */}
                </div>
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 text-center">
                Dành Cho Nhà Cung Cấp
              </h3>
              
              <p className="text-white text-lg mb-8 text-center leading-relaxed">
                Hợp tác cùng chúng tôi để kết nối với hàng ngàn cặp đôi đang tìm kiếm dịch vụ của bạn.
              </p>
              
              <div className="flex-1 flex flex-col">
              <form onSubmit={handleVendorSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Họ và tên"
                    className="text-white w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    placeholder="Email của bạn"
                    className="text-white w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white" />
                  <textarea
                    value={vendorMessage}
                    onChange={(e) => setVendorMessage(e.target.value)}
                    placeholder="Giới thiệu về dịch vụ của bạn (loại hình kinh doanh, dịch vụ cung cấp, số điện thoại...)" rows={5}
                    className="text-white w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</span>
                  </div>
                )}
                
                <div className="mt-auto space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative inline-flex items-center justify-center gap-3 bg-linear-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Gửi Thông Tin</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-white/80">
                    📧 Chúng tôi sẽ phản hồi trong vòng 24 giờ
                  </p>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
