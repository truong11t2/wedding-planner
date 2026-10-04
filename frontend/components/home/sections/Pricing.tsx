import { Check } from 'lucide-react';
import { HOME_ROUTES, PLANS } from '../home-content';
import { ButtonLink, DISPLAY, SectionHeading } from './primitives';

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 bg-[#fffaf8] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading center id="pricing-title" title="Linh hoạt theo nhu cầu của bạn" sub="Từ miễn phí đến cao cấp, bạn luôn có lựa chọn phù hợp." />
        <ul className="mx-auto mt-12 grid max-w-5xl items-start gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <li key={p.id} className={`relative rounded-2xl border bg-white p-6 ${p.featured ? 'border-rose-500 shadow-xl shadow-rose-600/10 md:-mt-3 md:pb-9' : 'border-rose-100'}`}>
              {p.badge && <span className="absolute -top-3 right-5 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">{p.badge}</span>}
              <h3 className={`${DISPLAY} text-xl text-slate-900`}>{p.name}</h3>
              <p className="mt-3"><span className="text-3xl font-bold text-slate-900">{p.priceLabel}</span> <span className="text-sm text-slate-600">{p.period}</span></p>
              <ul className="my-6 space-y-3 text-sm text-slate-700">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />{f}</li>)}
              </ul>
              <ButtonLink href={HOME_ROUTES.signup} variant={p.featured ? 'primary' : 'outline'} className="w-full">{p.cta}</ButtonLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
