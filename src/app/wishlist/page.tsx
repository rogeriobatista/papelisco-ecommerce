'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import { 
  fetchWishlist, 
  removeFromWishlist, 
  clearWishlistError 
} from '@/features/wishlist/wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';
import styles from './Wishlist.module.scss';

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { items, isLoading, error } = useAppSelector((state) => state.wishlist);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch(setUser(userData));
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };

    if (!isLoggedIn) {
      checkAuth();
    }
  }, [isLoggedIn, dispatch, router]);

  useEffect(() => {
    // Fetch wishlist when user is authenticated
    if (isLoggedIn) {
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearWishlistError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Remove from wishlist error:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (item: any, quantity: number = 1) => {
    try {
      const product = {
        id: item.product.id,
        name: item.product.name,
        category: item.product.category.name,
        price: item.product.discountPrice || item.product.price,
        image: item.product.images.find((img: any) => img.isPrimary)?.imageUrl || item.product.images[0]?.imageUrl || '/placeholder-product.jpg',
        description: item.product.description,
      };
      
      dispatch(addToCart({ product, quantity }));
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(item.productId);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  if (authLoading || !isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <main className={styles.wishlistContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Wishlist</h1>
            <p className={styles.pageSubtitle}>
              Save your favorite items for later
            </p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}>Loading wishlist...</div>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.emptyWishlist}>
              <div className={styles.emptyIcon}>💝</div>
              <h3>Your wishlist is empty</h3>
              <p>Discover amazing products and add them to your wishlist!</p>
              <Link href="/" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.wishlistGrid}>
              {items.map((item) => (
                <div key={item.id} className={styles.wishlistItem}>
                  <div className={styles.productImageContainer}>
                    <Link href={`/product/${item.product.slug}`}>
                      <img
                        src={item.product.images.find(img => img.isPrimary)?.imageUrl || item.product.images[0]?.imageUrl || '/placeholder-product.jpg'}
                        alt={item.product.images.find(img => img.isPrimary)?.altText || item.product.name}
                        className={styles.productImage}
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className={styles.removeButton}
                      disabled={removingItems.has(item.productId)}
                      title="Remove from wishlist"
                    >
                      {removingItems.has(item.productId) ? (
                        <div className={styles.miniSpinner}></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM5.5 5.5a.5.5 0 0 0-.708.708L7.293 8.5 4.792 11a.5.5 0 0 0 .708.708L8 9.207l2.5 2.5a.5.5 0 0 0 .708-.708L8.707 8.5l2.5-2.5a.5.5 0 0 0-.708-.708L8 7.793 5.5 5.5z"/>
                        </svg>
                      )}
                    </button>
                    {item.product.discountPrice && (
                      <div className={styles.discountBadge}>
                        -{getDiscountPercentage(item.product.price, item.product.discountPrice)}%
                      </div>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.categoryTag}>
                      {item.product.category.name}
                    </div>
                    
                    <Link href={`/product/${item.product.slug}`} className={styles.productTitle}>
                      {item.product.name}
                    </Link>

                    <div className={styles.priceContainer}>
                      {item.product.discountPrice ? (
                        <>
                          <span className={styles.currentPrice}>
                            {formatPrice(item.product.discountPrice)}
                          </span>
                          <span className={styles.originalPrice}>
                            {formatPrice(item.product.price)}
                          </span>
                        </>
                      ) : (
                        <span className={styles.currentPrice}>
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>

                    <div className={styles.stockStatus}>
                      {item.product.stockQuantity > 0 ? (
                        <span className={styles.inStock}>
                          {item.product.stockQuantity > 10 ? 'In Stock' : `${item.product.stockQuantity} left`}
                        </span>
                      ) : (
                        <span className={styles.outOfStock}>Out of Stock</span>
                      )}
                    </div>

                    <div className={styles.actionButtons}>
                      {item.product.stockQuantity > 0 ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={styles.addToCartBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                          </svg>
                          Add to Cart
                        </button>
                      ) : (
                        <button className={styles.outOfStockBtn} disabled>
                          Out of Stock
                        </button>
                      )}
                      
                      <Link 
                        href={`/product/${item.product.slug}`}
                        className={styles.viewProductBtn}
                      >
                        View Details
                      </Link>
                    </div>

                    <div className={styles.addedDate}>
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className={styles.wishlistActions}>
              <Link href="/" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
              <p className={styles.itemCount}>
                {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}