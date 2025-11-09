import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Papelisco',
  description: 'Account settings and preferences',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}