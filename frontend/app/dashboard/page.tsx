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
import { Calendar, CheckCircle, Clock, DollarSign, Heart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const { timelineItems, weddingDate, isLoading } = useTimeline();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [isLoggedIn, router]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
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

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const daysUntilWedding = getDaysUntilWedding();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting}, {user?.name || 'there'}! 
                <Heart className="inline-block ml-2 h-8 w-8 text-pink-500" />
              </h1>
              <p className="text-gray-600 mt-2">
                {weddingDate ? (
                  daysUntilWedding !== null ? (
                    daysUntilWedding > 0 ? (
                      <>
                        Your wedding is on {formatDate(weddingDate)} - 
                        <span className="font-semibold text-pink-600 ml-1">
                          {daysUntilWedding} days to go!
                        </span>
                      </>
                    ) : daysUntilWedding === 0 ? (
                      <span className="font-bold text-pink-600">
                        🎉 Today is your wedding day! Congratulations! 🎉
                      </span>
                    ) : (
                      <>
                        Hope you had a wonderful wedding on {formatDate(weddingDate)}!
                      </>
                    )
                  ) : (
                    'Your wedding planning dashboard'
                  )
                ) : (
                  'Set your wedding date to get started with planning'
                )}
              </p>
            </div>
            
            {weddingDate && (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-pink-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Wedding Date</div>
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
            <BudgetOverview timelineItems={timelineItems} />
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
    </div>
  );
}