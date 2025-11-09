"use client";

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { User } from '../features/auth/authSlice';
import styles from '../styles/UserDropdown.module.scss';

type Props = {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
};

export default function UserDropdown({ user, onLogout, isOpen, onToggle }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className={styles.userDropdown} ref={dropdownRef}>
      <button className={styles.userButton} onClick={onToggle}>
        <div className={styles.userAvatar}>
          {user.image ? (
            <img src={user.image} alt={user.firstName || user.email} />
          ) : (
            <span className={styles.avatarInitial}>
              {(user.firstName || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className={styles.userName}>
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.firstName || user.email}
        </span>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userNameLarge}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
          
          <div className={styles.divider}></div>
          
          <Link href="/profile" className={styles.menuItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-2.5 0-4.5 1.5-4.5 3.5v1h9v-1c0-2-2-3.5-4.5-3.5z"/>
            </svg>
            Profile
          </Link>
          
          <Link href="/orders" className={styles.menuItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12l-1 8H3L2 3zm1 1l.8 6h8.4l.8-6H3z"/>
              <path d="M5 1h6v1H5z"/>
            </svg>
            My Orders
          </Link>
          
          <Link href="/settings" className={styles.menuItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0-6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
              <path d="M6.5 1.5a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1-3 0v-1z"/>
            </svg>
            Settings
          </Link>
          
          <div className={styles.divider}></div>
          
          <button onClick={onLogout} className={styles.logoutItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 2h4v1H6V2zm0 11h4v1H6v-1zM2 8l3-3v2h6v2H5v2L2 8z"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}