import { createClient } from '@/lib/supabase';
import { SimuladosRepository } from '@/src/core/database/repositories/simulados-repository';
import { SimuladosService } from '../../simulados/services/simulados-service';
import { FlashcardsService } from '../../flashcards/services/flashcards-service';
import { ApostilasService } from '../../apostilas/services/apostilas-service';
import {
  RecentActivity,
} from '../../../core/database/types';
import { withServiceErrorHandling } from '@/src/features/shared/utils/serviceUtils';

export class DashboardService {
  private simuladosService: SimuladosService;
  private flashcardsService: FlashcardsService;
  private apostilasService: ApostilasService;

  constructor() {
    const supabase = createClient();
    this.simuladosService = new SimuladosService(new SimuladosRepository(supabase));
    this.flashcardsService = new FlashcardsService();
    this.apostilasService = new ApostilasService();
  }

  /**
   * Busca estatísticas consolidadas do usuário
   */
  async getUserStats(userId: string) {
    return withServiceErrorHandling(async () => {
      // Buscar estatísticas de cada domínio
      const [simuladosStats, flashcardsStats, apostilasStats] = await Promise.all([
        this.simuladosService.getUserPerformanceStats(userId),
        this.flashcardsService.getUserStats(userId),
        this.apostilasService.getUserStats(userId),
      ]);

      // Consolidar estatísticas
      const totalSimulados = simuladosStats.totalSimulados;
      const totalQuestoes = simuladosStats.totalQuestoes;
      const totalStudyTime = simuladosStats.totalStudyTime;
      const averageScore = simuladosStats.averageScore;
      const accuracyRate = simuladosStats.accuracyRate;

      // Calcular progresso semanal
      const weeklyProgress = {
        simulados: simuladosStats.weeklyProgress.simulados,
        questoes: simuladosStats.weeklyProgress.questoes,
        studyTime: simuladosStats.weeklyProgress.studyTime,
        scoreImprovement: simuladosStats.weeklyProgress.scoreImprovement,
      };

      // Estatísticas por disciplina (incluindo flashcards e apostilas)
      const disciplineStats = [
        ...simuladosStats.disciplineStats,
        {
          disciplina: 'Flashcards',
          total_questions: flashcardsStats.data?.total_flashcards || 0,
          correct_answers: flashcardsStats.data?.acertos || 0,
          accuracy_rate: flashcardsStats.data?.taxa_acerto || 0,
        },
        {
          disciplina: 'Apostilas',
          total_questions: apostilasStats.data?.total_apostilas || 0,
          correct_answers: apostilasStats.data?.apostilas_completadas || 0,
          accuracy_rate: apostilasStats.data?.progresso_medio || 0,
        },
      ];

      return {
        totalSimulados,
        totalQuestoes,
        totalStudyTime,
        averageScore,
        accuracyRate,
        weeklyProgress,
        disciplineStats,
      };
    });
  }

  /**
   * Busca atividades recentes do usuário
   */
  async getRecentActivities(userId: string, limit: number = 10) {
    return withServiceErrorHandling(async () => {
      const supabase = createClient();
      const activities: RecentActivity[] = [];

      // Buscar simulados recentes
      const { data: simuladosProgress } = await supabase
        .from('user_simulado_progress')
        .select(`
          id,
          completed_at,
          simulados (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (simuladosProgress) {
        simuladosProgress.forEach(progress => {
          activities.push({
            id: progress.id,
            type: 'simulado',
            title: (progress.simulados as { title?: string })?.title || 'Simulado',
            description: `Completado com sucesso`,
            time: this.formatRelativeTime(progress.completed_at),
            created_at: progress.completed_at,
          });
        });
      }

      // Buscar progresso de flashcards recente
      const { data: flashcardsProgress } = await supabase
        .from('user_flashcard_progress')
        .select(`
          id,
          updated_at,
          flashcards (
            id,
            pergunta
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (flashcardsProgress) {
        flashcardsProgress.forEach(progress => {
          activities.push({
            id: progress.id,
            type: 'flashcard',
            title: 'Flashcard',
            description: (progress.flashcards as { pergunta?: string })?.pergunta?.substring(0, 50) + '...' || 'Flashcard estudado',
            time: this.formatRelativeTime(progress.updated_at),
            created_at: progress.updated_at,
          });
        });
      }

      // Buscar progresso de apostilas recente
      const { data: apostilasProgress } = await supabase
        .from('user_apostila_progress')
        .select(`
          id,
          updated_at,
          apostila_content (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (apostilasProgress) {
        apostilasProgress.forEach(progress => {
          activities.push({
            id: progress.id,
            type: 'apostila',
            title: 'Apostila',
            description: (progress.apostila_content as { title?: string })?.title || 'Conteúdo estudado',
            time: this.formatRelativeTime(progress.updated_at),
            created_at: progress.updated_at,
          });
        });
      }

      // Ordenar por data e limitar
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    });
  }

  /**
   * Busca resumo do progresso diário
   */
  async getDailyProgress(userId: string) {
    return withServiceErrorHandling(async () => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const supabase = createClient();

      // Simulados completados hoje
      const { count: simuladosCompleted } = await supabase
        .from('user_simulado_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('completed_at', startOfDay.toISOString())
        .lt('completed_at', endOfDay.toISOString());

      // Flashcards estudados hoje
      const { count: flashcardsStudied } = await supabase
        .from('user_flashcard_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('updated_at', startOfDay.toISOString())
        .lt('updated_at', endOfDay.toISOString());

      // Apostilas progresso hoje
      const { count: apostilasProgress } = await supabase
        .from('user_apostila_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('updated_at', startOfDay.toISOString())
        .lt('updated_at', endOfDay.toISOString());

      // Tempo total de estudo (exemplo fictício)
      const totalStudyTime = (simuladosCompleted || 0) * 60 + (flashcardsStudied || 0) * 10 + (apostilasProgress || 0) * 20;

      return {
        date: today.toISOString().split('T')[0],
        simulados_completed: simuladosCompleted || 0,
        flashcards_studied: flashcardsStudied || 0,
        apostilas_progress: apostilasProgress || 0,
        total_study_time: totalStudyTime,
      };
    });
  }

  /**
   * Busca metas do usuário
   */
  async getUserGoals(_userId: string): Promise<{
    daily_goal_simulados: number;
    daily_goal_flashcards: number;
    daily_goal_study_time: number;
    weekly_goal_score: number;
  }> {
    // Exemplo fictício
    return {
      daily_goal_simulados: 1,
      daily_goal_flashcards: 10,
      daily_goal_study_time: 120,
      weekly_goal_score: 80,
    };
  }

  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  }
} 