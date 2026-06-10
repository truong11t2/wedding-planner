'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Calendar, DollarSign, Users, CheckSquare, Camera, MapPin } from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

const services: Service[] = [
  {
    icon: Calendar,
    title: 'Tạo Lịch Trình Cưới',
    description: 'Tạo lịch trình đám cưới cá nhân hóa với nhắc nhở tự động và theo dõi các mốc quan trọng. Giữ mọi thứ tổ chức từ đính hôn đến ngày trọng đại.',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: DollarSign,
    title: 'Quản Lý Ngân Sách',
    description: 'Theo dõi chi tiêu, đặt giới hạn chi tiêu và quản lý thanh toán tất cả trong một nơi. Không bao giờ vượt quá ngân sách nữa.',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: Users,
    title: 'Quản Lý Danh Sách Khách Mời',
    description: 'Tổ chức lời mời, quản lý sắp xếp chỗ ngồi và giao tiếp với khách một cách dễ dàng.',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: CheckSquare,
    title: 'Danh Sách Kiểm Tra Thông Minh',
    description: 'Không bao giờ bỏ lỡ một nhiệm vụ với danh sách kiểm tra đám cưới toàn diện của chúng tôi. Nhận các đề xuất cá nhân hóa dựa trên lịch trình của bạn.',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: Camera,
    title: 'Thư Viện Ảnh Cưới',
    description: 'Tạo album cưới đẹp mắt, chia sẻ ảnh với khách mời và lưu giữ những kỷ niệm quý giá của bạn mãi mãi.',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: MapPin,
    title: 'Danh Bạ Nhà Cung Cấp',
    description: 'Duyệt và so sánh các nhà cung cấp địa phương, đọc đánh giá và đặt đội ngũ hoàn hảo cho ngày đặc biệt của bạn.',
    badge: 'MIỄN PHÍ',
  },
];

export default function ServicesSection() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-amber-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 tracking-wide">
            100% MIỄN PHÍ
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">
            Mọi thứ bạn cần để lên kế hoạch cho đám cưới trong mơ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Công cụ lập kế hoạch mạnh mẽ hoàn toàn miễn phí. Không phí ẩn. Không cần thẻ tín dụng. 
            Bắt đầu lên kế hoạch cho ngày hoàn hảo của bạn ngay hôm nay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-gray-50 p-8 h-full hover:bg-gray-100 transition-colors duration-300 relative">
                  {service.badge && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {service.badge}
                    </div>
                  )}
                  <div className="mb-6">
                    <Icon className="w-12 h-12 text-pink-600" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Animated bottom border */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-pink-600 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-6">
            Tham gia cùng hàng ngàn cặp đôi đang lên kế hoạch cho ngày hoàn hảo của họ
          </p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-medium tracking-wide"
          >
            Bắt đầu miễn phí
          </a>
        </div>
      </div>
    </section>
  );
}
