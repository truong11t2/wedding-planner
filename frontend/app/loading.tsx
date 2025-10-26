import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Loading Icon */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
            <Heart className="h-10 w-10 text-pink-500 animate-pulse" />
          </div>
          
          {/* Sparkles around the heart */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-pink-400 animate-spin" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="h-4 w-4 text-purple-400 animate-bounce" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Planning Your Perfect Day
          </h2>
          <p className="text-gray-600">
            Just a moment while we prepare everything...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}