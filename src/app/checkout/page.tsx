'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/features/store';
import { clearCart } from '@/features/cart/cartSlice';
import Link from 'next/link';
import styles from '@/styles/Checkout.module.scss';
import {
  formatCardNumber,
  formatExpiryDate,
  formatCVV,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  detectCardType,
  getCardTypeDisplayName
} from '@/utils/creditCard';

interface FormData {
  // Shipping Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Payment Info
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  
  // Billing same as shipping
  billingSameAsShipping: boolean;
  
  // Billing Info (when different)
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  
  // Order notes
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState('unknown');
  
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let formattedValue = value;
    
    // Apply formatting for credit card fields
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(value));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = formatCVV(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    console.log('Validating form with data:', formData);

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';

    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Credit card validation
    if (formData.cardNumber && !validateCardNumber(formData.cardNumber)) {
      console.log('Credit card validation failed for:', formData.cardNumber);
      console.log('Clean number:', formData.cardNumber.replace(/\s/g, ''));
      console.log('Length:', formData.cardNumber.replace(/\s/g, '').length);
      newErrors.cardNumber = 'Invalid card number';
    }
    if (formData.expiryDate && !validateExpiryDate(formData.expiryDate)) {
      console.log('Expiry date validation failed for:', formData.expiryDate);
      newErrors.expiryDate = 'Invalid or expired date';
    }
    if (formData.cvv && !validateCVV(formData.cvv)) {
      console.log('CVV validation failed for:', formData.cvv);
      newErrors.cvv = 'Invalid CVV';
    }

    // Billing address validation (if different from shipping)
    if (!formData.billingSameAsShipping) {
      if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'Billing first name is required';
      if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Billing last name is required';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingState.trim()) newErrors.billingState = 'Billing state is required';
      if (!formData.billingZipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          addressLine1: formData.address,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: formData.billingSameAsShipping ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          addressLine1: formData.address,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country,
        } : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          addressLine1: formData.billingAddress,
          addressLine2: formData.billingAddress2,
          city: formData.billingCity,
          state: formData.billingState,
          postalCode: formData.billingZipCode,
          country: formData.billingCountry,
        },
        paymentMethod: getCardTypeDisplayName(cardType),
        cardDetails: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName,
        },
        notes: formData.notes,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear cart
        dispatch(clearCart());
        
        // Redirect to order confirmation
        router.push(`/orders/${result.order.id}?success=true`);
      } else {
        setErrors({ submit: result.error || 'Failed to place order' });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.checkoutForm}>
          {/* Shipping Information */}
          <section className={styles.section}>
            <h2>Shipping Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? styles.error : ''}
                  required
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? styles.error : ''}
                  required
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? styles.error : ''}
                  required
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? styles.error : ''}
                  required
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? styles.error : ''}
                  required
                />
                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="address2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? styles.error : ''}
                  required
                />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? styles.error : ''}
                  required
                />
                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? styles.error : ''}
                  required
                />
                {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className={styles.section}>
            <h2>Payment Information</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.cardNumberGroup}`}>
                <label htmlFor="cardNumber">Card Number *</label>
                <div className={styles.cardNumberInput}>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? styles.error : ''}
                    maxLength={19}
                    required
                  />
                  <span className={styles.cardType}>
                    {cardType !== 'unknown' && getCardTypeDisplayName(cardType)}
                  </span>
                </div>
                {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={errors.expiryDate ? styles.error : ''}
                  maxLength={5}
                  required
                />
                {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={errors.cvv ? styles.error : ''}
                  maxLength={4}
                  required
                />
                {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="cardName">Name on Card *</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={errors.cardName ? styles.error : ''}
                  required
                />
                {errors.cardName && <span className={styles.errorText}>{errors.cardName}</span>}
              </div>
            </div>
          </section>

          {/* Billing Address */}
          <section className={styles.section}>
            <div className={styles.billingSection}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="billingSameAsShipping"
                  name="billingSameAsShipping"
                  checked={formData.billingSameAsShipping}
                  onChange={handleInputChange}
                />
                <label htmlFor="billingSameAsShipping">Billing address same as shipping</label>
              </div>
              
              {!formData.billingSameAsShipping && (
                <>
                  <h3>Billing Address</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="billingFirstName">First Name *</label>
                      <input
                        type="text"
                        id="billingFirstName"
                        name="billingFirstName"
                        value={formData.billingFirstName}
                        onChange={handleInputChange}
                        className={errors.billingFirstName ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingFirstName && <span className={styles.errorText}>{errors.billingFirstName}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="billingLastName">Last Name *</label>
                      <input
                        type="text"
                        id="billingLastName"
                        name="billingLastName"
                        value={formData.billingLastName}
                        onChange={handleInputChange}
                        className={errors.billingLastName ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingLastName && <span className={styles.errorText}>{errors.billingLastName}</span>}
                    </div>
                    
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="billingAddress">Address *</label>
                      <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        className={errors.billingAddress ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingAddress && <span className={styles.errorText}>{errors.billingAddress}</span>}
                    </div>
                    
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="billingAddress2">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        id="billingAddress2"
                        name="billingAddress2"
                        value={formData.billingAddress2}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="billingCity">City *</label>
                      <input
                        type="text"
                        id="billingCity"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className={errors.billingCity ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingCity && <span className={styles.errorText}>{errors.billingCity}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="billingState">State *</label>
                      <input
                        type="text"
                        id="billingState"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        className={errors.billingState ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingState && <span className={styles.errorText}>{errors.billingState}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="billingZipCode">ZIP Code *</label>
                      <input
                        type="text"
                        id="billingZipCode"
                        name="billingZipCode"
                        value={formData.billingZipCode}
                        onChange={handleInputChange}
                        className={errors.billingZipCode ? styles.error : ''}
                        required={!formData.billingSameAsShipping}
                      />
                      {errors.billingZipCode && <span className={styles.errorText}>{errors.billingZipCode}</span>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Order Notes */}
          <section className={styles.section}>
            <h3>Order Notes (Optional)</h3>
            <div className={styles.formGroup}>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Special instructions for your order..."
                rows={3}
                className={styles.notesTextarea}
              />
            </div>
          </section>
        </div>

        {/* Order Summary */}
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

            {errors.submit && (
              <div className={styles.submitError}>
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.placeOrderBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>

            <div className={styles.securityInfo}>
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}