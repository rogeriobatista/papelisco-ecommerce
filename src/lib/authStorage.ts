'use client';

// Utility functions for managing JWT tokens in localStorage

const TOKEN_KEY = 'auth-token';

export const tokenStorage = {
  /**
   * Store JWT token in localStorage
   */
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Get JWT token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return !!tokenStorage.getToken();
  },

  /**
   * Get Authorization header value
   */
  getAuthHeader: (): string | null => {
    const token = tokenStorage.getToken();
    return token ? `Bearer ${token}` : null;
  },

  /**
   * Get fetch headers with Authorization
   */
  getAuthHeaders: (): HeadersInit => {
    const authHeader = tokenStorage.getAuthHeader();
    return authHeader
      ? {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        }
      : {
          'Content-Type': 'application/json',
        };
  },
};

/**
 * Create authenticated fetch wrapper
 */
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const authHeaders = tokenStorage.getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};