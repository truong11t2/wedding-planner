'use client';

import { useEffect, useRef, useState } from 'react';

type SplitTextAnimationProps = {
  /** The text to animate. Words are split on spaces; each character animates individually. */
  text?: string;
  /** Words (without punctuation) that should render with the gold gradient. */
  goldWords?: string[];
  /** Delay between each letter's start, in ms. */
  letterDelayMs?: number;
  /** How long each letter's own rise animation takes, in ms. */
  animationDurationMs?: number;
  /** Extra pause after the full line finishes before it loops, in ms. */
  pauseMs?: number;
  /** Whether the animation should loop automatically. */
  loop?: boolean;
  /** Optional className applied to the outer wrapper. */
  className?: string;
};

export default function SplitTextAnimation({
  text = 'ĐƠN GIẢN - SANG TRỌNG - SÁNG TẠO',
  goldWords = ['ĐƠN', 'GIẢN', 'TRỌNG', 'TẠO'],
  letterDelayMs = 130,
  animationDurationMs = 500,
  pauseMs = 1400,
  loop = true,
  className,
}: SplitTextAnimationProps) {
  const [playKey, setPlayKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = text.split(' ');
  const normalize = (w: string) =>
    w.replace(/[^\p{L}]/gu, '').toLowerCase();
  const goldSet = new Set(goldWords.map(normalize));

  // Total non-space characters, used to time the loop restart.
  const charCount = text.replace(/ /g, '').length;
  const totalDurationMs =
    (charCount - 1) * letterDelayMs + animationDurationMs + pauseMs;

  useEffect(() => {
    if (!loop) return;
    timeoutRef.current = setTimeout(() => {
      setPlayKey((k) => k + 1);
    }, totalDurationMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [playKey, loop, totalDurationMs]);

  const replay = () => setPlayKey((k) => k + 1);

  let globalIndex = 0;

  return (
    <div className={className}>
      <div className="split-text-stage">
        <div className="split-text-line" key={playKey}>
          {words.map((word, wIdx) => (
            <span className="split-text-word" key={wIdx}>
              {[...word].map((ch, cIdx) => {
                const isGold = goldSet.has(normalize(word));
                const isDash = ch === '-';
                const delay = globalIndex * letterDelayMs;
                globalIndex += 1;
                return (
                  <span
                    key={cIdx}
                    className={[
                      'split-text-char',
                      isDash ? 'is-dash' : '',
                      isGold ? 'is-gold' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      animationDelay: `${delay}ms`,
                      animationDuration: `${animationDurationMs}ms`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
        <span className="split-text-underline" key={`underline-${playKey}`} />
      </div>

      {!loop && (
        <button type="button" className="split-text-replay" onClick={replay}>
          Xem lại
        </button>
      )}

      <style jsx>{`
        .split-text-stage {
          position: relative;
          width: 100%;
          text-align: center;
          padding: 24px 16px;
        }

        .split-text-line {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          letter-spacing: 0.12em;
          line-height: 1.3;
          color: var(--split-text-color, #f3e9d8);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0 0.35em;
          font-size: clamp(1.6rem, 6vw, 3.4rem);
        }

        .split-text-word {
          display: inline-flex;
        }

        .split-text-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) rotateX(-50deg);
          transform-origin: 50% 100%;
          filter: blur(4px);
          animation-name: split-text-rise;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: forwards;
        }

        .split-text-char.is-dash {
          color: var(--split-text-accent, #d9b46a);
          margin: 0 0.15em;
        }

        .split-text-char.is-gold {
          color: var(--split-text-accent, #fcd34d);
        }

        @keyframes split-text-rise {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
          }
        }

        .split-text-underline {
          display: block;
          margin: 22px auto 0;
          width: 220px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--split-text-accent, #d9b46a),
            transparent
          );
          animation: split-text-grow 1.4s ease forwards;
          animation-delay: 1.1s;
          transform: scaleX(0);
          transform-origin: center;
        }

        @keyframes split-text-grow {
          to {
            transform: scaleX(1);
          }
        }

        .split-text-replay {
          display: block;
          margin: 12px auto 0;
          background: transparent;
          border: 1px solid rgba(217, 180, 106, 0.4);
          color: var(--split-text-accent-light, #f3dfae);
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          padding: 9px 18px;
          border-radius: 999px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .split-text-replay:hover {
          opacity: 1;
          border-color: var(--split-text-accent, #d9b46a);
        }
      `}</style>
    </div>
  );
}