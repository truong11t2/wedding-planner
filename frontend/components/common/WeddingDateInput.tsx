'use client';

import React, { useState } from 'react';
import { Calendar, Heart, Sparkles, TriangleAlert } from 'lucide-react';

interface WeddingDateInputProps {
  onSubmit: (date: string, location: string) => void;
  error?: string;
  initialDate?: string;
  initialLocation?: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function WeddingDateInput({
  onSubmit,
  error,
  initialDate = '',
  initialLocation = '',
  title = 'Bắt đầu hành trình cưới của bạn',
  description = 'Nhập ngày cưới của bạn và chúng tôi sẽ tạo một lịch trình cá nhân hóa chỉ dành cho bạn.',
  className = '',
}: WeddingDateInputProps) {
  const [weddingDate, setWeddingDate] = useState(initialDate);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weddingDate && location) {
      onSubmit(weddingDate, location);
    }
  };

  const minDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Decorative Elements */}
      <div className="relative">
        {/* Floating hearts animation */}
        <div className="absolute -top-8 -left-8 opacity-20 animate-bounce">
          <Heart className="w-12 h-12 text-pink-400" fill="currentColor" />
        </div>
        <div className="absolute -top-12 -right-12 opacity-20 animate-pulse">
          <Sparkles className="w-16 h-16 text-amber-400" />
        </div>

        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Gradient Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400" />
          
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
                <Calendar className="w-10 h-10 text-pink-600" />
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
                {title}
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
                {description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Địa Điểm*
                </label>
                
                <div className="relative">
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="
                      w-full px-6 py-4 
                      border-2 border-gray-200 rounded-xl
                      focus:border-pink-400 focus:ring-4 focus:ring-pink-100
                      outline-none transition-all duration-300
                      text-gray-900 text-lg
                      hover:border-pink-300
                    "
                  >
                    <option value="">Chọn địa điểm</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="wedding-date"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Ngày cưới của bạn*
                </label>
                
                <div className="relative">
                  <input
                    type="date"
                    id="wedding-date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    min={minDate}
                    required
                    className="
                      w-full px-6 py-4 
                      border-2 border-gray-200 rounded-xl
                      focus:border-pink-400 focus:ring-4 focus:ring-pink-100
                      outline-none transition-all duration-300
                      text-gray-900 text-lg
                      hover:border-pink-300
                    "
                  />
                </div>

                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Ngày cưới của bạn nên cách ít nhất 3 tháng
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-start">
                  <TriangleAlert className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="
                  w-full py-4 px-6
                  bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600
                  text-white font-semibold text-lg rounded-xl
                  hover:from-pink-600 hover:via-rose-600 hover:to-purple-700
                  transform hover:scale-105 hover:shadow-xl
                  transition-all duration-300
                  focus:outline-none focus:ring-4 focus:ring-pink-200
                  active:scale-95
                  relative overflow-hidden group
                "
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Tạo Lịch Trình Cưới
                </span>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </button>
            </form>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2 text-pink-400" fill="currentColor" />
                Chúng tôi rất vui được đồng hành cùng bạn trên hành trình này!
              </p>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-50 to-transparent opacity-50 rounded-tl-full" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent opacity-50 rounded-br-full" />
        </div>
      </div>
    </div>
  );
}
