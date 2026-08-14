'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  wedding: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Ứng dụng giúp chúng mình từ bước đầu lên kế hoạch đến ngày cưới một cách rõ ràng: tạo lịch trình chi tiết, phân chia công việc trong checklist, theo dõi tiến độ và nhắc việc đúng hạn. Quản lý ngân sách cho phép mình theo dõi chi tiêu, so sánh thực tế với dự toán, còn danh bạ nhà cung cấp giúp lọc và liên hệ nhanh — tất cả gói gọn trong một nơi.",
    author: "Minh & Hương",
    role: "Cô Dâu & Chú Rể",
    avatar: "/images/testimonials/minh-huong.jpg",
    wedding: "Thủ Đức, TP.HCM",
  },
  {
    quote: "Chúng mình đặc biệt ấn tượng với tính năng lựa chọn nhà cung cấp: so sánh giá, lưu shortlist và nhắn tin trực tiếp để đặt câu hỏi. Việc này giúp tiết kiệm thời gian tìm kiếm, so sánh hợp đồng và đưa ra quyết định tự tin, đồng thời giữ mọi thông tin liên quan đến nhà cung cấp ngay trong kế hoạch cưới.",
    author: "Lan & Tuấn",
    role: "Cô Dâu & Chú Rể",
    avatar: "/images/testimonials/lan-tuan.jpg",
    wedding: "Tân Bình, HCM",
  },
  {
    quote: "Checklist và timeline là cứu cánh của chúng tôi: phân công nhiệm vụ, đặt deadline và theo dõi trạng thái từng việc. Khi đến gần ngày cưới, lịch trình chi tiết trên app giúp đội ngũ và gia đình đồng bộ, giảm nhầm lẫn và đảm bảo mọi thứ diễn ra đúng kế hoạch.",
    author: "Phương & Nam",
    role: "Cô Dâu & Chú Rể",
    avatar: "/images/testimonials/phuong-nam.jpg",
    wedding: "Hà Nội",
  },
];

export default function TestimonialsSection() {
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
    <section ref={sectionRef} className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">
            Chia Sẻ Từ Các Cặp Đôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Không gì có ý nghĩa hơn đối với chúng tôi ngoài việc được lắng nghe chia sẻ chân thành từ các cặp đôi đã đến với "Về Một Nhà".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white p-8 shadow-sm transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* <Quote className="w-10 h-10 text-amber-900/20 mb-6" /> */}
              
              <p className="text-gray-700 italic leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div 
                  className="w-14 h-14 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url('${testimonial.avatar}')` }}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.wedding}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
