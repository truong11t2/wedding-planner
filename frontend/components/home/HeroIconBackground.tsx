'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';

export type HeroIconVariant = 'planner' | 'invitation';

/** Ảnh SVG lớn đại diện cho từng chủ đề (nằm trong /public/images/homepage/hero). */
const heroIconSrcs: Record<HeroIconVariant, string> = {
  planner: '/images/homepage/hero/wedding-planning.svg',
  invitation: '/images/homepage/hero/wedding-invitation.svg',
};

/** Một hình hoạt hình nhỏ (doodle) rải quanh nền. */
interface Doodle {
  Icon: LucideIcon;
  /** Lớp Tailwind định vị + ẩn/hiện theo breakpoint (giữ chuỗi literal để Tailwind quét được). */
  position: string;
  size: number;
  rotate: number;
  /** Màu fill/stroke của doodle. */
  color: string;
  /** Quầng sáng phía sau doodle. */
  glow: string;
  floatDelay: number;
  floatDuration: number;
}

interface HeroTheme {
  background: string;
  glow: string;
  /**
   * Màu cho icon lớn: SVG được dùng làm mask nên `currentColor`
   * (tức class `text-*` này) quyết định màu hiển thị.
   */
  heroIconClass: string;
  heroHalo: string;
  doodles: Doodle[];
}

const themes: Record<HeroIconVariant, HeroTheme> = {
  // Slide 2 — Lập kế hoạch đám cưới: icon lớn là sổ kế hoạch có checklist
  planner: {
    background:
      'linear-gradient(160deg, #4C0519 0%, #581C87 52%, #1E1B4B 100%)',
    glow: 'radial-gradient(circle at 50% 42%, rgba(244, 114, 182, 0.3) 0%, rgba(88, 28, 135, 0) 64%)',
    heroIconClass: 'text-rose-100/[0.14]',
    heroHalo: 'bg-rose-400/25',
    doodles: [
      // {
      //   Icon: Cake,
      //   position: 'hidden md:block left-[5%] top-[14%]',
      //   size: 66,
      //   rotate: -8,
      //   color: 'text-rose-200/75',
      //   glow: 'bg-rose-400/25',
      //   floatDelay: 0,
      //   floatDuration: 7,
      // },
      // {
      //   Icon: Flower2,
      //   position: 'hidden lg:block right-[6%] top-[12%]',
      //   size: 80,
      //   rotate: 7,
      //   color: 'text-amber-200/75',
      //   glow: 'bg-amber-400/25',
      //   floatDelay: 1.2,
      //   floatDuration: 8.5,
      // },
      // {
      //   Icon: Wine,
      //   position: 'hidden lg:block right-[8%] bottom-[15%]',
      //   size: 64,
      //   rotate: -6,
      //   color: 'text-emerald-200/70',
      //   glow: 'bg-emerald-400/20',
      //   floatDelay: 2.4,
      //   floatDuration: 7.5,
      // },
      // {
      //   Icon: Gift,
      //   position: 'hidden md:block left-[7%] bottom-[14%]',
      //   size: 60,
      //   rotate: 9,
      //   color: 'text-purple-200/70',
      //   glow: 'bg-purple-400/25',
      //   floatDelay: 3.1,
      //   floatDuration: 9,
      // },
      // {
      //   Icon: Bell,
      //   position: 'block right-[6%] top-[8%]',
      //   size: 44,
      //   rotate: 11,
      //   color: 'text-amber-200/65',
      //   glow: 'bg-amber-400/20',
      //   floatDelay: 1.8,
      //   floatDuration: 6.5,
      // },
      // {
      //   Icon: Heart,
      //   position: 'block left-[5%] bottom-[7%]',
      //   size: 40,
      //   rotate: -12,
      //   color: 'text-rose-200/65',
      //   glow: 'bg-rose-400/20',
      //   floatDelay: 0.9,
      //   floatDuration: 8,
      // },
    ],
  },
  // Slide 1 — Tạo thiệp cưới online: icon lớn là thiệp mở, nổi bật để hút người dùng
  invitation: {
    background:
      'linear-gradient(160deg, #581C87 0%, #831843 52%, #7C2D12 100%)',
    glow: 'radial-gradient(circle at 50% 42%, rgba(251, 191, 36, 0.28) 0%, rgba(131, 24, 67, 0) 64%)',
    heroIconClass: 'text-amber-100/[0.19]',
    heroHalo: 'bg-amber-300/30',
    doodles: [
      // {
      //   Icon: Send,
      //   position: 'hidden md:block left-[6%] top-[15%]',
      //   size: 68,
      //   rotate: -10,
      //   color: 'text-sky-200/75',
      //   glow: 'bg-sky-400/25',
      //   floatDelay: 0,
      //   floatDuration: 7.5,
      // },
      // {
      //   Icon: Flower2,
      //   position: 'hidden lg:block right-[6%] top-[13%]',
      //   size: 78,
      //   rotate: 8,
      //   color: 'text-rose-200/75',
      //   glow: 'bg-rose-400/25',
      //   floatDelay: 1.4,
      //   floatDuration: 8.5,
      // },
      // {
      //   Icon: Music,
      //   position: 'hidden lg:block left-[8%] bottom-[15%]',
      //   size: 62,
      //   rotate: -7,
      //   color: 'text-purple-200/70',
      //   glow: 'bg-purple-400/25',
      //   floatDelay: 2.6,
      //   floatDuration: 7,
      // },
      // {
      //   Icon: Gift,
      //   position: 'hidden md:block right-[8%] bottom-[14%]',
      //   size: 64,
      //   rotate: 7,
      //   color: 'text-amber-200/75',
      //   glow: 'bg-amber-400/25',
      //   floatDelay: 3.3,
      //   floatDuration: 9,
      // },
      // {
      //   Icon: Heart,
      //   position: 'block left-[5%] top-[8%]',
      //   size: 46,
      //   rotate: -9,
      //   color: 'text-rose-200/70',
      //   glow: 'bg-rose-400/20',
      //   floatDelay: 1.9,
      //   floatDuration: 6.5,
      // },
      // {
      //   Icon: Cake,
      //   position: 'block right-[6%] bottom-[7%]',
      //   size: 42,
      //   rotate: 10,
      //   color: 'text-amber-200/65',
      //   glow: 'bg-amber-400/20',
      //   floatDelay: 0.8,
      //   floatDuration: 8,
      // },
    ],
  },
};

