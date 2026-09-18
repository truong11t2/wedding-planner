'use client';

import { useState } from 'react';

interface TimelineTab {
  id: string;
  title: string;
  subtitle: string;
  activities: string[];
}

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
    activities: [
      'Giao nhẫn cưới cho phù dâu/phù rể.',
      'Đi ngủ sớm và có giấc ngủ đủ.',
      'Tin tưởng vào kế hoạch đã chuẩn bị!',
    ],
  },
];

interface WeddingTimelineSectionProps {
  defaultTab?: string;
  className?: string;
}

export default function TimelineSection({
  defaultTab = '1-year',
}: WeddingTimelineSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        ? 'bg-linear-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105'
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
                    {tab.subtitle}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                    {tab.activities.map((activity, index) => (
                        <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                        <div className="shrink-0 w-8 h-8 bg-linear-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
    </section>
  );
}
