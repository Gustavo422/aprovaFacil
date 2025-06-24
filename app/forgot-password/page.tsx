import { Metadata } from 'next';
import ForgotPasswordClient from './forgot-password-client';

export const metadata: Metadata = {
  title: 'Recuperar Senha',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}

