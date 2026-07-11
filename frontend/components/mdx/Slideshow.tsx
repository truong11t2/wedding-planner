"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  height?: number | string;
  width?: number | string;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
};

export default function Slideshow({
  images,
  autoPlay = true,
  interval = 4000,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  function restartTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!autoPlay || images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
  }

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoPlay, interval, images.length]);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
    restartTimer();
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
    restartTimer();
  }

  return (
    <div className={`relative ${className}`}>
        <div className="rounded-md overflow-hidden mx-auto flex justify-center items-center max-h-[720px]">
          <img src={images[index]} alt={`slide-${index}`} className="h-full max-h-[720px] w-auto object-center" />
        </div>

      {images.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? "bg-pink-600" : "bg-white/80"} shadow`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
