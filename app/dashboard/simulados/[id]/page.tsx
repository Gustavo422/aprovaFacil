import { Metadata } from 'next';
import SimuladoClient from './simulado-client';
import { createServerSupabaseClient } from '@/lib/supabase';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  const { data: simulado } = await supabase
      .from('simulados')
      .select('title')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

  return {
    title: simulado?.title || 'Simulado',
  }
}

export default function SimuladoPage({ params }: { params: { id: string } }) {
  return <SimuladoClient params={params} />;
}
