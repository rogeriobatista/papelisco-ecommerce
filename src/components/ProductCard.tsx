'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppDispatch } from '../features/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { Product } from '../features/products/productsSlice';
import { useToast } from '../contexts/ToastContext';
import WishlistButton from './WishlistButton';
import styles from '../styles/ProductCard.module.scss';

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    setIsAdding(true);
    
    try {
      dispatch(addToCart({ product, quantity: 1 }));
      addToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      addToast('Failed to add item to cart', 'error');
    } finally {
      setTimeout(() => setIsAdding(false), 300); // Brief delay for visual feedback
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.wishlistButtonContainer}>
        <WishlistButton 
          productId={product.id} 
          variant="icon-only"
          className={styles.cardWishlistButton}
        />
      </div>
      <Link href={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.card}>
          <img src={product.image} alt={product.name} className={styles.image} />
          <h2>{product.name}</h2>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>
        </div>
      </Link>
      <button 
        className={`${styles.addToCartBtn} ${isAdding ? styles.adding : ''}`}
        onClick={handleAddToCart}
        disabled={isAdding}
        title="Add to cart"
      >
        {isAdding ? (
          <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
        )}
      </button>
    </div>
  );
}
