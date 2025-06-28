import { Metadata } from 'next';
import SimuladosClient from './simulados-client';
import { createServerSupabaseClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Simulados',
};

export default async function SimuladosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: simulados = [] } = await supabase
    .from('simulados')
    .select('*, concursos:concursos(*)');
  const { data: categorias = [] } = await supabase
    .from('concurso_categorias')
    .select('*');

  return <SimuladosClient simulados={simulados || []} categorias={categorias || []} />;
} 