/**
 * Nền hero dựng hoàn toàn bằng icon (không dùng ảnh chụp):
 * 1 icon SVG lớn đại diện chủ đề ở trung tâm + vài hình hoạt hình đám cưới rải quanh viền.
 */
export default function HeroIconBackground({
  variant,
}: {
  variant: HeroIconVariant;
}) {
  const theme = themes[variant];
  const heroIconSrc = heroIconSrcs[variant];

  // Dùng SVG làm mask + `backgroundColor: currentColor` để giữ nguyên hệ màu của theme
  // (màu fill gốc trong file SVG bị bỏ qua).
  const heroIconStyle: React.CSSProperties = {
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url("${heroIconSrc}")`,
    maskImage: `url("${heroIconSrc}")`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Gradient nền */}
      <div className="absolute inset-0" style={{ background: theme.background }} />

      {/* Vệt sáng trung tâm */}
      <div className="absolute inset-0" style={{ background: theme.glow }} />

      {/* Icon lớn đại diện chủ đề */}
      <div className="hero-emblem absolute left-1/2 top-1/2">
        <div
          className={`absolute -inset-[18%] rounded-full blur-3xl ${theme.heroHalo}`}
        />
        <div className="absolute -inset-[10%] rounded-full border border-white/10" />
        <div
          role="presentation"
          className={`relative h-[46vh] w-[46vh] max-h-100 max-w-100 md:h-[58vh] md:w-[58vh] md:max-h-135 md:max-w-135 ${theme.heroIconClass}`}
          style={heroIconStyle}
        />
      </div>

      {/* Hình hoạt hình đám cưới */}
      {theme.doodles.map(
        (
          { Icon, position, size, rotate, color, glow, floatDelay, floatDuration },
          index
        ) => (
          <div
            key={`${variant}-doodle-${index}`}
            className={`hero-doodle absolute ${position}`}
            style={
              {
                '--doodle-rotate': `${rotate}deg`,
                '--doodle-duration': `${floatDuration}s`,
                animationDelay: `${floatDelay}s`,
              } as React.CSSProperties
            }
          >
            <div className={`absolute -inset-3 rounded-full blur-2xl ${glow}`} />
            <Icon
              size={size}
              strokeWidth={1.4}
              fill="currentColor"
              fillOpacity={0.16}
              className={`relative ${color}`}
            />
          </div>
        )
      )}

      <style jsx>{`
        /* Icon lớn trôi rất chậm để nền không tĩnh */
        .hero-emblem {
          transform: translate(-50%, -50%);
          animation: heroEmblemDrift 22s ease-in-out infinite alternate;
        }
        @keyframes heroEmblemDrift {
          from {
            transform: translate(-50%, -50%) scale(1) rotate(-1.5deg);
          }
          to {
            transform: translate(-50%, -50%) scale(1.04) rotate(1.5deg);
          }
        }

        /* Hình hoạt hình lơ lửng */
        .hero-doodle {
          transform: rotate(var(--doodle-rotate, 0deg));
          animation: heroDoodleFloat var(--doodle-duration, 7s) ease-in-out infinite
            alternate;
          will-change: transform;
        }
        @keyframes heroDoodleFloat {
          from {
            transform: translate3d(0, 0, 0) rotate(var(--doodle-rotate, 0deg));
          }
          to {
            transform: translate3d(0, -18px, 0)
              rotate(calc(var(--doodle-rotate, 0deg) + 5deg));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-emblem,
          .hero-doodle {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
