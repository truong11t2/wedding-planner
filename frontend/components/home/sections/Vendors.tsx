import Image from 'next/image';
import { HOME_ROUTES, VENDOR_CATEGORIES } from '../home-content';
import { ButtonLink, DISPLAY, SectionHeading } from './primitives';

export default function Vendors() {
  return (
    <section id="vendors" aria-labelledby="vendors-title" className="scroll-mt-20 bg-rose-50/50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading center id="vendors-title" title="Kết nối với những nhà cung cấp uy tín" />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {VENDOR_CATEGORIES.map((v) => (
            <li key={v.label} className="flex flex-col items-center gap-3 text-center">
              {v.imageUrl ? (
                <Image src={v.imageUrl} alt="" width={96} height={96} loading="lazy" className="size-24 rounded-full object-cover ring-4 ring-white" />
              ) : (
                <span aria-hidden="true" className={`${DISPLAY} flex size-24 items-center justify-center rounded-full text-3xl text-white ring-4 ring-white`}
                  style={{ background: `linear-gradient(135deg, hsl(${v.hue} 65% 62%), hsl(${v.hue} 55% 46%))` }}>{v.label[0]}</span>
              )}
              <span className="text-sm text-slate-800">{v.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center"><ButtonLink href={HOME_ROUTES.vendors} variant="outline">Xem tất cả nhà cung cấp</ButtonLink></div>
      </div>
    </section>
  );
}
