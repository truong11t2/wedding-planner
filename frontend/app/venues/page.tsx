// filepath: /home/truong/project/wp1/wedding-planner/frontend/app/venues/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { MapPinned } from 'lucide-react';

export default function VenuesPage() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Browse wedding venues by logging in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Venues</h1>
        <p className="text-gray-600">
          Discover and book the perfect venue for your special day.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <MapPinned className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Browser Coming Soon</h3>
        <p className="text-gray-600">
          Browse our curated selection of wedding venues here.
        </p>
      </div>
    </div>
  );
}