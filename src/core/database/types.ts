import { Database } from '@/lib/database.types';

// Tipos baseados no schema do Supabase
export type Tables = Database['public']['Tables'];

// Tipos específicos para cada tabela
export type User = Tables['users']['Row'];
export type UserInsert = Tables['users']['Insert'];
export type UserUpdate = Tables['users']['Update'];

export type Concurso = Tables['concursos']['Row'];
export type ConcursoInsert = Tables['concursos']['Insert'];
export type ConcursoUpdate = Tables['concursos']['Update'];

export type Simulado = Tables['simulados']['Row'] & { slug: string };
export type SimuladoInsert = Tables['simulados']['Insert'];
export type SimuladoUpdate = Tables['simulados']['Update'];

export type SimuladoQuestion = Tables['simulado_questions']['Row'];
export type SimuladoQuestionInsert = Tables['simulado_questions']['Insert'];
export type SimuladoQuestionUpdate = Tables['simulado_questions']['Update'];

export type UserSimuladoProgress = Tables['user_simulado_progress']['Row'];
export type UserSimuladoProgressInsert = Tables['user_simulado_progress']['Insert'];
export type UserSimuladoProgressUpdate = Tables['user_simulado_progress']['Update'];

export type QuestaoSemanal = Tables['questoes_semanais']['Row'];
export type QuestaoSemanalInsert = Tables['questoes_semanais']['Insert'];
export type QuestaoSemanalUpdate = Tables['questoes_semanais']['Update'];

export type UserQuestaoSemanalProgress = Tables['user_questoes_semanais_progress']['Row'];
export type UserQuestaoSemanalProgressInsert = Tables['user_questoes_semanais_progress']['Insert'];
export type UserQuestaoSemanalProgressUpdate = Tables['user_questoes_semanais_progress']['Update'];

export type MapaAssunto = Tables['mapa_assuntos']['Row'];
export type MapaAssuntoInsert = Tables['mapa_assuntos']['Insert'];
export type MapaAssuntoUpdate = Tables['mapa_assuntos']['Update'];

export type UserMapaAssuntoStatus = Tables['user_mapa_assuntos_status']['Row'];
export type UserMapaAssuntoStatusInsert = Tables['user_mapa_assuntos_status']['Insert'];
export type UserMapaAssuntoStatusUpdate = Tables['user_mapa_assuntos_status']['Update'];

export type PlanoEstudo = Tables['planos_estudo']['Row'];
export type PlanoEstudoInsert = Tables['planos_estudo']['Insert'];
export type PlanoEstudoUpdate = Tables['planos_estudo']['Update'];

export type Flashcard = Tables['flashcards']['Row'];
export type FlashcardInsert = Tables['flashcards']['Insert'];
export type FlashcardUpdate = Tables['flashcards']['Update'];

export type UserFlashcardProgress = Tables['user_flashcard_progress']['Row'];
export type UserFlashcardProgressInsert = Tables['user_flashcard_progress']['Insert'];
export type UserFlashcardProgressUpdate = Tables['user_flashcard_progress']['Update'];

export type Apostila = Tables['apostilas']['Row'] & { slug: string };
export type ApostilaInsert = Tables['apostilas']['Insert'];
export type ApostilaUpdate = Tables['apostilas']['Update'];

export type ApostilaContent = Tables['apostila_content']['Row'];
export type ApostilaContentInsert = Tables['apostila_content']['Insert'];
export type ApostilaContentUpdate = Tables['apostila_content']['Update'];

export type UserApostilaProgress = Tables['user_apostila_progress']['Row'];
export type UserApostilaProgressInsert = Tables['user_apostila_progress']['Insert'];
export type UserApostilaProgressUpdate = Tables['user_apostila_progress']['Update'];

export type UserPerformanceCache = Tables['user_performance_cache']['Row'];
export type UserPerformanceCacheInsert = Tables['user_performance_cache']['Insert'];
export type UserPerformanceCacheUpdate = Tables['user_performance_cache']['Update'];

export type AuditLog = Tables['audit_logs']['Row'];
export type AuditLogInsert = Tables['audit_logs']['Insert'];
export type AuditLogUpdate = Tables['audit_logs']['Update'];

export type CacheConfig = Tables['cache_config']['Row'];
export type CacheConfigInsert = Tables['cache_config']['Insert'];
export type CacheConfigUpdate = Tables['cache_config']['Update'];

export type UserDisciplineStats = Tables['user_discipline_stats']['Row'];
export type UserDisciplineStatsInsert = Tables['user_discipline_stats']['Insert'];
export type UserDisciplineStatsUpdate = Tables['user_discipline_stats']['Update'];

// Tipos para queries com joins
export interface SimuladoWithConcurso extends Simulado {
  concursos: Concurso | null;
}

export interface SimuladoWithQuestions extends Simulado {
  simulado_questions: SimuladoQuestion[];
  concursos: Concurso | null;
}

export interface FlashcardWithProgress extends Flashcard {
  user_flashcard_progress: UserFlashcardProgress | null;
}

export interface ApostilaWithContent extends Apostila {
  apostila_content: ApostilaContent[];
}

export interface ApostilaContentWithProgress extends ApostilaContent {
  user_apostila_progress: UserApostilaProgress | null;
}

// Enums para valores específicos
export enum Difficulty {
  FACIL = 'Fácil',
  MEDIO = 'Médio',
  DIFICIL = 'Difícil'
}

export enum FlashcardStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEWING = 'reviewing',
  MASTERED = 'mastered'
}

export enum MapaAssuntoStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// Tipos para respostas de API
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para estatísticas
export interface PerformanceStats {
  totalSimulados: number;
  totalQuestoes: number;
  totalStudyTime: number;
  averageScore: number;
  accuracyRate: number;
  weeklyProgress: {
    simulados: number;
    questoes: number;
    studyTime: number;
    scoreImprovement: number;
  };
  disciplineStats: Array<{
    discipline: string;
    total_questions: number;
    correct_answers: number;
    accuracy_rate: number;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'simulado' | 'questao' | 'flashcard' | 'apostila';
  title: string;
  description: string;
  time: string;
  created_at: string;
}

// Tipos específicos para flashcards (baseados no schema atual)
export interface FlashcardProgressData {
  id: string;
  user_id: string;
  flashcard_id: string;
  acertou: boolean;
  tempo_resposta?: number;
  tentativas: number;
  ultima_revisao?: string;
  proxima_revisao?: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardFilters {
  concurso_id?: string;
  discipline?: string;
  tema?: string;
  nivel_dificuldade?: 'facil' | 'medio' | 'dificil';
}

export interface ApostilaFilters {
  concurso_id?: string;
  discipline?: string;
  tema?: string;
} 