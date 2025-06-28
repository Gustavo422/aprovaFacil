import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface SimuladoProgress {
  id: string;
  user_id: string;
  simulado_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_minutes: number;
  completed_at: string;
  answers?: string[];
}

interface SimuladoQuestion {
  id: string;
  simulado_id: string;
  discipline: string;
  correct_answer: string;
  deleted_at: string | null;
}

interface DisciplineStat {
  disciplina: string;
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
}

interface WeeklyStats {
  simuladosPersonalizados: number;
  questoes: number;
  studyTime: number;
  scoreImprovement: number;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar progresso do usuário em simulados
    const { data: progress, error: progressError } = await supabase
      .from('user_simulado_progress')
      .select('*')
      .eq('user_id', user.id) as { data: SimuladoProgress[] | null, error: any };

    if (progressError) {
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      );
    }

    // Calcular estatísticas
    const totalSimulados = progress?.length || 0;
    let totalQuestoes = 0;
    let totalStudyTime = 0;
    let totalScore = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;

    // Buscar questões dos simulados realizados
    if (progress && progress.length > 0) {
      const simuladoIds = progress.map(p => p.simulado_id);
      const { data: questoes, error: questoesError } = await supabase
        .from('simulado_questions')
        .select('*')
        .in('simulado_id', simuladoIds)
        .is('deleted_at', null) as { data: SimuladoQuestion[] | null, error: any };

      if (!questoesError && questoes) {
        // Calcular estatísticas por disciplina
        const disciplineStats = new Map<string, { total: number; correct: number }>();
        
        for (const p of progress) {
          const simuladoQuestoes = questoes.filter(q => q.simulado_id === p.simulado_id);
          totalQuestoes += simuladoQuestoes.length;
          totalStudyTime += p.time_taken_minutes || 0;
          totalScore += p.score || 0;

          // Calcular acertos por disciplina
          for (let i = 0; i < simuladoQuestoes.length; i++) {
            const questao = simuladoQuestoes[i];
            const userAnswer = p.answers?.[i];
            const isCorrect = userAnswer === questao.correct_answer;
            
            if (questao.discipline) {
              const existing = disciplineStats.get(questao.discipline);
              if (existing) {
                existing.total++;
                if (isCorrect) existing.correct++;
              } else {
                disciplineStats.set(questao.discipline, {
                  total: 1,
                  correct: isCorrect ? 1 : 0,
                });
              }
            }
            
            totalQuestions++;
            if (isCorrect) totalCorrectAnswers++;
          }
        }

        // Calcular estatísticas semanais (simplificado)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyProgress = progress?.filter(p => 
          p.completed_at && new Date(p.completed_at) >= oneWeekAgo
        ) || [];

        const weeklyStats: WeeklyStats = {
          simuladosPersonalizados: weeklyProgress.length,
          questoes: weeklyProgress.reduce((sum, p) => {
            const simuladoQuestoes = (questoes || []).filter((q: SimuladoQuestion) => q.simulado_id === p.simulado_id);
            return sum + simuladoQuestoes.length;
          }, 0),
          studyTime: weeklyProgress.reduce((sum, p) => sum + (p.time_taken_minutes || 0), 0),
          scoreImprovement: 0, // TODO: Implementar cálculo de melhoria
        };

        // Converter disciplina stats para array
        const disciplineStatsArray: DisciplineStat[] = Array.from(disciplineStats.entries()).map(([disciplina, stats]) => ({
          disciplina,
          total_questions: stats.total,
          correct_answers: stats.correct,
          accuracy_rate: (stats.correct / stats.total) * 100,
        }));

        return NextResponse.json({
          totalSimulados,
          totalQuestoes,
          totalStudyTime,
          averageScore: totalSimulados > 0 ? totalScore / totalSimulados : 0,
          accuracyRate: totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0,
          weeklyProgress: weeklyStats,
          disciplineStats: disciplineStatsArray,
        });
      }
    }

    // Retornar dados vazios se não houver progresso
    return NextResponse.json({
      totalSimulados: 0,
      totalQuestoes: 0,
      totalStudyTime: 0,
      averageScore: 0,
      accuracyRate: 0,
      weeklyProgress: {
        simuladosPersonalizados: 0,
        questoes: 0,
        studyTime: 0,
        scoreImprovement: 0,
      },
      disciplineStats: [],
    } as {
      totalSimulados: number;
      totalQuestoes: number;
      totalStudyTime: number;
      averageScore: number;
      accuracyRate: number;
      weeklyProgress: WeeklyStats;
      disciplineStats: DisciplineStat[];
    });

  } catch (error) {
    // Log error to server without exposing details to client
    console.error('Erro ao buscar estatísticas');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 