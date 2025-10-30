'use client';

import { useAuth } from '@/context/AuthContext';
import Timeline from '@/components/home/Timeline';
import { TimelineItem } from '@/lib/timelineGenerator';

export default function TimelinePage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your wedding timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Timeline />
    </div>
  );
}