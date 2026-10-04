import { type ReactNode } from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

interface SharedFeatureCardProps {
  icon: ReactNode;
  title?: string;
  desc?: string;
  delay?: number;
  text?: string;
  link?: string;
  className?: string;
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
  if (title && desc) {
    const content = (
      <div
        className={`group flex flex-col gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:scale-102 transition-all duration-300 cursor-default ${className}`}
      >
        <div className="mb-2 flex items-center gap-4 text-amber-300">
          {icon}
          <h3 className="font-serif text-3xl">{title}</h3>
        </div>
        <p className="text-white/80 leading-relaxed">{desc}</p>
      </div>
    );

    return (
      <Reveal delay={delay} className="h-full">
        {link ? <Link href={link}>{content}</Link> : content}
      </Reveal>
    );
  }

  const content = (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-pink-100 hover:border-pink-200 transition-all hover:shadow-lg cursor-pointer">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-full text-pink-600">
          {icon}
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