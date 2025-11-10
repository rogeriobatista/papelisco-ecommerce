'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { setUser, setLoading } from '../features/auth/authSlice';
import { authenticatedFetch, tokenStorage } from '../lib/authStorage';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // Only run auth check if we haven't already checked and there's a token
      if (!isLoggedIn && !isLoading && tokenStorage.hasToken()) {
        dispatch(setLoading(true));
        
        try {
          const response = await authenticatedFetch('/api/auth/me');

          if (response.ok) {
            const userData = await response.json();
            dispatch(setUser(userData));
          } else {
            // If token is invalid, remove it
            tokenStorage.removeToken();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Remove invalid token
          tokenStorage.removeToken();
        } finally {
          dispatch(setLoading(false));
        }
      } else if (!tokenStorage.hasToken()) {
        // No token available, mark loading as complete
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, []); // Only run once on mount

  return <>{children}</>;
}