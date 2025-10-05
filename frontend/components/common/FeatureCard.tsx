import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  text: string;
}

export default function FeatureCard({ icon: Icon, text }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-pink-100 hover:border-pink-200 transition-all">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-full">
          <Icon className="w-6 h-6 text-pink-600" />
        </div>
        <p className="font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
}