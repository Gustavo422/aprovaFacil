import { createRouteHandlerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface UserSimuladoProgress {
  id: string;
  user_id: string;
  simulado_id: string;
  created_at: string;
  updated_at: string;
  simulados_personalizados?: {
    id: string;
    title: string;
  };
}

interface SimuladoQuestion {
  id: string;
  simulado_id: string;
  question_id: string;
  discipline?: string;
  topic?: string;
  correct_answer?: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface UserAnswer {
  answers?: string[];
  question_id: string;
  is_correct: boolean;
  // Add other specific fields that might be present in user answers
  [key: string]: unknown;
}

interface WeakPoint {
  discipline: string;
  tema: string;
  error_count: number;
  total_questions: number;
  error_rate?: number;
}

export async function GET() {
  try {
    const supabase = await createRouteHandlerClient();

    // Verificar se o usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar progresso do usuário em simulados-personalizados
    const { data: progress, error: progressError } = await supabase
      .from('user_simulado_progress')
      .select(`
        *,
        simulados_personalizados:simulados_personalizados!inner(
          id,
          title
        )
      `)
      .eq('user_id', user.id) as { data: UserSimuladoProgress[] | null, error: Error | null };

    if (progressError) {
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      );
    }

    if (!progress || progress.length === 0) {
      return NextResponse.json([]);
    }

    // Buscar questões dos simulados-personalizados realizados
    const simuladoIds = progress.map((p: UserSimuladoProgress) => p.simulado_id);
    const { data: questoes, error: questoesError } = await supabase
      .from('simulado_questions')
      .select('*')
      .in('simulado_id', simuladoIds)
      .is('deleted_at', null) as { data: SimuladoQuestion[] | null, error: Error | null };

    if (questoesError) {
      return NextResponse.json(
        { error: 'Erro ao buscar questões' },
        { status: 500 }
      );
    }

    // Calcular pontos fracos baseado no desempenho
    
    const weakPoints = new Map<string, WeakPoint>();

    for (const p of progress as unknown as (UserSimuladoProgress & UserAnswer)[]) {
      const simuladoQuestoes = (questoes || []).filter((q: SimuladoQuestion) => q.simulado_id === p.simulado_id);
      
      for (let i = 0; i < simuladoQuestoes.length; i++) {
        // Processar respostas do usuário com tipo explícito
        const userAnswers = p.answers as string[];
        const questao = simuladoQuestoes[i];
        const userAnswer = userAnswers?.[i];
        const isCorrect = userAnswer === questao.correct_answer;
        
        if (!isCorrect && questao.discipline && questao.topic) {
          const key = `${questao.discipline}-${questao.topic}`;
          const existing = weakPoints.get(key);
          
          if (existing) {
            existing.error_count++;
            existing.total_questions++;
          } else {
            weakPoints.set(key, {
              discipline: questao.discipline,
              tema: questao.topic,
              error_count: 1,
              total_questions: 1,
            });
          }
        } else if (questao.discipline && questao.topic) {
          const key = `${questao.discipline}-${questao.topic}`;
          const existing = weakPoints.get(key);
          
          if (existing) {
            existing.total_questions++;
          } else {
            weakPoints.set(key, {
              discipline: questao.discipline,
              tema: questao.topic,
              error_count: 0,
              total_questions: 1,
            });
          }
        }
      }
    }

    // Converter para array e calcular taxa de erro
    const weakPointsArray = Array.from(weakPoints.values())
      .map((point: WeakPoint) => ({
        discipline: point.discipline,
        tema: point.tema,
        error_count: point.error_count,
        total_questions: point.total_questions,
        error_rate: point.total_questions > 0 ? (point.error_count / point.total_questions) * 100 : 0,
      }))
      .filter((point: WeakPoint) => (point.error_rate || 0) > 0) // Apenas pontos com erros
      .sort((a: WeakPoint, b: WeakPoint) => (b.error_rate || 0) - (a.error_rate || 0)) // Ordenar por taxa de erro
      .slice(0, 10); // Top 10 pontos fracos

    return NextResponse.json(weakPointsArray);
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 