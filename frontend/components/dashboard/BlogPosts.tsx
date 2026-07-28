'use client';

import React from 'react';
import { ExternalLink, Clock, User, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  link: string;
  publishedAt: string;
}

export default function BlogPosts() {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Lịch Trình Chi Tiết: Chìa Khóa Cho Đám Cưới Hoàn Hảo',
      excerpt: '85% đám cưới gặp vấn đề về quản lý thời gian? Từ việc đặt dịch vụ quá muộn, quên deadline quan trọng, đến việc vội vàng trong những ngày cuối cùng.',
      author: 'Về Một Nhà',
      readTime: '4 phút',
      category: 'Kế Hoạch',
      image: '/images/blog/lich-trinh-dam-cuoi-chi-tiet.jpg',
      link: '/blog/lich-trinh-chi-tiet-dam-cuoi',
      publishedAt: '2026-07-25'
    },
    {
      id: '2',
      title: 'Phong Cách Chụp Ảnh Cưới: Bạn Thuộc Về Style Nào?',
      excerpt: 'Giữa hàng trăm sự chuẩn bị, việc chọn một phong cách chụp ảnh cưới phù hợp không chỉ giúp bạn lưu giữ kỷ niệm mà còn thể hiện cá tính riêng của hai bạn.',
      author: 'Về Một Nhà',
      readTime: '3 phút',
      category: 'Chụp Hình',
      image: '/images/blog/phong-cach-anh-cuoi/cover.jpg',
      link: '/blog/cac-phong-cach-chup-anh-cuoi',
      publishedAt: '2026-07-22'
    },
    {
      id: '3',
      title: 'Hướng Dẫn Chi Tiết: Lập Kế Hoạch Đám Cưới',
      excerpt: 'Bạn vừa nhận lời cầu hôn và đang trong cơn "mây mưa" hạnh phúc? Tuyệt vời! Nhưng sau đó, bạn nhận ra rằng việc lập kế hoạch đám cưới không hề đơn giản như bạn tưởng.',
      author: 'Về Một Nhà',
      readTime: '5 phút',
      category: 'Kế Hoạch',
      image: '/images/blog/plan-wedding.jpg',
      link: '/blog/huong-dan-lap-ke-hoach-dam-cuoi',
      publishedAt: '2026-07-12'
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-800',
      'Budget': 'bg-green-100 text-green-800',
      'Venues': 'bg-purple-100 text-purple-800',
      'Photography': 'bg-pink-100 text-pink-800',
      'Attire': 'bg-yellow-100 text-yellow-800',
      'Catering': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* <Heart className="h-6 w-6 text-pink-500 mr-2" /> */}
          <h2 className="text-xl font-semibold text-gray-900">Bài Viết Hữu Ích</h2>
        </div>
        <Link
          href="/blog"
          className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center"
        >
          Xem tất cả
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <Image
                src={post.image}
                alt={post.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2 line-clamp-2">
                <a href={post.link}>{post.title}</a>
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {post.author}
                </div>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}