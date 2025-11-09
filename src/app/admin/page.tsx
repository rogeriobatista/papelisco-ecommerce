'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import styles from './AdminDashboard.module.scss';

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }>;
  salesData: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.role !== 'ADMIN') {
            router.push('/');
            return;
          }
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
    } else if (user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isLoggedIn, user, dispatch, router]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  if (isLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null; // Will redirect
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.userInfo}>
            <span className={styles.welcomeText}>Welcome, {user.firstName}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {dashboardData && (
        <div className={styles.dashboardContent}>
          {/* Key Metrics */}
          <section className={styles.metricsSection}>
            <h2 className={styles.sectionTitle}>Key Metrics</h2>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>💰</div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>
                    ${dashboardData.totalSales.toLocaleString()}
                  </h3>
                  <p className={styles.metricLabel}>Total Sales</p>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>📦</div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>
                    {dashboardData.totalOrders.toLocaleString()}
                  </h3>
                  <p className={styles.metricLabel}>Total Orders</p>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>👥</div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>
                    {dashboardData.totalCustomers.toLocaleString()}
                  </h3>
                  <p className={styles.metricLabel}>Total Customers</p>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>🛍️</div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>
                    {dashboardData.totalProducts.toLocaleString()}
                  </h3>
                  <p className={styles.metricLabel}>Total Products</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sales Chart */}
          <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Sales Overview (Last 7 Days)</h2>
            <div className={styles.chartContainer}>
              <div className={styles.simpleChart}>
                {dashboardData.salesData.map((day, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div 
                      className={styles.bar}
                      style={{ height: `${(day.sales / Math.max(...dashboardData.salesData.map(d => d.sales))) * 100}%` }}
                    ></div>
                    <span className={styles.chartLabel}>
                      {new Date(day.date).getDate()}
                    </span>
                    <span className={styles.chartValue}>
                      ${day.sales.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Orders & Top Products */}
          <div className={styles.bottomSection}>
            <section className={styles.ordersSection}>
              <h2 className={styles.sectionTitle}>Recent Orders</h2>
              <div className={styles.ordersTable}>
                <div className={styles.tableHeader}>
                  <span>Order #</span>
                  <span>Customer</span>
                  <span>Total</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className={styles.tableRow}>
                    <span className={styles.orderNumber}>{order.orderNumber}</span>
                    <span>{order.customer}</span>
                    <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.productsSection}>
              <h2 className={styles.sectionTitle}>Top Products</h2>
              <div className={styles.productsList}>
                {dashboardData.topProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productSales}>{product.sales} sold</p>
                    </div>
                    <div className={styles.productRevenue}>
                      ${product.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}