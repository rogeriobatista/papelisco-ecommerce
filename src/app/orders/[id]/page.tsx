'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import styles from './OrderDetail.module.scss';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{
      imageUrl: string;
      altText: string;
    }>;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  notes: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for success parameter
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
    if (isLoggedIn && params.id) {
      fetchOrderDetail();
    }
  }, [isLoggedIn, params.id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${params.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      dispatch(logout());
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return styles.statusPending;
      case 'processing': return styles.statusProcessing;
      case 'shipped': return styles.statusShipped;
      case 'delivered': return styles.statusDelivered;
      case 'cancelled': return styles.statusCancelled;
      case 'refunded': return styles.statusRefunded;
      default: return styles.statusDefault;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return styles.paymentPaid;
      case 'pending': return styles.paymentPending;
      case 'failed': return styles.paymentFailed;
      case 'refunded': return styles.paymentRefunded;
      default: return styles.paymentDefault;
    }
  };

  if (isLoading || loading || !isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error}</p>
          <Link href="/orders" className={styles.backButton}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Order Not Found</h2>
          <p className={styles.errorMessage}>The order you're looking for doesn't exist.</p>
          <Link href="/orders" className={styles.backButton}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className={styles.successBanner}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successText}>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your purchase. Your order has been placed and will be processed soon.</p>
            </div>
            <button 
              className={styles.closeSuccessBtn}
              onClick={() => setShowSuccessMessage(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className={styles.orderHeader}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <img 
              src="/icon-logo.png" 
              alt="Papelisco" 
              className={styles.logoImage}
            />
          </Link>
          
          <nav className={styles.headerNav}>
            <Link href="/" className={styles.navLink}>
              Store
            </Link>
            <Link href="/orders" className={styles.navLink}>
              My Orders
            </Link>
            <Link href="/profile" className={styles.navLink}>
              Profile
            </Link>
          </nav>

          <div className={styles.userSection}>
            <span className={styles.welcomeText}>
              {user?.firstName || user?.email}
            </span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={styles.orderContent}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/orders" className={styles.breadcrumbLink}>
              My Orders
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>
              Order #{order.orderNumber}
            </span>
          </nav>

          {/* Order Header */}
          <div className={styles.orderHeaderSection}>
            <div className={styles.orderTitle}>
              <h1 className={styles.pageTitle}>Order #{order.orderNumber}</h1>
              <div className={styles.orderMeta}>
                <p className={styles.orderDate}>
                  Placed on {formatDate(order.createdAt)}
                </p>
                {order.updatedAt !== order.createdAt && (
                  <p className={styles.orderUpdated}>
                    Last updated: {formatDate(order.updatedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.orderStatusSection}>
              <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className={`${styles.paymentBadge} ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className={styles.orderDetailsGrid}>
            {/* Order Items */}
            <div className={styles.orderItemsSection}>
              <h2 className={styles.sectionTitle}>Order Items</h2>
              <div className={styles.itemsList}>
                {order.orderItems.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].imageUrl}
                          alt={item.product.images[0].altText || item.product.name}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.product.name}</h3>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price)} each
                        </span>
                        <span className={styles.itemQuantity}>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.itemTotal}>
                      {formatPrice(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummarySection}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                
                {order.discountAmount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Discount:</span>
                    <span className={`${styles.summaryValue} ${styles.discount}`}>
                      -{formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping:</span>
                  <span className={styles.summaryValue}>
                    {order.shippingAmount > 0 ? formatPrice(order.shippingAmount) : 'Free'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(order.taxAmount)}
                  </span>
                </div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span className={styles.summaryLabel}>Total:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className={styles.paymentInfo}>
                <h3 className={styles.paymentTitle}>Payment Information</h3>
                <div className={styles.paymentDetails}>
                  <p className={styles.paymentMethod}>
                    <strong>Method:</strong> {order.paymentMethod || 'Not specified'}
                  </p>
                  <p className={styles.paymentStatus}>
                    <strong>Status:</strong> 
                    <span className={`${styles.paymentStatusText} ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Addresses */}
          {(order.shippingAddress || order.billingAddress) && (
            <div className={styles.addressesSection}>
              <h2 className={styles.sectionTitle}>Addresses</h2>
              <div className={styles.addressesGrid}>
                {order.shippingAddress && (
                  <div className={styles.addressCard}>
                    <h3 className={styles.addressTitle}>Shipping Address</h3>
                    <div className={styles.addressDetails}>
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p>Phone: {order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {order.billingAddress && (
                  <div className={styles.addressCard}>
                    <h3 className={styles.addressTitle}>Billing Address</h3>
                    <div className={styles.addressDetails}>
                      <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                      <p>{order.billingAddress.addressLine1}</p>
                      {order.billingAddress.addressLine2 && (
                        <p>{order.billingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                      </p>
                      <p>{order.billingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className={styles.notesSection}>
              <h2 className={styles.sectionTitle}>Order Notes</h2>
              <div className={styles.notesContent}>
                <p>{order.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actionsSection}>
            <Link href="/orders" className={styles.backToOrdersBtn}>
              ← Back to Orders
            </Link>
            
            <div className={styles.orderActions}>
              {order.status.toLowerCase() === 'delivered' && (
                <button className={styles.reorderBtn}>
                  Reorder Items
                </button>
              )}
              
              {['pending', 'processing'].includes(order.status.toLowerCase()) && (
                <button className={styles.cancelBtn}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}