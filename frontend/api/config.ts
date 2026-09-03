export const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ADDRESS || 'http://localhost:5000';
export const API_BASE_URL = `${BACKEND_ORIGIN}/api`;

export const ENDPOINTS = {
  ALBUM: {
    BASE: '/albums',
    GENERATE: '/albums/generate',
    UPDATE: '/albums/update',
  },
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
    WEDDING_DATE: '/timeline/wedding-date',
    SELECT_VENDOR: '/timeline/select-vendor'
  },
  CONTACT: '/contact',
  INVITATION: {
    RENDER: '/invitations/render',
    GENERATE: '/invitations/generate',
    MINE: '/invitations/mine',
    GUEST_LINKS: '/invitations/mine/links',
    BASE: '/invitations',
  },
  HEALTH: '/health',
};

export const  TIMEOUT = 10000; // 10 seconds
