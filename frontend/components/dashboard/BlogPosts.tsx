'use client';

import React from 'react';
import { ExternalLink, Clock, User, Heart } from 'lucide-react';

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
      title: 'How to Plan Your Wedding Timeline: A Complete Guide',
      excerpt: 'Learn the essential steps to create a stress-free wedding planning timeline that keeps you organized and on track.',
      author: 'Sarah Johnson',
      readTime: '8 min read',
      category: 'Planning',
      image: '/api/placeholder/300/200',
      link: '#',
      publishedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Budget-Friendly Wedding Ideas That Look Expensive',
      excerpt: 'Discover creative ways to have a beautiful wedding without breaking the bank. These tips will help you save thousands.',
      author: 'Mike Chen',
      readTime: '6 min read',
      category: 'Budget',
      image: '/api/placeholder/300/200',
      link: '#',
      publishedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Choosing the Perfect Wedding Venue: What to Consider',
      excerpt: 'From location to capacity, learn what factors matter most when selecting your dream wedding venue.',
      author: 'Emily Davis',
      readTime: '10 min read',
      category: 'Venues',
      image: '/api/placeholder/300/200',
      link: '#',
      publishedAt: '2024-01-10'
    },
    {
      id: '4',
      title: 'Wedding Photography Styles Explained',
      excerpt: 'Understanding different photography styles will help you choose the perfect photographer for your special day.',
      author: 'David Kim',
      readTime: '7 min read',
      category: 'Photography',
      image: '/api/placeholder/300/200',
      link: '#',
      publishedAt: '2024-01-08'
    }
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
          <Heart className="h-6 w-6 text-pink-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Wedding Planning Blog</h2>
        </div>
        <a
          href="#"
          className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center"
        >
          View All
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
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
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
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