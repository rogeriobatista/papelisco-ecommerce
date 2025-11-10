'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import styles from './Orders.module.scss';

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
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/orders?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data: OrdersResponse = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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
        <div className={styles.spinner}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      {/* Orders Content */}
      <main className={styles.ordersContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Orders</h1>
            <p className={styles.pageSubtitle}>Track and manage your order history</p>
          </div>

          {/* Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label htmlFor="status" className={styles.filterLabel}>
                Filter by Status:
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.filterSelect}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3 className={styles.emptyTitle}>No Orders Found</h3>
              <p className={styles.emptyDescription}>
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No orders found with status "${statusFilter}".`}
              </p>
              <Link href="/" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <h3 className={styles.orderNumber}>
                          Order #{order.orderNumber}
                        </h3>
                        <p className={styles.orderDate}>
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className={styles.orderStatus}>
                        <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`${styles.paymentBadge} ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className={styles.orderItems}>
                      {order.orderItems.slice(0, 3).map((item) => (
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
                            <h4 className={styles.itemName}>{item.product.name}</h4>
                            <p className={styles.itemMeta}>
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className={styles.itemTotal}>
                            {formatPrice(item.total)}
                          </div>
                        </div>
                      ))}
                      
                      {order.orderItems.length > 3 && (
                        <div className={styles.moreItems}>
                          +{order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>

                    <div className={styles.orderFooter}>
                      <div className={styles.orderTotal}>
                        <span className={styles.totalLabel}>Total: </span>
                        <span className={styles.totalAmount}>
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      
                      <div className={styles.orderActions}>
                        <Link 
                          href={`/orders/${order.id}`}
                          className={styles.viewDetailsBtn}
                        >
                          View Details
                        </Link>
                        {order.status.toLowerCase() === 'delivered' && (
                          <button className={styles.reorderBtn}>
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className={`${styles.paginationBtn} ${!pagination.hasPrev ? styles.disabled : ''}`}
                  >
                    Previous
                  </button>
                  
                  <span className={styles.paginationInfo}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className={`${styles.paginationBtn} ${!pagination.hasNext ? styles.disabled : ''}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}