'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTimeline } from '@/context/TimelineContext';
import { useRouter } from 'next/navigation';
import TimelineProgress from '@/components/dashboard/TimelineProgress';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import MilestoneTracker from '@/components/dashboard/MilestoneTracker';
import BlogPosts from '@/components/dashboard/BlogPosts';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const { timelineItems, weddingDate } = useTimeline();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, [isLoggedIn, router]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getDaysUntilWedding = () => {
    if (!weddingDate) return null;
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilWedding = getDaysUntilWedding();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h1>
          <p className="text-gray-600">Bạn cần đăng nhập để xem kế hoạch đám cưới của mình.</p>
          <Link
            href="/login"
            className="inline-flex items-center mt-4 px-5 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {user?.lastName || 'bạn'}!
            </h1>
            <p className="text-gray-600 mt-2">
              {weddingDate ? (
                daysUntilWedding !== null ? (
                  daysUntilWedding > 0 ? (
                    <>
                      {/* Your wedding is on {formatDate(weddingDate)} - 
                      <span className="font-semibold text-pink-600 ml-1">
                        {daysUntilWedding} days to go!
                      </span> */}
                    </>
                  ) : daysUntilWedding === 0 ? (
                    <span className="font-bold text-pink-600">
                      🎉 Hôm nay là ngày cưới của bạn! Chúc mừng! 🎉
                    </span>
                  ) : (
                    <>
                      Hy vọng bạn đã có một đám cưới tuyệt vời vào ngày {formatDate(weddingDate)}!
                    </>
                  )
                ) : (
                  'Bảng điều khiển kế hoạch đám cưới của bạn'
                )
              ) : (
                'Đặt ngày cưới của bạn để bắt đầu lên kế hoạch'
              )}
            </p>
          </div>
          
          {weddingDate && (
            <div className="hidden sm:flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-pink-500 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Ngày cưới</div>
                    <div className="font-semibold">{formatDate(weddingDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <DashboardStats 
        timelineItems={timelineItems}
        weddingDate={weddingDate}
        daysUntilWedding={daysUntilWedding}
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Timeline Progress - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <TimelineProgress timelineItems={timelineItems} />
        </div>
        
        {/* Budget Overview - Takes 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <BudgetOverview />
        </div>
      </div>

      {/* Milestone Tracker */}
      <div className="mb-8">
        <MilestoneTracker 
          timelineItems={timelineItems} 
          weddingDate={weddingDate}
        />
      </div>

      {/* Blog Posts */}
      <BlogPosts />
    </div>
  );
}