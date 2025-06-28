import { createRouteHandlerClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    logger.info('Testando busca de simulado:', { slug });

    // Criar cliente Supabase corretamente
    const supabase = await createRouteHandlerClient();

    // Buscar detalhes do simulado pelo slug
    const { data: simulado, error: simuladoError } = await supabase
      .from('simulados-personalizados')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (simuladoError || !simulado) {
      logger.error('Erro ao buscar simulado:', {
        error: simuladoError?.message,
        simuladoSlug: slug,
      });
      return NextResponse.json(
        { error: 'Simulado não encontrado', details: simuladoError },
        { status: 404 }
      );
    }

    // Buscar as questões do simulado
    const { data: questoes, error: questoesError } = await supabase
      .from('simulado_questions')
      .select('*')
      .eq('simulado_id', simulado.id)
      .is('deleted_at', null)
      .order('question_number', { ascending: true });

    if (questoesError) {
      logger.error('Erro ao buscar questões:', {
        error: questoesError.message,
        simuladoSlug: slug,
      });
      return NextResponse.json(
        { error: 'Erro ao buscar questões', details: questoesError },
        { status: 500 }
      );
    }

    logger.info('Dados encontrados:', {
      simulado: simulado ? 'Sim' : 'Não',
      questoes: questoes ? questoes.length : 0,
      simuladoSlug: slug,
    });

    return NextResponse.json({
      simulado,
      questoes,
      test: true,
    });
  } catch (error) {
    logger.error('Erro ao processar requisição:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      simuladoSlug: slug,
    });
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
} 