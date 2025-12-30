'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

export const socialLogin = async (provider: Provider) => {
  let authUrl: string;
  
  switch (provider) {
    case 'Google':
    case 'Gmail':
      authUrl = `${API_BASE_URL}/api/auth/google`;
      break;
    case 'Facebook':
      authUrl = `${API_BASE_URL}/api/auth/facebook`;
      break;
    default:
      return { success: false, message: `${provider} login not supported` };
  }

  window.location.href = authUrl;
  return { success: true, redirectUrl: authUrl };
};