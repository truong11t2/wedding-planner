import { Play } from 'lucide-react';
import { HOME_ROUTES } from '../home-content';
import { ButtonLink, SectionHeading } from './primitives';
import { DashboardMock, InvitationPhone } from './Mockups';

export default function ProductExperience() {
  return (
    <section id="demo" aria-labelledby="product-title" className="scroll-mt-20 bg-rose-50/60 py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.4fr] lg:px-8">
        <div>
          <SectionHeading id="product-title" title="Quản lý đám cưới của bạn như một chuyên gia"
            sub="Giao diện thân thiện, dễ sử dụng trên mọi thiết bị. Hai bạn có thể theo dõi tiến độ, chi phí, khách mời và nhiều hơn thế ngay từ điện thoại của mình." />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#features">Khám phá tính năng</ButtonLink>
            <ButtonLink href={HOME_ROUTES.signup} variant="outline"><Play className="size-4" aria-hidden="true" /> Xem demo</ButtonLink>
          </div>
        </div>
        <div className="relative pb-12 sm:pr-16">
          <DashboardMock large />
          <InvitationPhone className="absolute -bottom-2 right-0 sm:block" />
        </div>
      </div>
    </section>
  );
}
