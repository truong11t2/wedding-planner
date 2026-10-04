import Link from 'next/link';
import { CalendarCheck, Mail, Store, Users, Wallet } from 'lucide-react';
import { FEATURES, type IconName } from '../home-content';
import { SectionHeading } from './primitives';

const ICONS: Record<IconName, typeof Mail> = { calendar: CalendarCheck, wallet: Wallet, users: Users, mail: Mail, store: Store };

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading center id="features-title" title="Tất cả trong một nền tảng"
          sub="Từ những kế hoạch nhỏ nhất đến những khoảnh khắc trọng đại, Về Một Nhà luôn đồng hành cùng bạn." />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-pink-100">
          {FEATURES.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <li key={f.title} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <Link href={f.href} className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700">
                  <div className="flex items-center gap-4 sm:block">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600 transition-colors group-hover:bg-pink-100"><Icon className="size-6" aria-hidden="true" /></span>
                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-pink-700 sm:mt-4">{f.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
