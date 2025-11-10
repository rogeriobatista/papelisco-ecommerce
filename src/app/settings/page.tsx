'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout, setUser } from '@/features/auth/authSlice';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './Settings.module.scss';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    newsletter: false,
    language: 'en',
    currency: 'USD',
    twoFactorAuth: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      // In a real app, you'd save these preferences to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        setLoading(true);
        try {
          // In a real app, you'd call the delete account API
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Logout and redirect to home
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          dispatch(logout());
          router.push('/auth/login');
        } catch (error) {
          setMessage('Failed to delete account. Please try again.');
          setLoading(false);
        }
      }
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
    <div className={styles.settingsPage}>
      {/* Settings Content */}
      <main className={styles.settingsContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Account Settings</h1>
            <p className={styles.pageSubtitle}>Manage your account preferences and privacy settings</p>
          </div>

          {message && (
            <div className={`${styles.message} ${message.includes('Failed') ? styles.error : styles.success}`}>
              {message}
            </div>
          )}

          <div className={styles.settingsGrid}>
            {/* Notification Settings */}
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🔔</span>
                Notifications
              </h2>
              
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Email Notifications</h3>
                    <p>Receive important updates via email</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Order Updates</h3>
                    <p>Get notified about order status changes</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.orderUpdates}
                      onChange={(e) => handlePreferenceChange('orderUpdates', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Marketing Emails</h3>
                    <p>Receive promotional offers and deals</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Newsletter</h3>
                    <p>Subscribe to our weekly newsletter</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎨</span>
                Appearance
              </h2>
              
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Dark Mode</h3>
                    <p>Use dark theme throughout the application</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Language</h3>
                    <p>Choose your preferred language</p>
                  </div>
                  <select
                    className={styles.selectInput}
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Currency</h3>
                    <p>Set your preferred currency</p>
                  </div>
                  <select
                    className={styles.selectInput}
                    value={preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="BRL">BRL (R$)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🔒</span>
                Security
              </h2>
              
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.twoFactorAuth}
                      onChange={(e) => handlePreferenceChange('twoFactorAuth', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                  <button className={styles.actionBtn}>
                    Change Password
                  </button>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Login Sessions</h3>
                    <p>Manage your active login sessions</p>
                  </div>
                  <button className={styles.actionBtn}>
                    View Sessions
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>⚠️</span>
                Account Actions
              </h2>
              
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Export Data</h3>
                    <p>Download a copy of your account data</p>
                  </div>
                  <button className={styles.actionBtn}>
                    Export Data
                  </button>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button 
                    className={`${styles.actionBtn} ${styles.dangerBtn}`}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className={styles.saveSection}>
            <button 
              className={styles.saveBtn}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}