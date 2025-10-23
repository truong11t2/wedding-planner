// filepath: /home/truong/project/wp1/wedding-planner/frontend/app/guests/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Users } from 'lucide-react';

export default function GuestsPage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Manage your guest list by logging in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
        <p className="text-gray-600">
          Organize your wedding guest list and track RSVPs.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Guest List Coming Soon</h3>
        <p className="text-gray-600">
          This feature is under development. You'll be able to manage your guest list here.
        </p>
      </div>
    </div>
  );
}