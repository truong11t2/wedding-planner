'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-2">
            We encountered an unexpected error while planning your perfect day.
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, we're here to help get you back on track!
          </p>
        </div>

        {/* Error Details (in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm text-red-700 font-medium mb-1">Error Details:</p>
            <p className="text-xs text-red-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble?
          </p>
          <p className="text-xs text-gray-400">
            Please refresh the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  );
}