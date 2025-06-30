import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface SimuladosProgress {
  id: string;
  user_id: string;
  simulado_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_minutes: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

interface DisciplineStat {
  disciplina: string;
  total_questoes: number;
  acertos: number;
  erros: number;
  average_score: number;
}

interface PerformanceHistoryItem {
  date: string;
  score: number;
  accuracy: number;
  studyTime: number;
}

interface DisciplineScore {
  name: string;
  score: number;
}

interface WeeklyStats {
  week: string;
  count: number;
  totalScore: number;
  averageScore: number;
}

interface PerformanceStats {
  totalSimulados: number;
  totalQuestoes: number;
  totalStudyTime: number;
  averageScore: number;
  accuracyRate: number;
  scoreImprovement: number;
  weeklyStats: WeeklyStats[];
  performanceHistory: PerformanceHistoryItem[];
  topDisciplines: DisciplineScore[];
  recentActivity: Array<{
    id: string;
    score: number;
    completed_at: string;
    title: string;
  }>;
  disciplineStats: Array<DisciplineStat & {
    accuracyRate: number;
    trend: 'up' | 'down' | 'stable';
    color: string;
  }>;
  goalProgress: {
    targetScore: number;
    currentScore: number;
    targetDate: string;
    daysRemaining: number;
    onTrack: boolean;
  };
  competitiveRanking: {
    position: number;
    totalUsers: number;
    percentile: number;
  };
}

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
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (progressError) {
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      );
    }

    const simuladosProgress: SimuladosProgress[] = progress || [];

    // Buscar estatísticas de disciplinas
    const { data: disciplineStats, error: disciplineError } = await supabase
      .rpc('get_discipline_stats', { user_id: user.id });

    if (disciplineError) {
      // Log error to server logs without exposing details to client
      console.error('Erro ao buscar estatísticas de disciplinas');
    }

    // Calcular métricas
    const totalSimulados = simuladosProgress.length;
    let totalQuestoes = 0;
    let totalStudyTime = 0;
    let totalScore = 0;

    // Calcular histórico de performance
    const performanceHistory: PerformanceHistoryItem[] = [];
    const last30Days = simuladosProgress.slice(0, 30);

    for (const p of last30Days) {
      if (!p.completed_at) continue;
      
      const date = new Date(p.completed_at).toLocaleDateString('pt-BR', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const correct = p.correct_answers || 0;
      const total = p.total_questions || 1;
      const accuracy = (correct / total) * 100;

      performanceHistory.push({
        date,
        score: p.score || 0,
        accuracy,
        studyTime: p.time_taken_minutes || 0,
      });

      totalQuestoes += p.total_questions || 0;
      totalStudyTime += p.time_taken_minutes || 0;
      totalScore += p.score || 0;
    }

    // Calcular progresso semanal
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Filter for recent progress (last 7 days)
    const _weeklyProgress = simuladosProgress.filter(p => 
      p.completed_at && 
      new Date(p.completed_at) >= oneWeekAgo
    ) || [];

    const weeklyStats: WeeklyStats[] = [];
    const simuladosLength = simuladosProgress.length;
    
    let scoreImprovement = 0;
    if (simuladosLength > 1) {
      const firstScore = simuladosProgress[0]?.score || 0;
      const lastScore = simuladosProgress[simuladosLength - 1]?.score || 0;
      scoreImprovement = lastScore > 0 ? ((firstScore - lastScore) / lastScore) * 100 : 0;
    }

    // Calcular progresso semanal detalhado
    interface WeeklyProgressData {
      count: number;
      totalScore: number;
      averageScore: number;
    }
    
    const weeklyProgressData: Record<string, WeeklyProgressData> = {};
    
    simuladosProgress.forEach(simulado => {
      if (!simulado.completed_at) return;
      
      const simuladoDate = new Date(simulado.completed_at);
      const weekKey = `Semana ${Math.floor(simuladoDate.getTime() / (7 * 24 * 60 * 60 * 1000))}`;
      
      if (!weeklyProgressData[weekKey]) {
        weeklyProgressData[weekKey] = {
          count: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      
      weeklyProgressData[weekKey].count++;
      weeklyProgressData[weekKey].totalScore += simulado.score || 0;
      weeklyProgressData[weekKey].averageScore = 
        weeklyProgressData[weekKey].totalScore / weeklyProgressData[weekKey].count;
    });
    
    // Converter para array
    Object.entries(weeklyProgressData).forEach(([week, data]) => {
      weeklyStats.push({
        week,
        ...data
      });
    });

    // Calcular métricas gerais
    const averageScore = totalSimulados > 0 ? totalScore / totalSimulados : 0;
    const accuracyRate = totalQuestoes > 0 ? (totalScore / totalQuestoes) * 100 : 0;
    
    // Simular estatísticas adicionais
    const approvalProbability = Math.min(100, Math.max(0, Math.round(averageScore * 1.2)));
    const _studyStreak = Math.floor(Math.random() * 30) + 1;

    // Calcular melhores disciplinas
    const topDisciplines: DisciplineScore[] = [];
    if (disciplineStats && disciplineStats.length > 0) {
      topDisciplines.push(
        ...disciplineStats
          .slice(0, 3)
          .map((stat: DisciplineStat) => ({
            name: stat.disciplina,
            score: Math.round(stat.average_score),
          }))
      );
    }

    // Simular ranking competitivo
    const totalUsers = 1000 + Math.floor(Math.random() * 500);
    const position = Math.max(1, Math.floor(totalUsers * (1 - approvalProbability / 100)));
    const percentile = Math.round((1 - position / totalUsers) * 100);

    // Preparar resposta
    const response: PerformanceStats = {
      totalSimulados,
      totalQuestoes,
      totalStudyTime,
      averageScore,
      accuracyRate,
      scoreImprovement,
      weeklyStats,
      performanceHistory: performanceHistory.reverse(),
      topDisciplines,
      recentActivity: simuladosProgress.slice(0, 5).map(s => ({
        id: s.id,
        score: s.score,
        completed_at: s.completed_at,
        title: `Simulado ${s.id.slice(0, 8)}`
      })),
      disciplineStats: (disciplineStats || []).map((stat: DisciplineStat, index: number) => ({
        ...stat,
        accuracyRate: stat.average_score || 0,
        trend: stat.average_score > 60 ? 'up' : stat.average_score > 40 ? 'stable' : 'down',
        color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'][index % 6],
      })),
      goalProgress: {
        targetScore: 70,
        currentScore: averageScore,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 90,
        onTrack: averageScore >= 70 * 0.7,
      },
      competitiveRanking: {
        position,
        totalUsers,
        percentile,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // Log error to server logs without exposing details to client
    console.error('Erro ao buscar estatísticas');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

