'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Calendar, DollarSign, Users, CheckSquare, Camera, NotebookTabs } from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

interface TimelineTab {
  id: string;
  title: string;
  subtitle: string;
  activities: string[];
}

const services: Service[] = [
  {
    icon: NotebookTabs,
    title: 'Danh Bạ Nhà Cung Cấp',
    description: 'Duyệt và so sánh các nhà cung cấp địa phương, đọc đánh giá và đặt đội ngũ hoàn hảo cho ngày đặc biệt của bạn.',
    badge: 'MIỄN PHÍ',
  },
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
    title: 'Quản Lý Khách Mời',
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
];

const timelineTabs: TimelineTab[] = [
  {
    id: '1-year',
    title: '1 năm',
    subtitle: 'Chuẩn bị sơ bộ',
    activities: [
      'Hai bên gia đình gặp mặt (lễ dạm ngõ hoặc bữa cơm chung).',
      'Xác định ngày cưới và ngân sách tổng quát. Chuẩn bị tài chính.',
      'Lên ý tưởng tổng quan cho đám cưới (chủ đề, màu sắc, phong cách).',
      'Tìm hiểu các nhà cung cấp dịch vụ (nhà hàng, trang phục, chụp hình...).',
      'Lên danh sách khách mời dự kiến.',
    ],
  },
  {
    id: '9-6-months',
    title: '9-6 tháng',
    subtitle: 'Liên hệ đặt dịch vụ chính',
    activities: [
      'Đặt nhà hàng tiệc cưới.',
      'Chọn và đặt mua/thuê váy cưới và vest.',
      'Đặt dịch vụ chụp hình và quay phim.',
      'Đăng ký kết hôn ở UBND xã hoặc phường',
    ],
  },
  {
    id: '6-3-months',
    title: '6-3 tháng',
    subtitle: 'Lên kế hoạch chi tiết',
    activities: [
      'Xác nhận và ký hợp đồng với các nhà cung cấp chính.',
      'Lên kế hoạch chi tiết cho tiệc cưới (menu, trang trí, âm nhạc).',
      'Chốt danh sách khách chính thức và thiết kế thiệp cưới.',
      'Chụp ảnh pre-wedding',
    ],
  },
  {
    id: '6-3-weeks',
    title: '6-3 tuần',
    subtitle: 'Chuẩn bị chi tiết',
    activities: [
      'Xác nhận số lượng khách tham dự cuối cùng.',
      'Hoàn thiện kịch bản buổi lễ và tiệc cưới.',
      'Thử váy cưới và vest lần cuối.',
      'Xác nhận lịch trình với tất cả nhà cung cấp.',
      'Gửi thiệp cưới',
      'Chuẩn bị bài phát biểu và lời cảm ơn.',
    ],
  },
  {
    id: '15-7-days',
    title: '15-7 ngày',
    subtitle: 'Chuẩn bị cuối cùng',
    activities: [
      'Làm việc với tất cả nhà cung cấp lần cuối.',
      'Chuẩn bị hành lý cho tuần trăng mật (nếu có).',
      'Tập dượt buổi lễ với người dẫn chương trình.',
      'Nghỉ ngơi và thư giãn để có sức khỏe tốt nhất.',
    ],
  },
  {
    id: 'day-before',
    title: 'Ngày mai',
    subtitle: 'Thư giản',
    activities:[ 
      'Giao nhẫn cưới cho phù dâu/phù rể.',
      'Đi ngủ sớm và có giấc ngủ đủ.',
      'Tin tưởng vào kế hoạch đã chuẩn bị!',
    ],
  },
];

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1-year');
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
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 tracking-wide">
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
                  <div className="mb-2">
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

        {/* Wedding Timeline Tabs */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">
              Lịch Trình Chuẩn Bị Đám Cưới
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hướng dẫn chi tiết theo từng giai đoạn để bạn chuẩn bị hoàn hảo cho ngày cưới
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {timelineTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            {timelineTabs.map((tab) => (
              <div
                key={tab.id}
                className={`transition-all duration-500 ${
                  activeTab === tab.id
                    ? 'opacity-100 block'
                    : 'opacity-0 hidden'
                }`}
              >
                <h3 className="font-serif text-3xl mb-8 text-gray-900 flex items-center justify-center">
                  {/* <Calendar className="w-8 h-8 text-pink-600 mr-3" /> */}
                  {tab.subtitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {tab.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
