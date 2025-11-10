'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../features/hooks';
import { 
  addToWishlist, 
  removeFromWishlist, 
  fetchWishlist 
} from '../features/wishlist/wishlistSlice';
import styles from './WishlistButton.module.scss';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'icon-only' | 'large';
  className?: string;
}

export default function WishlistButton({ 
  productId, 
  variant = 'default', 
  className = '' 
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { isLoggedIn, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    setIsInWishlist(items.some(item => item.productId === productId));
  }, [items, productId]);

  // Fetch wishlist only when user is confirmed logged in and auth is not loading
  useEffect(() => {
    if (isLoggedIn && !authLoading && items.length === 0) {
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, authLoading, dispatch, items.length]);

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      // Redirect to login or show login modal
      window.location.href = '/auth/login';
      return;
    }

    setActionLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
      }
    } catch (error) {
      console.error('Wishlist action error:', error);
      // You could show a toast notification here
    } finally {
      setActionLoading(false);
    }
  };

  // Don't render button while auth is loading
  if (authLoading) {
    return null;
  }

  const buttonClasses = [
    styles.wishlistButton,
    styles[variant],
    isInWishlist ? styles.inWishlist : '',
    actionLoading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  const HeartIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill={isInWishlist ? "currentColor" : "none"}
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const LoadingSpinner = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={styles.spinner}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  );

  return (
    <button
      onClick={handleToggleWishlist}
      className={buttonClasses}
      disabled={actionLoading}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      type="button"
    >
      {actionLoading ? (
        <LoadingSpinner />
      ) : (
        <HeartIcon />
      )}
      
      {variant !== 'icon-only' && (
        <span className={styles.buttonText}>
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}