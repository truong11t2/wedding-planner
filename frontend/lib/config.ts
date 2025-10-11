export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      LOGOUT: '/api/auth/logout',
    },
    TIMELINE: {
      SAVE: '/api/timeline/save',
      GET: '/api/timeline/get',
      DELETE: '/api/timeline/delete',
    },
    HEALTH: '/api/health',
  },
  TIMEOUT: 10000, // 10 seconds
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};