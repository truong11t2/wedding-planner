'use client';

import type { ElementType } from 'react';
import { Calendar, DollarSign, Users, CheckSquare, Camera, NotebookTabs, Mail } from 'lucide-react';
import FeatureCard from '../common/FeatureCard';

interface Service {
  icon: ElementType;
  title: string;
  description: string;
  link: string;
  badge?: string;
}

const services: Service[] = [
  // {
  //   icon: NotebookTabs,
  //   title: 'Danh Bạ Nhà Cung Cấp',
  //   description: 'Duyệt và so sánh các nhà cung cấp địa phương, đọc đánh giá và đặt đội ngũ hoàn hảo cho ngày đặc biệt của bạn.',
  //   badge: 'MIỄN PHÍ',
  // },
  {
    icon: Calendar,
    title: 'Tạo Lịch Trình Cưới',
    description: 'Tạo lịch trình đám cưới cá nhân hóa với nhắc nhở tự động và theo dõi các mốc quan trọng. Giữ mọi thứ tổ chức từ đính hôn đến ngày trọng đại.',
    link: '/timeline',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: DollarSign,
    title: 'Quản Lý Ngân Sách',
    description: 'Theo dõi chi tiêu, đặt giới hạn chi tiêu và quản lý thanh toán tất cả trong một nơi. Không bao giờ vượt quá ngân sách nữa.',
    link: '/budget',
    badge: 'MIỄN PHÍ',
  },
  {
    icon: Users,
    title: 'Quản Lý Khách Mời',
    description: 'Tổ chức lời mời, quản lý sắp xếp chỗ ngồi và giao tiếp với khách một cách dễ dàng.',
    link: '/guests',
    badge: 'MIỄN PHÍ',
  },
  // {
  //   icon: CheckSquare,
  //   title: 'Danh Sách Kiểm Tra Thông Minh',
  //   description: 'Không bao giờ bỏ lỡ một nhiệm vụ với danh sách kiểm tra đám cưới toàn diện của chúng tôi. Nhận các đề xuất cá nhân hóa dựa trên lịch trình của bạn.',
  //   badge: 'MIỄN PHÍ',
  // },
  // {
  //   icon: Camera,
  //   title: 'Thư Viện Ảnh Cưới',
  //   description: 'Tạo album cưới đẹp mắt, chia sẻ ảnh với khách mời và lưu giữ những kỷ niệm quý giá của bạn mãi mãi.',
  //   badge: 'MIỄN PHÍ',
  // },
  {
    icon: Mail,
    title: 'Thiệp cưới trực tuyến',
    description: 'Tạo thiệp cưới đơn giản, nhanh chóng, đa dạng mẫu thiệp. Chia sẻ với bạn bè, người thân với một cú click chuột.',
    link: '/invitation',
    badge: 'MIỄN PHÍ',
  },
];

export default function ServicesSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-linear-to-br from-rose-900 via-purple-900 to-indigo-900">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-pink-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 tracking-wide">
            100% MIỄN PHÍ
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">
            <div className="text-amber-300 pb-5">TRỢ LÝ</div>{' '}
            <br className="hidden md:block" />
            Cưới hỏi thông minh
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Công cụ lập kế hoạch mạnh mẽ hoàn toàn miễn phí. Không phí ẩn. Không cần thẻ tín dụng.
            Bắt đầu lên kế hoạch cho ngày hoàn hảo của bạn ngay hôm nay.
          </p>
        </div>

        {/* Services */}
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div key={service.title} className="relative">
              <FeatureCard
                icon={service.icon}
                title={service.title}
                desc={service.description}
                link={service.link}
                delay={index * 120}
                className="h-full pt-14"
              />
              {service.badge && (
                <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {service.badge}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-blob {
          animation: blob 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
