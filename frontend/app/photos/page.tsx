'use client';

import { useAuth } from '@/context/AuthContext';
import { CircleDollarSign } from 'lucide-react';

export default function BudgetPage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Track your wedding budget by logging in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Budget</h1>
        <p className="text-gray-600">
          Keep track of all your wedding expenses and stay within budget.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CircleDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Budget Tracker Coming Soon</h3>
        <p className="text-gray-600">
          Monitor your wedding expenses and manage your budget here.
        </p>
      </div>
    </div>
  );
}