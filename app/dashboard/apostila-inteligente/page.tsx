import { Metadata } from 'next';
import { ApostilaInteligenteClient } from './apostila-inteligente-client';

export const metadata: Metadata = {
  title: 'Apostila Inteligente',
  description: 'Estude com nossa apostila inteligente que se adapta ao seu aprendizado.',
};

export default function ApostilaInteligentePage() {
  return <ApostilaInteligenteClient />;
}
