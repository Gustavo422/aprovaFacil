import { Metadata } from 'next';
import QuestoesSemanaisClient from './questoes-semanais-client';

export const metadata: Metadata = {
  title: 'Questões Semanais',
};

export default function QuestoesSemanaisPage() {
  return <QuestoesSemanaisClient />;
}
