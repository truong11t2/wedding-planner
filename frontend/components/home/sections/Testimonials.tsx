import Image from 'next/image';
import { TESTIMONIALS, type Testimonial } from '../home-content';
import { DISPLAY, SectionHeading } from './primitives';

function Avatar({ t }: { t: Testimonial }) {
  if (t.avatarUrl) return <Image src={t.avatarUrl} alt="" width={48} height={48} loading="lazy" className="size-12 rounded-full object-cover" />;
  return (
    <span aria-hidden="true" className={`${DISPLAY} flex size-12 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-rose-50 text-lg text-pink-600`}>{t.couple[0]}</span>
  );
}

export default function Testimonials({ items = TESTIMONIALS }: { items?: Testimonial[] }) {
  return (
    <section aria-labelledby="testimonials-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="testimonials-title" title="Hơn 50+ cặp đôi đã có đám cưới trong mơ cùng Về Một Nhà" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.id}>
              <figure className="flex h-full flex-col rounded-2xl border border-rose-100 bg-[#fffaf8] p-6">
                <blockquote className="flex-1 leading-relaxed text-slate-800">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar t={t} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.couple}</p>
                    <p className="text-xs text-slate-600">{t.location}</p>
                    <p className="mt-1 text-amber-600" role="img" aria-label={`${t.rating} trên 5 sao`}>{'★'.repeat(t.rating)}</p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
