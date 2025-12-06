// API Configuration
// In production, this will use the environment variable
// In development, it uses the proxy or localhost

import axios from 'axios';

const getApiBaseUrl = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Use production API URL from environment variable
    // If REACT_APP_API_URL is set, use it; otherwise use the current origin
    return process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  }
  
  // Development: use proxy (if configured) or localhost
  // The proxy in package.json handles /api requests in development
  // Leave empty to use relative URLs (which will use the proxy)
  return process.env.REACT_APP_API_URL || '';
};

export const API_BASE_URL = getApiBaseUrl();

// Configure axios defaults
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

// Log API configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL || 'Using proxy (localhost:5000)');
}

export default axios;

