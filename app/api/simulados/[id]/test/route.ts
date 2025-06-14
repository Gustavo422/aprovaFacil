import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { logger } from '@/lib/logger';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { id } = await params;

  try {
    logger.info('Testando busca de simulado:', { id });

    // Buscar detalhes do simulado sem verificar autenticação
    const { data: simulado, error: simuladoError } = await supabase
      .from('simulados')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (simuladoError) {
      logger.error('Erro ao buscar simulado:', {
        error: simuladoError.message,
        code: simuladoError.code,
        details: simuladoError.details,
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
      .eq('simulado_id', id)
      .is('deleted_at', null)
      .order('question_number', { ascending: true });

    if (questoesError) {
      logger.error('Erro ao buscar questões:', {
        error: questoesError.message,
        code: questoesError.code,
        details: questoesError.details,
      });
      return NextResponse.json(
        { error: 'Erro ao buscar questões', details: questoesError },
        { status: 500 }
      );
    }

    logger.info('Dados encontrados:', {
      simulado: simulado ? 'Sim' : 'Não',
      questoes: questoes ? questoes.length : 0,
    });

    return NextResponse.json({
      simulado,
      questoes,
      test: true,
    });
  } catch (error) {
    logger.error('Erro ao processar requisição:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
} 