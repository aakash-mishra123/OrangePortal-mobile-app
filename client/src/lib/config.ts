// API Configuration for different environments
export const API_CONFIG = {
  // Base URL for API calls
  baseURL: getApiBaseUrl(),
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // Request timeout
  timeout: 30000,
};

function getApiBaseUrl(): string {
  // In production (Vercel), use relative URLs since frontend and backend are on the same domain
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, check if we have a custom backend URL
  const customBackendUrl = import.meta.env.VITE_BACKEND_URL;
  if (customBackendUrl) {
    return customBackendUrl;
  }
  
  // Default development setup - backend on different port
  const isDevelopment = import.meta.env.DEV;
  if (isDevelopment) {
    // Check if backend is running on a different port
    const backendPort = import.meta.env.VITE_BACKEND_PORT || '3001';
    return `http://localhost:${backendPort}`;
  }
  
  // Fallback to relative URLs
  return '';
}

// Helper function to build full API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.baseURL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (!baseUrl) {
    // Relative URL
    return cleanEndpoint;
  }
  
  return `${baseUrl}${cleanEndpoint}`;
}

// Environment info
export const ENV_INFO = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  backendUrl: API_CONFIG.baseURL,
  mode: import.meta.env.MODE,
};
