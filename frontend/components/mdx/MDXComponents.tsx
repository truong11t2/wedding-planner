import Image from 'next/image';
import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';
import Tabs from './Tabs';
import Accordion, { AccordionItem } from './Accordion';
import Iframe from './Iframe';
import Slideshow from './Slideshow';
import PhotoGallery from './PhotoGallery';

export const MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="text-4xl font-bold text-gray-900 mb-6" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="text-gray-800 mt-3 mb-2 leading-relaxed" {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc list-inside mb-6 space-y-2" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="text-gray-800" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-pink-500 pl-4 italic my-6 text-gray-700" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold text-gray-900" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em className="italic text-gray-800" {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => {
    const href = (props.href as string) || '#';
    const className = ['text-pink-600 hover:text-pink-700 underline', (props.className as string) || '']
      .filter(Boolean)
      .join(' ');
    const isExternal = typeof href === 'string' && (
      href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')
    );

    if (isExternal) {
      const { href: _href, className: _cn, ...rest } = props;
      return (
        <a
          {...rest}
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        />
      );
    }

    return (
      <Link href={href} className={className} {...props} />
    );
  },
  img: (props: ComponentPropsWithoutRef<'img'>) => (
    <span className="block w-full my-8 rounded-lg overflow-hidden">
      <Image
        src={props.src as string || ''}
        alt={props.alt || ''}
        width={1200}
        height={800}
        className="w-full h-auto object-cover"
      />
    </span>
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => <tbody className="divide-y divide-gray-200 bg-white" {...props} />,
  tr: (props: ComponentPropsWithoutRef<'tr'>) => <tr {...props} />,
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300 last:border-r-0" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0" {...props} />
  ),
  Iframe,
  Slideshow,
  Tabs,
  Accordion, AccordionItem,
  Image,
  PhotoGallery,
};