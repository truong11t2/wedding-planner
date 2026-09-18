'use client';

import React, { type ElementType, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type IconValue = ElementType | string;

interface SharedFeatureCardProps {
  icon: IconValue;
  title?: string;
  desc?: string;
  delay?: number;
  text?: string;
  link?: string;
  className?: string;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function FeatureCard({
  icon,
  title,
  desc,
  delay = 0,
  text,
  link,
  className = '',
}: SharedFeatureCardProps) {
  const { ref, inView } = useInView();

  if (title && desc) {
    const Icon = icon as ElementType;

    const content = (
      <div
        ref={ref}
        className={`group flex flex-col gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:scale-102 transition-all duration-500 cursor-default ${className}`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, background 0.3s, scale 0.3s`,
        }}
      >
        <div className="mb-2 flex items-center gap-4 text-amber-300">
          {typeof icon === 'string' ? (
            <span className="w-10 h-10 shrink-0 flex items-center justify-center text-3xl">{icon}</span>
          ) : (
            <Icon className="w-10 h-10 shrink-0" />
          )}
          <h3 className="font-serif text-3xl">{title}</h3>
        </div>
        <p className="text-white/80 leading-relaxed">{desc}</p>
      </div>
    );

    return link ? <Link href={link}>{content}</Link> : content;
  }

  const Icon = icon as ElementType;

  const content = (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-pink-100 hover:border-pink-200 transition-all hover:shadow-lg cursor-pointer">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-full">
          {typeof icon === 'string' ? (
            <span className="w-6 h-6 text-pink-600 flex items-center justify-center">{icon}</span>
          ) : (
            <Icon className="w-6 h-6 text-pink-600" />
          )}
        </div>
        <p className="font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}