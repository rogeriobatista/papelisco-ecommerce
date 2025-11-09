import { Suspense } from 'react';
import ProfileForm from '@/components/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings - Papelisco',
  description: 'Manage your Papelisco account settings',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileForm />
    </Suspense>
  );
}