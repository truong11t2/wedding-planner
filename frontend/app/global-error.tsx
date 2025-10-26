'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Error
              </h1>
              <p className="text-gray-600">
                Something went wrong with the wedding planner application.
              </p>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Restart Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}