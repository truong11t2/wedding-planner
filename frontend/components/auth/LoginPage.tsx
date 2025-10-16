'use client';

import React, { useState } from 'react';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SocialLoginButtons from './SocialLoginButtons';
import Toast from '@/components/common/Toast';
import { loginUser, registerUser } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      const result = await loginUser(email, password);
      if (result.success && result.token) {
        login(result.user);
        showToast('Login successful!', 'success');
        // Short delay before redirect to show the success toast
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        showToast(result.message || 'Login failed', 'error');
      }
    } else {
      if (!fullName || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      const result = await registerUser(fullName, email, password);
      if (result.success) {
        showToast('Registration successful!', 'success');
        // Short delay before redirect to show the success toast
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        showToast(result.message || 'Registration failed', 'error');
      }
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-pink-200">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4">
              <Heart className="w-12 h-12 text-pink-600 fill-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue planning your special day' : 'Join us to start planning your perfect wedding'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 font-medium hover:text-pink-700"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          <SocialLoginButtons onSuccess={() => router.push('/')} />
        </div>
      </div>
    </main>
  );
}