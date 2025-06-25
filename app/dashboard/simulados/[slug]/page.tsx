import { Metadata } from 'next';
import SimuladoClient from './simulado-client';
import { createServerSupabaseClient } from '@/lib/supabase';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const supabase = await createServerSupabaseClient();

  const { data: simulado } = await supabase
      .from('simulados')
      .select('title')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

  return {
    title: simulado?.title || 'Simulado',
  }
}

export default function SimuladoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <SimuladoClient slug={slug} />;
}