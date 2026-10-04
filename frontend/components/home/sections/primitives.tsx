import Link from 'next/link';
import type { ReactNode } from 'react';

export const DISPLAY = 'font-[family-name:var(--font-display)]';

const BASE = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700';
const VARIANTS = {
  primary: 'bg-linear-to-r from-rose-600 to-purple-700 text-white shadow-md shadow-pink-600/25 hover:shadow-lg',
  outline: 'border border-pink-300 bg-white/80 text-pink-600 hover:border-pink-500 hover:bg-white',
  light: 'bg-white text-pink-600 shadow-md hover:shadow-lg',
  ghost: 'border border-white/80 text-white hover:bg-white/15',
} as const;

export function ButtonLink({ href, variant = 'primary', children, className = '' }: { href: string; variant?: keyof typeof VARIANTS; children: ReactNode; className?: string }) {
  return <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>{children}</Link>;
}

export function SectionHeading({ id, title, sub, center = false }: { id: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 id={id} className={`${DISPLAY} text-3xl leading-tight text-slate-900 sm:text-4xl`}>{title}</h2>
      {sub && <p className="mt-3 leading-relaxed text-slate-600">{sub}</p>}
    </div>
  );
}
