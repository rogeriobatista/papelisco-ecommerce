'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import Link from 'next/link';
import styles from '@/styles/Checkout.module.scss';

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCheckout}>
          <h1>Your cart is empty</h1>
          <p>Add some items to your cart before proceeding to checkout.</p>
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
        <h1>Checkout</h1>
        <Link href="/cart" className={styles.backLink}>← Back to Cart</Link>
      </div>

      <div className={styles.content}>
        <div className={styles.checkoutForm}>
          <section className={styles.section}>
            <h2>Shipping Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" required />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Payment Information</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" placeholder="123" required />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="cardName">Name on Card</label>
                <input type="text" id="cardName" name="cardName" required />
              </div>
            </div>
          </section>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>
            
            <div className={styles.orderItems}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryBreakdown}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className={styles.divider} />
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className={styles.placeOrderBtn}>
              Place Order - ${total.toFixed(2)}
            </button>

            <div className={styles.securityInfo}>
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}