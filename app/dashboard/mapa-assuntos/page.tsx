import { Metadata } from 'next';
import MapaAssuntosClient from './mapa-assuntos-client';

export const metadata: Metadata = {
  title: 'Mapa de Assuntos',
};

export default function MapaAssuntosPage() {
  return <MapaAssuntosClient />;
}
