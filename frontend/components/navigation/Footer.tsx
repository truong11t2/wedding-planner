import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t-2 border-pink-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Main footer text */}
          <p className="text-center text-gray-600 text-sm">
            <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Về Một Nhà
            </Link>
            {' '}© {currentYear} • Ngày cưới hoàn hảo.
          </p>
          
          {/* Links */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/terms" className="hover:text-pink-600 transition-colors">
              Điều Khoản Sử Dụng
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-pink-600 transition-colors">
              Chính Sách Bảo Mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
