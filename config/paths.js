/**
 * Centralized routing paths for Stray Shield application
 * All route definitions in one place for easy maintenance
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Protected routes
  REPORT: '/report',
  DASHBOARD: '/ngo-dashboard',
  MYREPORTS: '/my-reports',
  ADOPTION_BOARD: '/ngo/adoption-board',
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_VERIFY: '/api/auth/verify',
  AUTH_LOGOUT: '/api/auth/logout',
  
  // Report endpoints
  REPORT_CREATE: '/api/reports/create',
  REPORT_LIST: '/api/reports',
  REPORT_GET: (id) => `/api/reports/${id}`,
  REPORT_UPDATE: (id) => `/api/reports/${id}`,
  REPORT_DELETE: (id) => `/api/reports/${id}`,
  
  // User endpoints
  USER_PROFILE: '/api/users/profile',
  USER_UPDATE: '/api/users/profile',
};

export const USER_TYPES = {
  CITIZEN: 'citizen',
  NGO: 'ngo',
  ADMIN: 'admin',
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};
