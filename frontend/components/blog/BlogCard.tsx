import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  coverImage: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-pink-100 hover:shadow-xl transition-all hover:scale-[1.02] group">
      <Link href={`/blog/${post.slug}`} className="cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-pink-600 font-semibold">{post.date}</p>
            <span className="text-sm text-gray-500">{post.author}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
          <span className="flex items-center gap-2 text-pink-600 font-semibold group-hover:text-pink-700">
            Read More 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  );
}