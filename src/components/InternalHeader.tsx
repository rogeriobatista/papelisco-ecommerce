'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

export default function InternalHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      dispatch(logout());
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header style={{ 
      background: 'var(--ctp-surface0)', 
      borderBottom: '1px solid var(--ctp-surface1)', 
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none', 
          color: 'var(--ctp-text)', 
          fontWeight: '600' 
        }}>
          <img src="/icon-logo.png" alt="Papelisco" style={{ 
            width: '40px', 
            height: '40px', 
            marginRight: '0.75rem', 
            borderRadius: '8px' 
          }} />
          <span style={{ 
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--ctp-blue), var(--ctp-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Papelisco
          </span>
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '2rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--ctp-subtext1)', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link href="/orders" style={{ color: 'var(--ctp-subtext1)', textDecoration: 'none' }}>
          My Orders
        </Link>
        <Link href="/profile" style={{ color: 'var(--ctp-subtext1)', textDecoration: 'none' }}>
          Profile
        </Link>
        <Link href="/settings" style={{ color: 'var(--ctp-subtext1)', textDecoration: 'none' }}>
          Settings
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <span style={{ color: 'var(--ctp-subtext1)', fontSize: '0.9rem' }}>
            Welcome, {user.firstName}!
          </span>
        )}
        <Link href="/" style={{
          padding: '0.5rem 1rem',
          background: 'var(--ctp-surface1)',
          color: 'var(--ctp-subtext1)',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          Back to Store
        </Link>
        <button onClick={handleLogout} style={{
          padding: '0.5rem 1rem',
          background: 'var(--ctp-red)',
          color: 'var(--ctp-base)',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </header>
  );
}