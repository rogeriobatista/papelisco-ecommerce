'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/features/store';
import { removeFromCart, updateQuantity } from '@/features/cart/cartSlice';
import Link from 'next/link';
import styles from '@/styles/Cart.module.scss';

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className={styles.shopButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Shopping Cart</h1>
        <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img src={item.product.image} alt={item.product.name} />
              </div>
              
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.product.name}</h3>
                <p className={styles.itemCategory}>{item.product.category}</p>
                <p className={styles.itemDescription}>{item.product.description}</p>
              </div>

              <div className={styles.itemPrice}>
                <span className={styles.price}>${item.product.price.toFixed(2)}</span>
              </div>

              <div className={styles.itemQuantity}>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.itemTotal}>
                <span className={styles.total}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item.product.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal ({items.length} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${(totalPrice * 1.1).toFixed(2)}</span>
            </div>

            <div className={styles.actions}>
              <Link href="/" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
              <Link href="/checkout" className={styles.checkoutBtn}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}