import { Metadata } from 'next';
import ApostilasClient from './apostilas-client';

export const metadata: Metadata = {
  title: 'Apostilas',
};

export default function ApostilasPage() {
  return <ApostilasClient />;
}
