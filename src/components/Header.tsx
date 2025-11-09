"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { toggleCart } from '../features/cart/cartSlice';
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      dispatch(logout());
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
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