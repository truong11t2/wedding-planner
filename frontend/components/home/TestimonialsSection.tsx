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
    quote: "Từ buổi gặp đầu tiên, chúng tôi đã biết mình đang được chăm sóc bởi những người tuyệt vời. Mọi chi tiết đều được cân nhắc kỹ lưỡng, và ngày cưới vượt xa những giấc mơ hoang dã nhất của chúng tôi. Những bức ảnh thật sự ngoạn mục.",
    author: "Minh & Hương",
    role: "Cô Dâu & Chú Rể",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&h=200&fit=crop&q=80",
    wedding: "Trung Tâm Hội Nghị, Hà Nội",
  },
  {
    quote: "Sự chu đáo, chuyên nghiệp và sáng tạo là không thể so sánh. Họ đã biến tầm nhìn của chúng tôi thành hiện thực và ghi lại những khoảnh khắc mà chúng tôi sẽ trân trọng mãi mãi. Chúng tôi không thể yêu cầu thêm gì nữa.",
    author: "Lan & Tuấn",
    role: "Cô Dâu & Chú Rể",
    avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&h=200&fit=crop&q=80",
    wedding: "Resort Biển, Đà Nẵng",
  },
  {
    quote: "Làm việc với đội ngũ này là quyết định tốt nhất mà chúng tôi đã làm cho đám cưới của mình. Sự chú ý đến từng chi tiết, sự hiện diện bình tĩnh và con mắt nghệ thuật của họ đã làm cho toàn bộ trải nghiệm trở nên hoàn hảo và kỳ diệu.",
    author: "Phương & Nam",
    role: "Cô Dâu & Chú Rể",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&h=200&fit=crop&q=80",
    wedding: "Vườn Sinh Thái, Vũng Tàu",
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
            Không gì có ý nghĩa hơn đối với chúng tôi ngoài việc được lắng nghe chia sẻ từ các cặp đôi
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
              <Quote className="w-10 h-10 text-amber-900/20 mb-6" />
              
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
