'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import InternalHeader from '@/components/InternalHeader';
import '@/styles/layouts.scss';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isInternalRoute = pathname && ['/dashboard', '/profile', '/settings', '/orders', '/wishlist'].some(route => 
    pathname.startsWith(route)
  );

  // For internal user routes (dashboard, profile, settings, orders)
  if (isInternalRoute) {
    return (
      <div className="internal-layout">
        <InternalHeader />
        <main className="internal-main">
          {children}
        </main>
      </div>
    );
  }

  // For public routes (home, product pages, cart, etc.)
  return (
    <div className="public-layout">
      <Header />
      <main className="public-main">
        {children}
      </main>
    </div>
  );
}