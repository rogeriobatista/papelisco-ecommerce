import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Papelisco',
  description: 'Manage your profile information',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}