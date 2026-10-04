import { Headset, Play, ShieldCheck, Smile } from 'lucide-react';
import HeroExperience from '@/components/home/HeroExperience';
import { ButtonLink, DISPLAY } from './primitives';
import { DashboardMock, InvitationPhone } from './Mockups';

const TRUST = [
  { Icon: ShieldCheck, label: 'Miễn phí 100%' },
  { Icon: Smile, label: 'Dễ sử dụng' },
  { Icon: Headset, label: 'Hỗ trợ 24/7' },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-linear-to-b from-rose-50 via-[#fffaf8] to-[#fffaf8]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-8 lg:py-20">
        <div className="motion-safe:animate-fadeInUp">
          <p className="inline-block rounded-full border border-rose-100 bg-white/80 px-3 py-1 text-xs text-rose-800">Nền tảng quản lý đám cưới toàn diện</p>
          <h1 id="hero-title" className={`${DISPLAY} mt-5 text-4xl leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.4rem]`}>
            Chuẩn bị đám cưới dễ dàng hơn cùng
            <span className="text-pink-600"> Về Một Nhà</span>
          </h1>
          <p className="mt-5 max-w-lg leading-relaxed text-slate-600">
            Lập kế hoạch, quản lý ngân sách, khách mời và tạo thiệp cưới online — tất cả trong một nơi để hai bạn tập trung tận hưởng hành trình về chung một nhà.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <HeroExperience />
            <ButtonLink href="#demo" variant="outline"><Play className="size-4" aria-hidden="true" /> Xem cách hoạt động</ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
            {TRUST.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2"><Icon className="size-4 text-pink-600" aria-hidden="true" />{label}</li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-xl pb-10 lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_70%_20%,var(--color-pink-100),transparent_70%)]" />
          <DashboardMock />
          <InvitationPhone className="absolute -bottom-2 right-2 sm:right-6" />
        </div>
      </div>
    </section>
  );
}
