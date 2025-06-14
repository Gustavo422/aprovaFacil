import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { logger } from '@/lib/logger';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter a semana atual
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now.getTime() - startOfYear.getTime()) / 86400000 +
        startOfYear.getDay() +
        1) /
        7
    );

    // Buscar as questões semanais para a semana atual
    const { data: questoesSemanais, error } = await supabase
      .from('questoes_semanais')
      .select('*')
      .eq('week_number', weekNumber)
      .eq('year', now.getFullYear())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 é o código para "no rows returned"
      logger.error('Erro ao buscar questões semanais:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar questões semanais' },
        { status: 500 }
      );
    }

    // Se não houver questões para a semana atual, retornar mensagem informativa
    if (!questoesSemanais) {
      return NextResponse.json({
        message: 'Não há questões disponíveis para esta semana',
        weekNumber,
        year: now.getFullYear(),
      });
    }

    // Verificar se o usuário já respondeu as questões desta semana
    const { data: progress, error: progressError } = await supabase
      .from('user_questoes_semanais_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('questoes_semanais_id', questoesSemanais.id)
      .maybeSingle();

    if (progressError) {
      logger.error('Erro ao verificar progresso:', progressError);
    }

    // Buscar as questões associadas ao concurso da questão semanal
    let questoes = [];
    if (questoesSemanais.concurso_id) {
      const { data: questoesData, error: questoesError } = await supabase
        .from('simulado_questions')
        .select('*')
        .eq('concurso_id', questoesSemanais.concurso_id)
        .eq('deleted_at', null)
        .order('question_number', { ascending: true })
        .limit(10); // Limitar a 10 questões por semana

      if (questoesError) {
        logger.error('Erro ao buscar questões:', questoesError);
      } else {
        questoes = questoesData || [];
      }
    }

    return NextResponse.json({
      questoesSemanais,
      questoes,
      alreadyCompleted: !!progress,
      progress,
    });
  } catch (error) {
    logger.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
