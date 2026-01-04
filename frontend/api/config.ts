export const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS || 'http://localhost:5000'}/api`;

export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      LOGOUT: '/auth/logout',
    },
    BUDGET: {
      BASE: '/budget',
      TOTAL: '/budget/total',
      CATEGORY: '/budget/category',
      STATS: '/budget/stats',
    },
    CHECKLIST: {
      BASE: '/checklist',
      ITEM: '/checklist/item',
    },
    GUEST: {
      BASE: '/guests',
      ADD: '/guests/add',
      STATS: '/guests/stats',
    },
    PHOTO: {
      BASE: '/photos',
      UPLOAD: '/photos/upload',
      CATEGORY: '/photos/category',
      SEARCH: '/photos/search',
      STATS: '/photos/stats',
    },
    SOCIAL: {
      GOOGLE: '/auth/google',
      FACEBOOK: '/auth/facebook'
    },
    TIMELINE: {
      BASE: '/timeline',
      STATUS: '/timeline/status',
      WEDDING_DATE: '/timeline/wedding-date'
    },
    HEALTH: '/health',
  };

export const  TIMEOUT = 10000; // 10 seconds
