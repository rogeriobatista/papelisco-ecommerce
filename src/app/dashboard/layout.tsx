import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Papelisco',
  description: 'User Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}