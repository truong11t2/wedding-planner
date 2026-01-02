'use client';

const API_BASE_URL = process.env.BACKEND_ADDRESS || 'https://vemotnha.ddns.net';

export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

export const socialLogin = async (provider: Provider) => {
  let authUrl: string;
  
  switch (provider) {
    case 'Google':
    case 'Gmail':
      authUrl = `${API_BASE_URL}/api/auth/google`;
      console.log('Google login URL:', authUrl);
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