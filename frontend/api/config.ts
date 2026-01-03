export const BASE_URL =  process.env.NEXT_PUBLIC_BACKEND_ADDRESS || 'http://localhost:5000';

export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      LOGOUT: '/api/auth/logout',
    },
    BUDGET: {
      BASE: '/api/budget',
      TOTAL: '/api/budget/total',
      CATEGORY: '/api/budget/category',
      STATS: '/api/budget/stats',
    },
    CHECKLIST: {
      BASE: '/api/checklist',
      ITEM: '/api/checklist/item',
    },
    PHOTO: {
      BASE: '/api/photos',
      UPLOAD: '/api/photos/upload',
      CATEGORY: '/api/photos/category',
      SEARCH: '/api/photos/search',
      STATS: '/api/photos/stats',
    },
    SOCIAL: {

    },
    TIMELINE: {
      BASE: '/api/timeline',
      STATUS: '/api/timeline/status',
      WEDDING_DATE: '/api/timeline/wedding-date'
    },
    HEALTH: '/api/health',
  };

export const  TIMEOUT = 10000; // 10 seconds
