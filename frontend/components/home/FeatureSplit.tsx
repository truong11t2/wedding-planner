'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';

const photographyFeatures = [
  'Kết nối với nhiếp ảnh gia chuyên nghiệp',
  'So sánh giá và phong cách dễ dàng',
  'Xem portfolio và đánh giá thực tế',
  'Đặt lịch tư vấn trực tiếp',
  'Hỗ trợ đàm phán và ký hợp đồng',
];

const vendorFeatures = [
  'Tìm nhà hàng phù hợp sức chứa',
  'Xem thực đơn và báo giá chi tiết',
  'So sánh không gian và dịch vụ',
  'Đặt lịch thử món trước đám cưới',
  'Quản lý menu và yêu cầu đặc biệt',
];

export default function FeatureSplit() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Photography Feature - Left */}
          <div
            className={`transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative h-[400px] md:h-[500px] mb-8">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/homepage/ket_noi_studio.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-gray-900">
              Kết Nối Nhiếp Ảnh Gia
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Chúng tôi kết nối bạn với studio ảnh cưới, giúp bạn ghi lại những khoảnh khắc chân thực nhất — ánh mắt trao nhau, nước mắt hạnh phúc và tiếng cười rộn ràng trong ngày trọng đại của bạn.
            </p>
            
            <ul className="space-y-3">
              {photographyFeatures.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <Check className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Copywriting Feature - Right */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative h-[400px] md:h-[500px] mb-8">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/homepage/ket_noi_nha_hang.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-gray-900">
              Kết Nối Các Nhà Hàng
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Khám phá và đặt những nhà hàng tổ chức tiệc cưới tốt nhất. 
              Từ thực đơn đa dạng, không gian sang trọng đến dịch vụ chuyên nghiệp —   chúng tôi giúp bạn tìm ra địa điểm hoàn hảo cho tiệc cưới.
            </p>
            
            <ul className="space-y-3">
              {vendorFeatures.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <Check className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
                <div className="text-center mt-12">
          <h3 className="text-gray-900 md:text-4xl mb-6">
            Tham gia cùng hàng ngàn cặp đôi
          </h3>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 tracking-wide"
          >
            Đăng ký miễn phí
          </a>
        </div>
      </div>
    </section>
  );
}
