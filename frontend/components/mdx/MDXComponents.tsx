import Image from 'next/image';
import Link from 'next/link';

export const MDXComponents = {
  h1: (props) => <h1 className="text-4xl font-bold text-gray-900 mb-6" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6" {...props} />,
  h3: (props) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
  p: (props) => <p className="text-gray-800 mb-6 leading-relaxed" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-6 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />,
  li: (props) => <li className="text-gray-800" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-pink-500 pl-4 italic my-6 text-gray-700" {...props} />
  ),
  strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
  em: (props) => <em className="italic text-gray-800" {...props} />,
  a: (props) => (
    <Link 
      {...props} 
      className="text-pink-600 hover:text-pink-700 underline"
      href={props.href || '#'}
    />
  ),
  img: (props) => (
    <span className="block relative w-full h-[400px] my-8 rounded-lg overflow-hidden">
      <Image
        {...props}
        alt={props.alt || ''}
        fill
        className="object-cover"
      />
    </span>
  ),
};