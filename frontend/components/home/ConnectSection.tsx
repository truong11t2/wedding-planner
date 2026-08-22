'use client';

import { MessageSquareMore, ShoppingBag, Star, Store } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const coupleFeatures = [
  {
    icon: Store,
    title: 'Nhà Cung Cấp Uy Tín',
    desc: 'Tất cả nhà cung cấp đều được kiểm duyệt kỹ lưỡng về chất lượng và độ uy tín trước khi xuất hiện trên nền tảng.',
  },
  {
    icon: MessageSquareMore,
    title: 'Thỏa Thuận Trực Tiếp',
    desc: 'Liên hệ và đàm phán giá cả trực tiếp với nhà cung cấp, không qua trung gian, tiết kiệm tối đa chi phí.',
  },
  {
    icon: Star,
    title: 'Đánh Giá Thực Tế',
    desc: 'Hàng nghìn đánh giá thật từ các cặp đôi đã sử dụng dịch vụ giúp bạn đưa ra quyết định tốt nhất.',
  },
  {
    icon: ShoppingBag,
    title: 'Đa Dạng Lựa Chọn',
    desc: 'Từ nhiếp ảnh, trang điểm, nhà hàng đến nhạc sống — tất cả trong một nơi duy nhất, dễ dàng so sánh.',
  },
];

const vendorFeatures = [
  {
    icon: '📣',
    title: 'Tiếp Cận Hàng Nghìn Cặp Đôi',
    desc: 'Đưa thương hiệu của bạn đến với hàng nghìn cặp đôi đang lên kế hoạch đám cưới mỗi ngày.',
  },
  {
    icon: '🚀',
    title: 'Quảng Bá Dịch Vụ Hiệu Quả',
    desc: 'Tạo hồ sơ chuyên nghiệp, đăng tải portfolio và giới thiệu gói dịch vụ nổi bật của bạn.',
  },
  {
    icon: '📊',
    title: 'Quản Lý Khách Hàng Thông Minh',
    desc: 'Nhận yêu cầu, theo dõi đặt lịch và quản lý hợp đồng dễ dàng ngay trên nền tảng.',
  },
  {
    icon: '🌟',
    title: 'Xây Dựng Uy Tín & Thương Hiệu',
    desc: 'Thu thập đánh giá từ khách hàng thực để nâng cao uy tín và tạo sự khác biệt trên thị trường.',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FeatureCard({
  icon, title, desc, delay,
}: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  const { ref, inView } = useInView();
  const Icon = icon;
  return (
    <div
      ref={ref}
      className="group flex flex-col gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:scale-102 transition-all duration-500 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, background 0.3s, scale 0.3s`,
      }}
    >
      <div className="mb-2">
        <Icon className="w-12 h-12 text-amber-300" />
      </div>
      <h3 className="font-serif text-3xl mb-4 text-white">
        {title}
      </h3>
      <p className="text-white/80 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function ConnectSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [dividerVisible, setDividerVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadingVisible(true); }, { threshold: 0.3 });
    if (headingRef.current) obs.observe(headingRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setDividerVisible(true); }, { threshold: 0.5 });
    if (dividerRef.current) obs.observe(dividerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-linear-to-br from-rose-900 via-purple-900 to-indigo-900">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-pink-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-16"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* <p className="text-rose-300 font-semibold tracking-widest uppercase text-sm mb-3">Nền Tảng Kết Nối</p> */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-5">
            <div className="text-amber-300 pb-5">Chúng Tôi — KẾT NỐI</div> <br className="hidden md:block" />
            Cặp Đôi & Nhà Cung Cấp
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            VỀ MỘT NHÀ xây dựng cầu nối tin cậy giữa những cặp đôi đang mơ ước về đám cưới hoàn hảo
            và hàng trăm nhà cung cấp dịch vụ chuyên nghiệp, được xác minh.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-1 gap-10 items-start">
          {/* Couples Side */}
          <div>
            {/* <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👰🤵</span>
              <div>
                <h3 className="text-2xl font-bold text-white">Dành Cho Cặp Đôi</h3>
                <p className="text-rose-300 text-sm">Tìm kiếm nhà cung cấp uy tín, thương lượng giá tốt nhất</p>
              </div>
            </div> */}
            <div className="grid sm:grid-cols-2 gap-4">
              {coupleFeatures.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 120} />
              ))}
            </div>
          </div>

          {/* Divider */}
          {/* <div
            ref={dividerRef}
            className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div
              className="flex flex-col items-center gap-3"
              style={{
                opacity: dividerVisible ? 1 : 0,
                transform: dividerVisible ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
              }}
            >
              <div className="w-px h-20 bg-linear-to-b from-transparent via-white/40 to-transparent" />
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg animate-pulse-slow">
                🔗
              </div>
              <div className="w-px h-20 bg-linear-to-b from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* Vendors Side
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-2xl font-bold text-white">Dành Cho Nhà Cung Cấp</h3>
                <p className="text-indigo-300 text-sm">Kết nối hàng nghìn cặp đôi, quảng bá thương hiệu</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {vendorFeatures.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 120 + 200} />
              ))}
            </div>
          </div> */}
        </div>

        {/* Bottom CTA banner */}
        <div
          className="mt-16 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center"
          style={{ animation: 'fadeSlideUp 0.8s ease 0.4s both' }}
        >
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Tham Gia Ngay Hôm Nay</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Hơn <span className="text-amber-300 text-4xl font-serif">50+</span> nhà cung cấp uy tín đang chờ bạn
          </h3>
          <p className="text-white/70 max-w-xl mx-auto mb-6">
            Từ chụp ảnh cưới, trang điểm cô dâu, nhà hàng tiệc cưới đến âm nhạc, trang trí — tất cả đều được xác minh chất lượng và sẵn sàng phục vụ đám cưới của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/vendor"
              className="bg-linear-to-r from-rose-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Tìm Nhà Cung Cấp
            </Link>
            <Link
              href="/login"
              className="bg-linear-to-r from-purple-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Đăng Ký Thành Viên
            </Link>
          </div>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
