'use client';

import { useAuth } from '@/context/AuthContext';
import Timeline from '@/components/home/Timeline';
import Link from 'next/link';

export default function TimelinePage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h1>
          <p className="text-gray-600">Bạn cần đăng nhập để xem timeline đám cưới của mình.</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Timeline />
    </div>
  );
}