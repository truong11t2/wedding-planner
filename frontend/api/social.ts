import { getAuthUrl, type Provider } from '@/app/actions/auth';

// Client-side function that uses server action to get URL, then redirects
export const socialLogin = async (provider: Provider) => {
  const { url, error } = await getAuthUrl(provider);
  
  if (error || !url) {
    return { success: false, message: error || 'Failed to get auth URL' };
  }

  // Still need client-side redirect for OAuth flow
  window.location.href = url;
  return { success: true, redirectUrl: url };
};