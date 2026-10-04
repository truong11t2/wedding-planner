import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { DISPLAY } from './primitives';

const SIDE = [
  { label: 'Tổng quan', href: '/dashboard' },
  { label: 'Kế hoạch cưới', href: '/timeline' },
  { label: 'Ngân sách', href: '/budget' },
  { label: 'Khách mời', href: '/guests' },
  { label: 'Thiệp cưới', href: '/invitation' },
  { label: 'Nhà cung cấp', href: '/vendor' },
];
const TASKS = [
  { t: 'Chọn địa điểm', done: true },
  { t: 'Xác nhận khách mời', done: true },
  { t: 'Duyệt menu', done: false },
  { t: 'Thiết kế thiệp cưới', done: false },
];

function Stat({ label, value, bar }: { label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-xl border border-rose-100 bg-white p-3">
      <p className="text-[11px] text-slate-600">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">{value}</p>
      {bar !== undefined && (
        <div className="mt-2 h-1.5 rounded-full bg-rose-100">
          <div className="h-full rounded-full bg-linear-to-r from-rose-600 to-purple-700" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}

// Illustrative sample data only.
export function DashboardMock({ large = false }: { large?: boolean }) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl shadow-rose-600/10">
      <ul className="hidden w-32 shrink-0 flex-col gap-1 border-r border-rose-100 bg-rose-50/70 p-3 text-[11px] sm:flex">
        {SIDE.map((s, i) => (
          <li key={s.label}>
            <Link href={s.href} className={`block rounded-lg px-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 ${i === 0 ? 'bg-white font-semibold text-pink-800 shadow-sm' : 'text-pink-700 hover:bg-white/70 hover:text-pink-800'}`}>{s.label}</Link>
          </li>
        ))}
      </ul>
      <div role="img" aria-label="Giao diện bảng điều khiển Về Một Nhà: đếm ngược, ngân sách, khách mời, checklist và timeline" className="min-w-0 flex-1 p-4">
        <div className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-xs">
          <span className="font-semibold text-slate-900">Còn 128 ngày</span>
          <span className="text-slate-600">20.10.2026</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Ngân sách" value="150tr đ" />
          <Stat label="Đã chi" value="82.5tr đ" bar={55} />
          <Stat label="Khách mời" value="168" bar={85} />
        </div>
        {large && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-rose-100 p-3">
              <p className="text-xs font-semibold text-slate-900">Checklist hôm nay</p>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                {TASKS.map((x) => (
                  <li key={x.t} className="flex items-center gap-2">
                    <span className={`flex size-4 items-center justify-center rounded-full border ${x.done ? 'border-pink-600 bg-pink-600 text-white' : 'border-rose-200'}`}>
                      {x.done && <Check className="size-3" aria-hidden="true" />}
                    </span>
                    <span className={x.done ? 'text-slate-900' : 'text-slate-600'}>{x.t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-100 p-3">
              <p className="text-xs font-semibold text-slate-900">Timeline</p>
              <ul className="mt-2 space-y-1.5 border-l border-rose-200 pl-3 text-[11px] text-slate-600">
                <li>Hôm nay · Chuẩn bị</li><li>Còn 3 tháng · Gửi thiệp mời</li><li>20.10 · Ngày cưới</li>
              </ul>
            </div>
            <div className="rounded-xl border border-rose-100 bg-linear-to-br from-rose-50 to-white p-3 md:col-span-2">
              <p className="text-xs font-semibold text-slate-900">Thiệp cưới</p>
              <p className={`${DISPLAY} mt-1 text-sm text-pink-600`}>Minh Anh &amp; Thùy Linh</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function InvitationPhone({ className = '' }: { className?: string }) {
  return (
    <div className={`w-36 rounded-[2rem] border-[6px] border-slate-900 bg-white p-2 shadow-2xl sm:w-40 ${className}`}>
      <div className="relative flex aspect-9/17 flex-col overflow-hidden rounded-[1.4rem] bg-white">
        <Image
          src="/images/homepage/invitation-card.svg"
          alt="Thiệp cưới online mẫu: trân trọng kính mời, Minh Anh và Thùy Linh, 20.10.2026"
          fill
          unoptimized
          sizes="(min-width: 640px) 160px, 144px"
          className="object-cover"
        />
        <Link href="/invitation#select" className="absolute inset-x-0 bottom-0 flex justify-center pb-3">
          <span className="rounded-full bg-linear-to-r from-pink-600 to-purple-700 px-4 py-1 text-[10px] font-semibold text-white">Tạo thiệp</span>
        </Link>
      </div>
    </div>
  );
}
