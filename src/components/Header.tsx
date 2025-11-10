"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { toggleCart } from '../features/cart/cartSlice';
import { authenticatedFetch, tokenStorage } from '../lib/authStorage';
import UserDropdown from './UserDropdown';
import CartIcon from './CartIcon';
import ThemeSwitcher from './ThemeSwitcher';
import styles from '../styles/Header.module.scss';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state: any) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authenticatedFetch('/api/auth/logout', {
        method: 'POST',
      });
      // Remove token from localStorage
      tokenStorage.removeToken();
      dispatch(logout());
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, remove the token locally
      tokenStorage.removeToken();
      dispatch(logout());
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <Link href="/" className={styles.logo}>
          <img 
            src="/icon-logo.png" 
            alt="Papelisco" 
            className={styles.logoImage}
          />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Products
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </nav>

        {/* User Section */}
        <div className={styles.userSection}>
          <ThemeSwitcher />
          {isLoggedIn && (
            <Link href="/wishlist" className={styles.wishlistIcon} title="Wishlist">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
          )}
          <CartIcon />
          {isLoggedIn ? (
            <UserDropdown 
              user={user} 
              onLogout={handleLogout}
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
            />
          ) : (
            <div className={styles.authButtons}>
              <Link 
                href="/auth/login"
                className={styles.loginBtn}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className={styles.signupBtn}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <ThemeSwitcher />
          </div>
          <Link href="/" className={styles.mobileNavLink}>
            Products
          </Link>
          <Link href="/about" className={styles.mobileNavLink}>
            About
          </Link>
          <Link href="/contact" className={styles.mobileNavLink}>
            Contact
          </Link>
          {!isLoggedIn && (
            <div className={styles.mobileAuthButtons}>
              <Link href="/auth/login" className={styles.mobileLoginBtn}>
                Login
              </Link>
              <Link href="/auth/register" className={styles.mobileSignupBtn}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}