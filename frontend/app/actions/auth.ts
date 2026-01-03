'use server';

export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

export async function getAuthUrl(provider: Provider): Promise<{ url: string | null; error?: string }> {
  const API_BASE_URL = process.env.BACKEND_ADDRESS || 'http://localhost:5000';
  
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
      return { url: null, error: `${provider} login not supported` };
  }

  return { url: authUrl };
}
