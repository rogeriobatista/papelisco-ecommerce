'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import styles from './Profile.module.scss';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            email: userData.email || '',
          });
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
    } else if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [isLoggedIn, user, dispatch, router]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setUser(data.user));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Profile Header */}
      <header className={styles.profileHeader}>
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
              Back to Store
            </Link>
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/settings" className={styles.navLink}>
              Settings
            </Link>
          </nav>

          <div className={styles.userSection}>
            <span className={styles.welcomeText}>Profile</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className={styles.profileContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <Link href="/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>Profile</span>
            </nav>
            <h1 className={styles.pageTitle}>My Profile</h1>
            <p className={styles.pageSubtitle}>Manage your personal information and account details</p>
          </div>

          <div className={styles.profileLayout}>
            {/* User Info Card */}
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                {user?.image ? (
                  <img src={user.image} alt={user.firstName || user.email} />
                ) : (
                  <span className={styles.avatarInitial}>
                    {(user?.firstName || user?.email || '').charAt(0).toUpperCase()}
                  </span>
                )}
                <button className={styles.changeAvatarBtn} title="Change Profile Picture">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M9.5 0.5a1 1 0 0 0-1.414 0L2 7.586V12a1 1 0 0 0 1 1h4.414l6.086-6.086a1 1 0 0 0 0-1.414l-4-4zM4 8.414l5.5-5.5 2.586 2.586L6.586 11H4V8.414z"/>
                  </svg>
                </button>
              </div>
              
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.firstName || user?.email}
                </h2>
                <p className={styles.userEmail}>{user?.email}</p>
                <div className={styles.userMeta}>
                  <span className={`${styles.roleBadge} ${styles[user?.role?.toLowerCase() || '']}`}>
                    {user?.role}
                  </span>
                  <span className={`${styles.statusBadge} ${user?.isVerified ? styles.verified : styles.unverified}`}>
                    {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
                <p className={styles.memberSince}>
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Personal Information</h2>
              
              {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className={`${styles.input} ${styles.disabled}`}
                      disabled
                      placeholder="Email cannot be changed"
                    />
                    <small className={styles.helpText}>
                      Email address cannot be changed. Contact support if needed.
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        phone: user?.phone || '',
                        email: user?.email || '',
                      });
                      setMessage(null);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Account Statistics */}
            <div className={styles.statsCard}>
              <h2 className={styles.cardTitle}>Account Overview</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 4h10v2H7V4zm0 4h10v2H7V8zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                    </svg>
                  </div>
                  <div className={styles.statContent}>
                    <h3>Total Orders</h3>
                    <p className={styles.statValue}>0</p>
                    <span className={styles.statLabel}>Orders placed</span>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className={styles.statContent}>
                    <h3>Account Status</h3>
                    <p className={styles.statValue}>{user?.isVerified ? 'Verified' : 'Pending'}</p>
                    <span className={styles.statLabel}>Email verification</span>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className={styles.statContent}>
                    <h3>Member Level</h3>
                    <p className={styles.statValue}>{user?.role || 'Customer'}</p>
                    <span className={styles.statLabel}>Account tier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.actionsCard}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              <div className={styles.actionGrid}>
                <Link href="/orders" className={styles.actionButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4h10v2H7V4zm0 4h10v2H7V8zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                  </svg>
                  <span>View Orders</span>
                </Link>

                <Link href="/settings" className={styles.actionButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                  <span>Account Settings</span>
                </Link>

                <Link href="/dashboard" className={styles.actionButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  <span>Dashboard</span>
                </Link>

                <button className={styles.actionButton} onClick={handleLogout}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
                    <path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}