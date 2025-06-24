import { Metadata } from 'next';
import PlanoEstudosClient from './plano-estudos-client';

export const metadata: Metadata = {
  title: 'Plano de Estudos',
};

export default function PlanoEstudosPage() {
  return <PlanoEstudosClient />;
}
