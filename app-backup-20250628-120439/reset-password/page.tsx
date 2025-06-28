import { Metadata } from 'next';
import ResetPasswordClient from './reset-password-client';

export const metadata: Metadata = {
  title: 'Redefinir Senha',
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}

