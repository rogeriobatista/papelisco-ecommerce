'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import styles from './Dashboard.module.scss';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on page load
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

  if (isLoading || !isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      {/* Dashboard Content */}
      <main className={styles.dashboardContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Dashboard</h1>
            <p className={styles.pageSubtitle}>Manage your account and view your activity</p>
          </div>

          {/* User Info Card */}
          <div className={styles.userInfoCard}>
            <div className={styles.userAvatar}>
              {user?.image ? (
                <img src={user.image} alt={user.firstName || user.email} />
              ) : (
                <span className={styles.avatarInitial}>
                  {(user?.firstName || user?.email || '').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.firstName || user?.email}
              </h2>
              
              <div className={styles.userMeta}>
                <div className={styles.metaItem}>
                  <strong>Email:</strong> {user?.email}
                </div>
                {user?.phone && (
                  <div className={styles.metaItem}>
                    <strong>Phone:</strong> {user.phone}
                  </div>
                )}
                <div className={styles.metaItem}>
                  <strong>Role:</strong> 
                  <span className={`${styles.roleBadge} ${styles[user?.role?.toLowerCase() || '']}`}>
                    {user?.role}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <strong>Status:</strong> 
                  <span className={`${styles.statusBadge} ${user?.isVerified ? styles.verified : styles.unverified}`}>
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className={styles.dashboardGrid}>
            <div className={styles.dashboardCard}>
              <div className={styles.cardIcon}>📦</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Recent Orders</h3>
                <p className={styles.cardDescription}>View and track your recent purchases</p>
                <div className={styles.cardStats}>No orders yet</div>
                <Link href="/orders" className={styles.cardAction}>
                  View All Orders
                </Link>
              </div>
            </div>

            <div className={styles.dashboardCard}>
              <div className={styles.cardIcon}>❤️</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Wishlist</h3>
                <p className={styles.cardDescription}>Items you've saved for later</p>
                <div className={styles.cardStats}>0 items</div>
                <Link href="/wishlist" className={styles.cardAction}>
                  View Wishlist
                </Link>
              </div>
            </div>

            <div className={styles.dashboardCard}>
              <div className={styles.cardIcon}>👤</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>My Profile</h3>
                <p className={styles.cardDescription}>Manage your personal information</p>
                <div className={styles.cardStats}>Name, Email, Phone</div>
                <Link href="/profile" className={styles.cardAction}>
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className={styles.dashboardCard}>
              <div className={styles.cardIcon}>⚙️</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Account Settings</h3>
                <p className={styles.cardDescription}>Manage your account preferences</p>
                <div className={styles.cardStats}>Theme, Security, Preferences</div>
                <Link href="/settings" className={styles.cardAction}>
                  Open Settings
                </Link>
              </div>
            </div>

            <div className={styles.dashboardCard}>
              <div className={styles.cardIcon}>🛒</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Shopping</h3>
                <p className={styles.cardDescription}>Continue shopping our latest products</p>
                <div className={styles.cardStats}>Discover new items</div>
                <Link href="/" className={styles.cardAction}>
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}