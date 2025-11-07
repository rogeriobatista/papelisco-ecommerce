"use client";

import { useAppDispatch, useAppSelector } from '../features/hooks';
import { toggleCart } from '../features/cart/cartSlice';
import styles from '../styles/CartIcon.module.scss';

export default function CartIcon() {
  const dispatch = useAppDispatch();
  const { totalItems } = useAppSelector((state: any) => state.cart);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  return (
    <button className={styles.cartButton} onClick={handleCartClick}>
      <svg 
        className={styles.cartIcon} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
      {totalItems > 0 && (
        <span className={styles.badge}>{totalItems}</span>
      )}
    </button>
  );
}