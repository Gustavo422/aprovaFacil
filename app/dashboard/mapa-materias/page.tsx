import { Metadata } from 'next';
import MapaMateriasClient from './mapa-materias-client';

export const metadata: Metadata = {
  title: 'Mapa de Matérias',
  description: 'Visualize e acompanhe seu progresso nas matérias do seu plano de estudos.',
};

export default function MapaMateriasPage() {
  return <MapaMateriasClient />;
}
