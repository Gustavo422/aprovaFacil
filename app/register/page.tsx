import { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Cadastro',
};

export default function RegisterPage() {
  return <RegisterClient />;
}
