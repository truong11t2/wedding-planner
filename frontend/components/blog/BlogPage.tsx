import React from 'react';
import BlogCard from './BlogCard';

const blogPosts = [
  { 
    id: 'budget-friendly-weddings',
    title: '10 Tips for Budget-Friendly Weddings', 
    date: 'October 1, 2025', 
    excerpt: 'Planning a beautiful wedding without breaking the bank is possible with these expert tips and tricks.',
    author: 'Sarah Johnson',
    image: 'from-pink-200 to-purple-200'
  },
  { 
    id: 'choosing-venue',
    title: 'Choosing Your Perfect Venue', 
    date: 'September 28, 2025', 
    excerpt: 'Find the venue that matches your dream wedding vision with this comprehensive guide.',
    author: 'Michael Chen',
    image: 'from-purple-200 to-pink-200'
  },
  { 
    id: 'wedding-photography',
    title: 'Wedding Photography Guide', 
    date: 'September 25, 2025', 
    excerpt: 'How to capture those perfect moments on your special day with the right photographer and planning.',
    author: 'Emily Rodriguez',
    image: 'from-pink-200 to-rose-200'
  },
  { 
    id: 'seasonal-themes',
    title: 'Seasonal Wedding Themes', 
    date: 'September 20, 2025', 
    excerpt: 'Make the most of your wedding season with these beautiful and creative theme ideas.',
    author: 'David Park',
    image: 'from-rose-200 to-purple-200'
  },
  { 
    id: 'stress-free-planning',
    title: 'Stress-Free Wedding Planning', 
    date: 'September 15, 2025', 
    excerpt: 'Stay calm and organized throughout your planning journey with these practical strategies.',
    author: 'Lisa Anderson',
    image: 'from-purple-200 to-pink-200'
  },
  { 
    id: 'destination-weddings',
    title: 'Destination Wedding Ideas', 
    date: 'September 10, 2025', 
    excerpt: 'Dream destinations for your perfect wedding celebration and tips for planning abroad.',
    author: 'James Wilson',
    image: 'from-pink-200 to-purple-200'
  }
];

export default function BlogPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Wedding Planning Blog
        </h2>
        <p className="text-gray-600 text-lg">
          Tips, ideas, and inspiration for your perfect day
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}