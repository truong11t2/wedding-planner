'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Toast from '../common/Toast';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleLogin = () => {
    setMobileMenuOpen(false);
    router.push('/login');
  };

    const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  useEffect(() => {
    if (isLoggedIn) {
      setToastMessage(`Welcome back!`);
      setToastType('success');
      setShowToast(true);
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-white shadow-md border-b-2 border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            href="/"
            className="flex items-center gap-3"
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Day Planner
            </h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-lg font-semibold transition-colors ${
                pathname === '/' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-lg font-semibold transition-colors ${
                pathname === '/blog' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Blog
            </Link>
            {isLoggedIn && (
              <Link
                href="/vendor"
                className={`text-lg font-semibold transition-colors ${
                  pathname === '/vendor' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Vendor
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/profile"
                className={`text-lg font-semibold transition-colors ${
                  pathname === '/profile' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Profile
              </Link>
            )}
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className={`block py-2 text-lg font-semibold ${
                pathname === '/' ? 'text-pink-600' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`block py-2 text-lg font-semibold ${
                pathname === '/blog' ? 'text-pink-600' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            {isLoggedIn && (
              <Link
                href="/vendor"
                className={`block py-2 text-lg font-semibold ${
                  pathname === '/vendor' ? 'text-pink-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Vendor
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/profile"
                className={`block py-2 text-lg font-semibold ${
                  pathname === '/profile' ? 'text-pink-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-lg font-semibold text-gray-700"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-lg font-semibold text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>

      <Toast 
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </header>
  );
}