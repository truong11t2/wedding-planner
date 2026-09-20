import { API_BASE_URL, ENDPOINTS } from './config';
import { sanitizeReturnTo } from '@/lib/authRedirect';

export type Provider = 'Google' | 'Facebook' | 'Twitter' | 'Outlook' | 'Gmail';

// Client-side function to redirect to OAuth provider
//
// `returnTo` is forwarded to the backend, which round-trips it through the
// provider's OAuth `state` parameter and hands it back on `/auth/callback`.
// That keeps the destination working even when the callback returns on a
// different origin than the one the user started on (which breaks
// `sessionStorage`-based approaches).
export const socialLogin = async (provider: Provider, returnTo?: string | null) => {
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

  const url = new URL(authUrl);
  const safeReturnTo = sanitizeReturnTo(returnTo);
  if (safeReturnTo) {
    url.searchParams.set('returnTo', safeReturnTo);
  }

  // Redirect browser to OAuth provider
  window.location.href = url.toString();
  return { success: true, redirectUrl: url.toString() };
};