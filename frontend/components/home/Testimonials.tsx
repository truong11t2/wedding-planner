'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
  weddingDate: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Thắng & Trang",
    location: "Sài Gòn",
    rating: 5,
    text: "Công cụ lập kế hoạch đám cưới này đã biến đám cưới trong mơ của chúng tôi thành hiện thực! Tính năng lịch trình giúp chúng tôi rất nhiều trong suốt quá trình lên kế hoạch. Đám cưới đã không trọn vẹn nếu không có công cụ tuyệt vời này.",
    weddingDate: "15  tháng 6, 2025"
  },
  {
    id: 2,
    name: "Nga & Long",
    location: "Đồng Nai",
    rating: 5,
    text: "Tính năng tổ chức ảnh đã thay đổi cuộc chơi! Chúng tôi có thể theo dõi tất cả các bức ảnh cảm hứng và danh mục nhà cung cấp trong một nơi. Rất khuyến khích cho bất kỳ cặp đôi nào đang lên kế hoạch cho ngày trọng đại của họ.",
    weddingDate: "22 tháng 9, 2025"
  },
  {
    id: 3,
    name: "Khánh & Mai",
    location: "Long An",
    rating: 5,
    text: "Từ việc tạo lịch trình đến quản lý nhà cung cấp, nền tảng này có tất cả những gì chúng tôi cần. Hướng dẫn từng bước làm cho việc lập kế hoạch đám cưới trở nên bớt căng thẳng hơn rất nhiều. Cảm ơn vì đã làm cho ngày của chúng tôi trở nên hoàn hảo!",
    weddingDate: "8 tháng 3, 2024"
  },
  {
    id: 4,
    name: "Phương & James",
    location: "Sài Gòn",
    rating: 5,
    text: "Tính năng theo dõi ngân sách và phối hợp nhà cung cấp đã giúp chúng tôi tiết kiệm rất nhiều thời gian và tiền bạc. Chúng tôi có thể lên kế hoạch cho toàn bộ đám cưới một cách hiệu quả và giữ trong ngân sách. Rất yêu công cụ này!",
    weddingDate: "12 tháng 10, 2025"
  },
  {
    id: 5,
    name: "Rachel & Thắng",
    location: "USA",
    rating: 5,
    text: "Là người yêu thích sự ngăn nắp, công cụ lập kế hoạch đám cưới này thật hoàn hảo cho tôi. Các danh sách kiểm tra chi tiết và lịch trình đã giúp chúng tôi theo dõi từng bước. Đám cưới của chúng tôi thật hoàn hảo!",
    weddingDate: "30 tháng 7, 2025"
  },
  {
    id: 6,
    name: "Sang & Hoa",
    location: "Hà Nội",
    rating: 5,
    text: "Lên kế hoạch cho một đám cưới ở xa tưởng chừng như quá sức cho đến khi chúng tôi tìm thấy nền tảng này. Các công cụ lập kế hoạch toàn diện đã giúp việc điều phối mọi thứ từ xa trở nên dễ dàng hơn rất nhiều. Không thể nào hài lòng hơn!",
    weddingDate: "5 tháng 12, 2025"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-start space-x-4 h-full">
        <div className="flex-shrink-0">
          <Quote className="w-8 h-8 text-pink-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
            "{testimonial.text}"
          </p>
          <div className="border-t pt-4 mt-auto">
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
            <p className="text-xs text-pink-600 mt-1">
              Ngày Cưới: {testimonial.weddingDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const scrollToWeddingDate = () => {
    // Try multiple possible selectors for the wedding date section
    const weddingDateSection = 
      document.getElementById('wedding-date')
    if (weddingDateSection) {
      weddingDateSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      // Fallback: scroll to top of page where the form likely is
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Các cặp đôi đã nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Đừng chỉ nghe chúng tôi nói. Hãy xem những gì các cặp đôi thực sự nói về trải nghiệm lập kế hoạch đám cưới với nền tảng của chúng tôi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">40+</div>
              <div className="text-sm md:text-base text-gray-600">Cặp Đôi Hạnh Phúc</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">4.8/5</div>
              <div className="text-sm md:text-base text-gray-600">Đánh Giá Trung Bình</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">10+</div>
              <div className="text-sm md:text-base text-gray-600">Tỉnh Thành Phục Vụ</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">94%</div>
              <div className="text-sm md:text-base text-gray-600">Sẽ Giới Thiệu</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Sẵn sàng tham gia cùng hàng ngàn cặp đôi hạnh phúc?
          </p>
          <button 
            onClick={scrollToWeddingDate}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Bắt Đầu Ngay!
          </button>
        </div>
      </div>
  );
}