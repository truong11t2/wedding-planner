import { HOME_ROUTES } from '../home-content';
import { ButtonLink, DISPLAY } from './primitives';

export default function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-linear-to-br from-rose-600 to-purple-700 py-16 text-white lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="cta-title" className={`${DISPLAY} text-3xl sm:text-4xl`}>Bắt đầu hành trình của bạn</h2>
        <p className="mt-4 leading-relaxed text-white/95">Để Về Một Nhà giúp bạn chuẩn bị đám cưới dễ dàng hơn, từ những kế hoạch đầu tiên đến ngày trọng đại.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={HOME_ROUTES.signup} variant="light">Dành cho cặp đôi — Bắt đầu miễn phí</ButtonLink>
          <ButtonLink href={HOME_ROUTES.vendorSignup} variant="ghost">Dành cho nhà cung cấp — Liên hệ ngay</ButtonLink>
        </div>
      </div>
    </section>
  );
}
