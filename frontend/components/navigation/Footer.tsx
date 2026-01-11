import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t-2 border-pink-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
        <p>
          <Link href="/" className="text-pink-500 hover:text-pink-700 transition-colors font-medium">
            Về Một Nhà {' • '}© {currentYear} • Giúp ngày cưới trở nên hoàn hảo.
          </Link>
        </p>
      </div>
    </footer>
  );
}
