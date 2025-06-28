import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase';
import ResultadoSimuladoClient from './resultado-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';



async function getSimuladoData(slug: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { simulado: null, questoes: null, progress: null, error: 'User not authenticated' };
  }

  const { data: simulado, error: simuladoError } = await supabase
    .from('simulados-personalizados')
    .select('id, slug, title, description')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  if (simuladoError || !simulado) {
    return { simulado: null, questoes: null, progress: null, error: 'Simulado not found' };
  }

  const { data: questoes, error: questoesError } = await supabase
    .from('simulado_questions')
    .select('id, question_text, alternatives, correct_answer, explanation')
    .eq('simulado_id', simulado.id)
    .is('deleted_at', null)
    .order('question_number', { ascending: true });

  if (questoesError || !questoes) {
    return { simulado, questoes: null, progress: null, error: 'Questoes not found' };
  }

  const { data: progress, error: progressError } = await supabase
    .from('user_simulado_progress')
    .select('answers, time_taken_minutes')
    .eq('user_id', user.id)
    .eq('simulado_id', simulado.id)
    .maybeSingle(); 

  if (progressError || !progress) {
    return { simulado, questoes, progress: null, error: 'Progress not found' };
  }

  return { simulado, questoes, progress, error: null };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const { simulado } = await getSimuladoData(slug);

  return {
    title: `Resultado: ${simulado?.title || 'Simulado'}`,
  };
}

export default async function ResultadoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { simulado, questoes, progress } = await getSimuladoData(slug);

  if (!simulado || !progress || !questoes) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <h2 className="text-xl font-semibold">Resultado não encontrado</h2>
        <p className="text-muted-foreground max-w-md">
          Não foi possível carregar os dados do resultado. Isso pode acontecer se você ainda não completou este simulado ou se ocorreu um erro.
        </p>
        <div className="flex gap-4">
          <Link href={`/dashboard/simulados-personalizados/${slug}`}>
            <Button>Tentar o Simulado</Button>
          </Link>
          <Link href="/dashboard/simulados-personalizados">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Simulados
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResultadoSimuladoClient
      id={simulado.slug}
      simulado={simulado}
      questoes={questoes}
      progress={progress}
    />
  );
}
