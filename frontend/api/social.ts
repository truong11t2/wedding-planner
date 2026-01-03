export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ADDRESS || 'http://localhost:5000';

// Client-side function to redirect to OAuth provider
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

  // Redirect browser to OAuth provider
  window.location.href = authUrl;
  return { success: true, redirectUrl: authUrl };
};