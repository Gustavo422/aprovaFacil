import { SimuladosRepository } from '@/src/core/database/repositories/simulados-repository';
import {
  Simulado,
  SimuladoInsert,
  SimuladoUpdate,
  SimuladoWithConcurso,
  SimuladoWithQuestions,
  SimuladoQuestion,
  UserSimuladoProgress,
  UserSimuladoProgressInsert,
  PerformanceStats,
} from '@/src/core/database/types';

export class SimuladosService {
  private repository: SimuladosRepository;

  constructor(repository: SimuladosRepository) {
    this.repository = repository;
  }

  /**
   * Busca todos os simulados com paginação
   */
  async getSimulados(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, unknown>
  ) {
    return this.repository.findAllWithConcurso(page, limit, filters);
  }

  /**
   * Busca um simulado específico com suas questões
   */
  async getSimuladoById(id: string): Promise<SimuladoWithQuestions | null> {
    return this.repository.findByIdWithQuestions(id);
  }

  /**
   * Busca simulados por concurso
   */
  async getSimuladosByConcurso(concursoId: string): Promise<SimuladoWithConcurso[]> {
    return this.repository.findByConcurso(concursoId);
  }

  /**
   * Busca simulados públicos
   */
  async getPublicSimulados(page: number = 1, limit: number = 10) {
    return this.repository.findPublicSimulados(page, limit);
  }

  /**
   * Cria um novo simulado
   */
  async createSimulado(simulado: SimuladoInsert): Promise<Simulado> {
    return this.repository.create(simulado);
  }

  /**
   * Cria um simulado com questões
   */
  async createSimuladoWithQuestions(
    simulado: SimuladoInsert,
    questions: Omit<SimuladoQuestion, 'id' | 'simulado_id' | 'created_at' | 'updated_at'>[]
  ): Promise<SimuladoWithQuestions> {
    return this.repository.createWithQuestions(simulado, questions);
  }

  /**
   * Atualiza um simulado
   */
  async updateSimulado(id: string, data: SimuladoUpdate): Promise<Simulado> {
    return this.repository.update(id, data);
  }

