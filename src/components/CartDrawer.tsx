"use client";

import { useAppDispatch, useAppSelector } from '../features/hooks';
import { closeCart, removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import Link from 'next/link';
import styles from '../styles/CartDrawer.module.scss';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPrice, isOpen } = useAppSelector((state: any) => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={handleClose} />
      
      {/* Cart Drawer */}
      <div className={styles.cartDrawer}>
        <div className={styles.header}>
          <h2>Shopping Cart ({totalItems})</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.emptyIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <Link href="/" className={styles.shopButton} onClick={handleClose}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.items}>
                {items.map((item: any) => (
                  <div key={item.product.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.product.name}</h4>
                      <p className={styles.itemCategory}>{item.product.category}</p>
                      <p className={styles.itemPrice}>${item.product.price}</p>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className={styles.quantityBtn}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.product.id)}
                        className={styles.removeBtn}
                        title="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <div className={styles.total}>
                  <span className={styles.totalLabel}>Total: </span>
                  <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
                </div>
                
                            <div className={styles.actions}>
              <Link href="/cart" className={styles.viewCartBtn} onClick={handleClose}>
                View Cart
              </Link>
              <Link href="/checkout" className={styles.checkoutBtn} onClick={handleClose}>
                Checkout (${(totalPrice * 1.1).toFixed(2)})
              </Link>
            </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}