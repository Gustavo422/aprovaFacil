import { Metadata } from 'next';
import { PlanoEstudosInteligenteClient } from './plano-estudos-inteligente-client';

export const metadata: Metadata = {
  title: 'Plano de Estudos Inteligente',
  description: 'Um plano de estudos personalizado baseado no seu desempenho e objetivos.',
};

export default function PlanoEstudosInteligentePage() {
  return <PlanoEstudosInteligenteClient />;
}
