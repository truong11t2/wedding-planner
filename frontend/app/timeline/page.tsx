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
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wedding Timeline</h1>
        <p className="text-gray-600">
          Track important milestones and stay organized for your special day.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Timeline weddingDate={''} timeline={[]} setTimeline={function (timeline: TimelineItem[]): void {
                  throw new Error('Function not implemented.');
              } } setShowPlan={function (show: boolean): void {
                  throw new Error('Function not implemented.');
              } } />
      </div>
    </div>
  );
}