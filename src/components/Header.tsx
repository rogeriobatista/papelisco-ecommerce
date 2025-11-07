"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { login, logout } from '../features/auth/authSlice';
import { toggleCart } from '../features/cart/cartSlice';
import UserDropdown from './UserDropdown';
import CartIcon from './CartIcon';
import styles from '../styles/Header.module.scss';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state: any) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    // Mock login - in a real app, this would redirect to login page or open modal
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/images/user-avatar.svg'
    };
    dispatch(login(mockUser));
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>📝</span>
          <span className={styles.logoText}>Papelisco</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Products
          </Link>
          <Link href="/categories" className={styles.navLink}>
            Categories
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
              <button 
                onClick={handleLogin} 
                className={styles.loginBtn}
              >
                Login
              </button>
              <button 
                className={styles.signupBtn}
              >
                Sign Up
              </button>
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
          <Link href="/" className={styles.mobileNavLink}>
            Products
          </Link>
          <Link href="/categories" className={styles.mobileNavLink}>
            Categories
          </Link>
          <Link href="/about" className={styles.mobileNavLink}>
            About
          </Link>
          <Link href="/contact" className={styles.mobileNavLink}>
            Contact
          </Link>
          {!isLoggedIn && (
            <div className={styles.mobileAuthButtons}>
              <button onClick={handleLogin} className={styles.mobileLoginBtn}>
                Login
              </button>
              <button className={styles.mobileSignupBtn}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}