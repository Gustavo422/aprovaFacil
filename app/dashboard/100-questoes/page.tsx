import { Metadata } from 'next';
import { QuestoesClient } from './100-questoes-client';

export const metadata: Metadata = {
  title: '100 Questões',
  description: 'Resolva 100 questões semanais para testar seus conhecimentos.',
};

export default function QuestoesPage() {
  return <QuestoesClient />;
}
