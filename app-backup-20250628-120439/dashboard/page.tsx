import { Metadata } from 'next';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Visão geral do seu desempenho e progresso',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
