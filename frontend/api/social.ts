import { API_BASE_URL, ENDPOINTS } from './config';

export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

// Client-side function to redirect to OAuth provider
export const socialLogin = async (provider: Provider) => {
  let authUrl: string;
  
  switch (provider) {
    case 'Google':
    case 'Gmail':
      authUrl = `${API_BASE_URL}${ENDPOINTS.SOCIAL.GOOGLE}`;
      break;
    case 'Facebook':
      authUrl = `${API_BASE_URL}${ENDPOINTS.SOCIAL.FACEBOOK}`;
      break;
    default:
      return { success: false, message: `${provider} login not supported` };
  }

  // Redirect browser to OAuth provider
  window.location.href = authUrl;
  return { success: true, redirectUrl: authUrl };
};