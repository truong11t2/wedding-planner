import React from 'react';
import { Provider, socialLogin } from '@/lib/api';

interface SocialLoginButtonsProps {
  onSuccess: () => void;
}

export default function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
  const handleSocialLogin = async (provider: Provider) => {
    const result = await socialLogin(provider);
    if (result.success) {
      onSuccess();
    } else {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
        onClick={() => handleSocialLogin('Gmail')}
        className="flex items-center justify-center px-4 py-3 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
        </svg>
        Gmail
        </button>

        <button
        onClick={() => handleSocialLogin('Outlook')}
        className="flex items-center justify-center px-4 py-3 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0078D4">
            <path d="M24 7.387v9.226a4.39 4.39 0 01-4.387 4.387h-1.953V9.613L12 13.4 6.34 9.613V21H4.387A4.39 4.39 0 010 16.613V7.387A4.39 4.39 0 014.387 3h15.226A4.39 4.39 0 0124 7.387zM12 11.627l5.66-3.787V3H6.34v4.84z"/>
        </svg>
        Outlook
        </button>

        <button
        onClick={() => handleSocialLogin('Facebook')}
        className="flex items-center justify-center px-4 py-3 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
        </button>

        <button
        onClick={() => handleSocialLogin('Twitter')}
        className="flex items-center justify-center px-4 py-3 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
        <svg className="w-5 h-5 mr-2" fill="#1DA1F2" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        Twitter
        </button>
    </div>
  </div>
    );
}