'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-pink-200 animate-pulse">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-16 w-16 text-pink-400 animate-bounce" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            Looks like this page got lost on the way to the altar!
          </p>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>

            <Link
              href="/timeline"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-pink-300 text-pink-700 font-medium rounded-lg hover:bg-pink-50 transition-colors duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Timeline
            </Link>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/dashboard"
              className="text-pink-600 hover:text-pink-700 hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/guests"
              className="text-pink-600 hover:text-pink-700 hover:underline"
            >
              Guest List
            </Link>
            <Link
              href="/vendor"
              className="text-pink-600 hover:text-pink-700 hover:underline"
            >
              Vendors
            </Link>
            <Link
              href="/blog"
              className="text-pink-600 hover:text-pink-700 hover:underline"
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Wedding-themed decoration */}
        <div className="mt-8 flex justify-center space-x-2 opacity-50">
          <span className="text-pink-300">💐</span>
          <span className="text-purple-300">💍</span>
          <span className="text-pink-300">🎉</span>
          <span className="text-purple-300">💕</span>
          <span className="text-pink-300">🌸</span>
        </div>
      </div>
    </div>
  );
}