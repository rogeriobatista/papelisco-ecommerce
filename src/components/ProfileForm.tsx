'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setUser } from '@/features/auth/authSlice';
import styles from '@/styles/AuthForm.module.scss';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

export default function ProfileForm() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user in Redux store
        dispatch(setUser({ ...user, ...formData }));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {message && (
            <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
              {message.text}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className={styles.inputDisabled}
              placeholder="Your email address"
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Email cannot be changed
            </small>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Account Status</label>
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: user.isVerified ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${user.isVerified ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: user.isVerified ? '#16a34a' : '#dc2626'
            }}>
              {user.isVerified ? '✅ Verified Account' : '⚠️ Unverified Account'}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Member Since</label>
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown'}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}