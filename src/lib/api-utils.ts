/**
 * Utility functions for API URL handling
 * Prevents SSL mixed content errors by ensuring HTTPS in production
 */

/**
 * Get the correct base URL for API calls
 * Ensures HTTPS in production to prevent mixed content errors
 */
export function getApiBaseUrl(): string {
  // In production, always use HTTPS
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 
           process.env.VERCEL_URL || 
           'https://localhost:3000';
  }
  
  // In development, use configured URL or fallback to HTTP localhost
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
}

/**
 * Build a full API URL with the correct base URL
 * @param path - API path (e.g., '/api/wallet/123')
 * @returns Full URL with correct protocol
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Check if we're running in a secure context (HTTPS)
 * Useful for browser-side checks
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check NODE_ENV
    return process.env.NODE_ENV === 'production';
  }
  
  // Client-side: check protocol
  return window.location.protocol === 'https:';
} 