  /**
   * Remove um simulado
   */
  async deleteSimulado(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  /**
   * Salva o progresso do usuário em um simulado
   */
  async saveUserProgress(progress: UserSimuladoProgressInsert): Promise<UserSimuladoProgress> {
    return this.repository.saveUserProgress(progress);
  }

  /**
   * Busca o progresso do usuário em um simulado
   */
  async getUserProgress(userId: string, simuladoId: string): Promise<UserSimuladoProgress | null> {
    return this.repository.getUserProgress(userId, simuladoId);
  }

  /**
   * Calcula estatísticas de performance do usuário
   */
  async getUserPerformanceStats(userId: string): Promise<PerformanceStats> {
    const userStats = await this.repository.getUserStats(userId);
    
    if (!userStats.length) {
      return {
        totalSimulados: 0,
        totalQuestoes: 0,
        totalStudyTime: 0,
        averageScore: 0,
        accuracyRate: 0,
        weeklyProgress: {
          simulados: 0,
          questoes: 0,
          studyTime: 0,
          scoreImprovement: 0,
        },
        disciplineStats: [],
      };
    }

    const totalSimulados = userStats.length;
    const totalQuestoes = userStats.reduce((sum: number, stat: { simulados?: { questions_count?: number } }) => {
      const simulado = stat.simulados as { questions_count?: number };
      return sum + (simulado?.questions_count || 0);
    }, 0);
    const totalStudyTime = userStats.reduce((sum: number, stat: { time_taken_minutes?: number }) => sum + (stat.time_taken_minutes || 0), 0);
    const averageScore = userStats.reduce((sum: number, stat: { score: number }) => sum + stat.score, 0) / totalSimulados;

    // Calcular taxa de acerto (assumindo que score é percentual)
    const accuracyRate = averageScore;

    // Calcular progresso semanal
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyStats = userStats.filter((stat: { completed_at: string }) => 
      new Date(stat.completed_at) >= oneWeekAgo
    );

    const weeklyProgress = {
      simulados: weeklyStats.length,
      questoes: weeklyStats.reduce((sum: number, stat: { simulados?: { questions_count?: number } }) => {
        const simulado = stat.simulados as { questions_count?: number };
        return sum + (simulado?.questions_count || 0);
      }, 0),
      studyTime: weeklyStats.reduce((sum: number, stat: { time_taken_minutes?: number }) => sum + (stat.time_taken_minutes || 0), 0),
      scoreImprovement: 0, // Seria calculado comparando com semana anterior
    };

    // Calcular estatísticas por disciplina
    const disciplineMap = new Map<string, { total: number; correct: number }>();
    
    userStats.forEach(stat => {
      // Aqui você precisaria ter acesso às questões individuais para calcular por disciplina
      // Por enquanto, vamos usar uma estimativa baseada no score
      const simulado = stat.simulados as { questions_count?: number };
      const questionsCount = simulado?.questions_count || 0;
      const correctAnswers = Math.round((stat.score / 100) * questionsCount);
      
      // Assumindo que todos os simulados são da mesma disciplina por enquanto
      const discipline = 'Geral';
      const current = disciplineMap.get(discipline) || { total: 0, correct: 0 };
      disciplineMap.set(discipline, {
        total: current.total + questionsCount,
        correct: current.correct + correctAnswers,
      });
    });

    const disciplineStats = Array.from(disciplineMap.entries()).map(([discipline, stats]) => ({
      discipline,
      total_questions: stats.total,
      correct_answers: stats.correct,
      accuracy_rate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    }));

    return {
      totalSimulados,
      totalQuestoes,
      totalStudyTime,
      averageScore,
      accuracyRate,
      weeklyProgress,
      disciplineStats,
    };
  }

  /**
   * Valida se um usuário pode acessar um simulado
   */
  async canUserAccessSimulado(userId: string, simuladoId: string): Promise<boolean> {
    const simulado = await this.repository.findById(simuladoId);
    
    if (!simulado) return false;
    
    // Se o simulado é público, qualquer usuário pode acessar
    if (simulado.is_public) return true;
    
    // Se o simulado foi criado pelo usuário, ele pode acessar
    if (simulado.created_by === userId) return true;
    
    // Aqui você pode adicionar outras regras de acesso
    // Por exemplo, verificar se o usuário tem permissão específica
    
    return false;
  }

  /**
   * Calcula o score de um simulado baseado nas respostas
   */
  calculateScore(answers: Record<number, string>, questions: SimuladoQuestion[]): number {
    if (!questions.length) return 0;

    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / questions.length) * 100);
  }

  /**
   * Gera relatório detalhado de um simulado
   */
  async generateSimuladoReport(userId: string, simuladoId: string) {
    const simulado = await this.repository.findByIdWithQuestions(simuladoId);
    const progress = await this.repository.getUserProgress(userId, simuladoId);
    
    if (!simulado || !progress) {
      throw new Error('Simulado ou progresso não encontrado');
    }

    const answers = progress.answers as Record<number, string>;
    const questions = simulado.simulado_questions;
    
    const report = {
      simulado: {
        id: simulado.id,
        title: simulado.title,
        description: simulado.description,
        difficulty: simulado.difficulty,
        questionsCount: simulado.questions_count,
        timeMinutes: simulado.time_minutes,
      },
      progress: {
        score: progress.score,
        timeTaken: progress.time_taken_minutes,
        completedAt: progress.completed_at,
      },
      questions: questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correct_answer;
        
        return {
          number: question.question_number,
          text: question.question_text,
          userAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          explanation: question.explanation,
          discipline: question.discipline,
          topic: question.topic,
          difficulty: question.difficulty,
        };
      }),
      summary: {
        totalQuestions: questions.length,
        correctAnswers: questions.filter((_, index) => answers[index] === questions[index].correct_answer).length,
        accuracyRate: this.calculateScore(answers, questions),
        timePerQuestion: progress.time_taken_minutes / questions.length,
      },
    };

    return report;
  }
} 