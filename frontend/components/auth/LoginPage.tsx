'use client';

import React, { useState } from 'react';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SocialLoginButtons from './SocialLoginButtons';
import Toast from '@/components/common/Toast';
import { loginUser, registerUser } from '@/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email || !password) {
        showToast('Vui lòng điền vào tất cả các trường', 'error');
        return;
      }

      const result = await loginUser(email, password);
      if (result.success && result.token && result.user) {
        login(result.user);
        showToast('Đăng nhập thành công!', 'success');
        // Short delay before redirect to show the success toast
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        showToast(result.message || 'Đăng nhập thất bại', 'error');
      }
    } else {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showToast('Vui lòng điền vào tất cả các trường', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Mật khẩu không khớp', 'error');
        return;
      }

      const result = await registerUser(firstName, lastName, email, password);
      if (result.success) {
        showToast('Đăng ký thành công!', 'success');
        // Short delay before redirect to show the success toast
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        showToast(result.message || 'Đăng ký thất bại', 'error');
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
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Đăng nhập để tiếp tục lên kế hoạch cho ngày đặc biệt của bạn' : 'Tham gia cùng chúng tôi để bắt đầu lên kế hoạch cho đám cưới hoàn hảo của bạn'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Tên"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Họ"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thư điện tử
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Nhập địa chỉ thư điện tử của bạn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 text-gray-600 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
            >
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 font-medium hover:text-pink-700"
              >
                {isLogin ? "Bạn chưa có tài khoản? Đăng ký" : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          </div>

          <SocialLoginButtons />
        </div>
      </div>
    </main>
  );
}