import { TIMELINE } from '../home-content';
import { DISPLAY, SectionHeading } from './primitives';

export default function PlanningTimeline() {
  return (
    <section aria-labelledby="timeline-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="timeline-title" title="Lên kế hoạch đám cưới theo từng giai đoạn"
          sub="Chúng tôi đã chuẩn bị sẵn lộ trình chi tiết, phù hợp với mọi phong cách và ngân sách." />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TIMELINE.map((s) => (
            <li key={s.period} className="rounded-2xl border border-rose-100 bg-[#fffaf8] p-5 transition hover:border-rose-300 hover:bg-rose-50">
              <p className={`${DISPLAY} text-xl text-pink-600`}>{s.period}</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">{s.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {s.tasks.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true" className="text-rose-600">•</span>{t}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
