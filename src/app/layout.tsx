import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.scss";
import "../styles/layouts.scss";
import { Providers } from './providers';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import ConditionalLayout from '../components/ConditionalLayout';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papelisco Store",
  description: "E-commerce store for mobile phones, electronics, books, and more",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <ToastProvider>
              <div className="app-layout">
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <Footer />
                <CartDrawer />
              </div>
            </ToastProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
