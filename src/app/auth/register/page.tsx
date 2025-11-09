import RegisterForm from '@/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Papelisco',
  description: 'Create your Papelisco account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}