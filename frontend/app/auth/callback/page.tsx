'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!searchParams) {
          setStatus('error');
          setMessage('No search parameters available');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error.replace(/_/g, ' ')}`);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        
        // Fetch user profile - the cookie will be sent automatically with credentials: 'include'
        const profileResponse = await getUserProfile();
        
        if (profileResponse.success && profileResponse.user) {
          // Call login with the actual user data - this will set isLoggedIn to true
          login(profileResponse.user);
          
          setStatus('success');
          setMessage(`Successfully logged in with ${provider}!`);
          
          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to fetch user profile after authentication');
        }

      } catch {
        setStatus('error');
        setMessage('Authentication processing failed. Please try again.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Processing Authentication</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900">Authentication Successful</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              <p className="mt-1 text-xs text-gray-500">Redirecting to dashboard...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900">Authentication Failed</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              <p className="mt-1 text-xs text-gray-500">Redirecting to login...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}