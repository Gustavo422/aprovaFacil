import { Database } from '@/lib/database.types';

// ========================================
// TIPOS BASE DO BANCO DE DADOS
// ========================================

type Tables = Database['public']['Tables'];

// Categorias de Concurso
export type ConcursoCategoria = Tables['concurso_categorias']['Row'] & {
  created_by?: string | null;
  deleted_at?: string | null;
};
export type ConcursoCategoriaInsert = Tables['concurso_categorias']['Insert'];
export type ConcursoCategoriaUpdate = Tables['concurso_categorias']['Update'];

// Disciplinas por Categoria
export type CategoriaDisciplina = Tables['categoria_disciplinas']['Row'] & {
  created_by?: string | null;
  deleted_at?: string | null;
};
export type CategoriaDisciplinaInsert = Tables['categoria_disciplinas']['Insert'];
export type CategoriaDisciplinaUpdate = Tables['categoria_disciplinas']['Update'];

// Concursos
export type Concurso = Tables['concursos']['Row'] & {
  created_by?: string | null;
  deleted_at?: string | null;
};
export type ConcursoInsert = Tables['concursos']['Insert'];
export type ConcursoUpdate = Tables['concursos']['Update'];

// Preferências do Usuário por Concurso
export type UserConcursoPreference = Tables['user_concurso_preferences']['Row'] & {
  expires_at?: string | null;
};
export type UserConcursoPreferenceInsert = Tables['user_concurso_preferences']['Insert'];
export type UserConcursoPreferenceUpdate = Tables['user_concurso_preferences']['Update'];

// ========================================
// TIPOS DE CONTEÚDO FILTRADO
// ========================================

// Simulados
export type Simulado = Tables['simulados']['Row'] & {
  created_by?: string | null;
  deleted_at?: string | null;
};
export type SimuladoInsert = Tables['simulados']['Insert'];
export type SimuladoUpdate = Tables['simulados']['Update'];

// Questões de Simulado
export type SimuladoQuestion = Tables['simulado_questions']['Row'];
export type SimuladoQuestionInsert = Tables['simulado_questions']['Insert'];
export type SimuladoQuestionUpdate = Tables['simulado_questions']['Update'];

// Flashcards (REFATORADO: front/back, disciplina/tema)
export type Flashcard = Omit<Tables['flashcards']['Row'], 'pergunta' | 'resposta' | 'materia' | 'assunto'> & {
  front: string;
  back: string;
  discipline: string;
  tema: string;
  created_by?: string | null;
  deleted_at?: string | null;
};
export type FlashcardInsert = Omit<Tables['flashcards']['Insert'], 'pergunta' | 'resposta' | 'materia' | 'assunto'> & {
  front: string;
  back: string;
  discipline: string;
  tema: string;
};
export type FlashcardUpdate = Omit<Tables['flashcards']['Update'], 'pergunta' | 'resposta' | 'materia' | 'assunto'> & {
  front?: string;
  back?: string;
  discipline?: string;
  tema?: string;
};

// Apostilas
export type Apostila = Tables['apostilas']['Row'] & {
  slug: string;
  created_by?: string | null;
  deleted_at?: string | null;
};
export type ApostilaInsert = Tables['apostilas']['Insert'];
export type ApostilaUpdate = Tables['apostilas']['Update'];

// Mapa de Assuntos
export type MapaAssunto = Tables['mapa_assuntos']['Row'];
export type MapaAssuntoInsert = Tables['mapa_assuntos']['Insert'];
export type MapaAssuntoUpdate = Tables['mapa_assuntos']['Update'];

// ========================================
// NOVAS TABELAS ADICIONADAS
// ========================================

// Estatísticas por Disciplina do Usuário
export type UserDisciplineStats = Tables['user_discipline_stats']['Row'];
export type UserDisciplineStatsInsert = Tables['user_discipline_stats']['Insert'];
export type UserDisciplineStatsUpdate = Tables['user_discipline_stats']['Update'];

// Configuração de Cache
export type CacheConfig = Tables['cache_config']['Row'];
export type CacheConfigInsert = Tables['cache_config']['Insert'];
export type CacheConfigUpdate = Tables['cache_config']['Update'];

// ========================================
// ENUMS E CONSTANTES
// ========================================

export type ConcursoCategoriaSlug = 
  | 'guarda-municipal'
  | 'policia-civil'
  | 'tribunais'
  | 'receita-federal'
  | 'banco-brasil'
  | 'correios'
  | 'petrobras'
  | 'concurso-publico'
  | 'vestibular';

export type BancaOrganizadora = 
  | 'CESPE/CEBRASPE'
  | 'CESGRANRIO'
  | 'FGV'
  | 'VUNESP'
  | 'FEPESE'
  | 'FUNDEP'
  | 'IADES'
  | 'INEP'
  | 'FUVEST';

export type NivelDificuldade = 'Fácil' | 'Médio' | 'Difícil';

export type StatusAssunto = 'não_iniciado' | 'em_andamento' | 'concluído' | 'revisão';

// ========================================
// TIPOS DE RELACIONAMENTOS
// ========================================

// Concurso com Categoria
export interface ConcursoComCategoria extends Concurso {
  concurso_categorias: ConcursoCategoria;
}

// Simulado com Concurso
export interface SimuladoComConcurso extends Simulado {
  concursos: ConcursoComCategoria | null;
}

// Simulado com Questões
export interface SimuladoComQuestoes extends Simulado {
  simulado_questions: SimuladoQuestion[];
  concursos: ConcursoComCategoria | null;
}

// Flashcard com Concurso (REFATORADO)
export interface FlashcardComConcurso extends Flashcard {
  concursos: ConcursoComCategoria | null;
}

// Apostila com Concurso
export interface ApostilaComConcurso extends Apostila {
  concursos: ConcursoComCategoria | null;
}

// Mapa de Assunto com Concurso
export interface MapaAssuntoComConcurso extends MapaAssunto {
  concursos: ConcursoComCategoria | null;
}

// Categoria com Disciplinas
export interface CategoriaComDisciplinas extends ConcursoCategoria {
  categoria_disciplinas: CategoriaDisciplina[];
}

// Concurso com Categoria e Disciplinas
export interface ConcursoCompleto extends ConcursoComCategoria {
  categoria_disciplinas: CategoriaDisciplina[];
}

// ========================================
// TIPOS DE CONTEXTO
// ========================================

export interface ConcursoContext {
  categoria: ConcursoCategoria;
  concurso: Concurso;
  disciplines: CategoriaDisciplina[];
  userPreference: UserConcursoPreference;
}

export interface ConcursoContextWithContent extends ConcursoContext {
  simulados: SimuladoComConcurso[];
  flashcards: FlashcardComConcurso[];
  apostilas: ApostilaComConcurso[];
  mapaAssuntos: MapaAssuntoComConcurso[];
}

// ========================================
// TIPOS DE FILTROS
// ========================================

export interface ConcursoFilters {
  categoria_slug?: ConcursoCategoriaSlug;
  banca?: BancaOrganizadora;
  ano?: number;
  is_active?: boolean;
}

export interface ConteudoFilters {
  categoria_id?: string;
  discipline?: string;
  dificuldade?: NivelDificuldade;
  is_public?: boolean;
}

// ========================================
// TIPOS DE PROGRESSO
// ========================================

export interface UserProgress {
  simulados_completados: number;
  questoes_respondidas: number;
  questoes_corretas: number;
  tempo_total_estudo: number; // em minutos
  pontuacao_geral: number;
  ultima_atividade: string;
}

export interface DisciplinaProgress {
  discipline_id: string;
  discipline_nome: string;
  simulados_completados: number;
  questoes_respondidas: number;
  questoes_corretas: number;
  tempo_estudo: number; // em minutos
  pontuacao: number;
  ultima_atividade: string;
}

export interface ConcursoProgress {
  concurso_id: string;
  categoria_id: string;
  progresso_geral: UserProgress;
  progresso_disciplinas: DisciplinaProgress[];
  ultima_atualizacao: string;
}

// ========================================
// TIPOS DE PLANO DE ESTUDO
// ========================================

export interface PlanoEstudoCronograma {
  [discipline: string]: {
    horas_semanais: number;
    assuntos: string[];
    simulados_planejados: string[];
    flashcards_planejados: string[];
  };
}

export interface PlanoEstudoPersonalizado {
  id: string;
  user_id: string;
  concurso_id: string;
  categoria_id: string;
  data_inicio: string;
  data_fim: string;
  horas_diarias: number;
  cronograma: PlanoEstudoCronograma;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  deleted_at?: string | null;
}

// ========================================
// TIPOS DE VALIDAÇÃO
// ========================================

export interface ConcursoValidation {
  nome: string;
  categoria_id: string;
  banca: BancaOrganizadora;
  ano: number;
  edital_url?: string;
  data_prova?: string;
  vagas?: number;
  salario?: number;
}

export interface DisciplinaValidation {
  nome: string;
  peso: number; // 1-100
  horas_semanais: number; // >= 1
  ordem: number;
}

// ========================================
// TIPOS DE RESPOSTA DE API
// ========================================

export interface ConcursoApiResponse {
  data?: ConcursoComCategoria;
  error?: string;
  message?: string;
}

export interface ConteudoFiltradoResponse {
  data: {
    simulados: SimuladoComConcurso[];
    flashcards: FlashcardComConcurso[];
    apostilas: ApostilaComConcurso[];
    mapaAssuntos: MapaAssuntoComConcurso[];
  };
  total: number;
  page: number;
  limit: number;
}

export interface UserPreferenceResponse {
  data?: UserConcursoPreference;
  canChange: boolean;
  daysUntilChange?: number;
  error?: string;
}

// ========================================
// TIPOS DE CONFIGURAÇÃO
// ========================================

export interface CategoriaConfig {
  nome: string;
  slug: ConcursoCategoriaSlug;
  descricao: string;
  cor_primaria: string;
  cor_secundaria: string;
  disciplines: DisciplinaValidation[];
}

export interface SistemaConfig {
  max_troca_concurso_dias: number; // 120 dias (4 meses)
  max_horas_estudo_dia: number; // 8 horas
  max_simulados_semana: number; // 10 simulados
  max_flashcards_dia: number; // 50 flashcards
}

// ========================================
// TIPOS DE EVENTOS E AUDITORIA
// ========================================

export interface ConcursoSelectionEvent {
  user_id: string;
  concurso_id: string;
  categoria_id: string;
  selected_at: string;
  can_change_until: string;
}

export interface ConteudoAccessEvent {
  user_id: string;
  concurso_id: string;
  categoria_id: string;
  tipo_conteudo: 'simulado' | 'flashcard' | 'apostila' | 'mapa_assunto';
  conteudo_id: string;
  accessed_at: string;
}

// ========================================
// TIPOS DE CACHE
// ========================================

export interface ConteudoCache {
  key: string;
  data: ConteudoFiltradoResponse;
  expires_at: string;
  categoria_id: string;
}

export interface UserProgressCache {
  key: string;
  data: UserProgress;
  expires_at: string;
  user_id: string;
  concurso_id: string;
}

export interface CacheStats {
  total_entries: number;
  memory_usage: number;
  hit_rate: number;
  last_cleanup: string;
}

// ========================================
// TIPOS DE ESTATÍSTICAS AVANÇADAS
// ========================================

export interface UserDisciplineStatsExtended extends UserDisciplineStats {
  discipline_nome: string;
  categoria_nome: string;
  progresso_percentual: number;
  ranking_posicao?: number;
  tempo_medio_questao: number; // em segundos
  taxa_acerto: number; // 0-100
}

export interface ConcursoStats {
  concurso_id: string;
  total_usuarios: number;
  media_pontuacao: number;
  simulados_completados: number;
  tempo_medio_estudo: number;
  disciplines_mais_dificies: string[];
  disciplines_mais_faceis: string[];
}

// ========================================
// TIPOS DE NOTIFICAÇÕES E ALERTAS
// ========================================

export interface StudyReminder {
  user_id: string;
  concurso_id: string;
  tipo: 'simulado' | 'flashcard' | 'revisao' | 'meta_diaria';
  mensagem: string;
  data_lembrete: string;
  is_read: boolean;
}

export interface Achievement {
  user_id: string;
  concurso_id: string;
  tipo: 'simulados_completados' | 'questoes_corretas' | 'tempo_estudo' | 'disciplina_mastery';
  titulo: string;
  descricao: string;
  icone: string;
  data_conquista: string;
  valor_atingido: number;
  valor_meta: number;
}

// ========================================
// TIPOS DE EXPORTAÇÃO E RELATÓRIOS
// ========================================

export interface StudyReport {
  user_id: string;
  concurso_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  resumo: {
    tempo_total_estudo: number;
    simulados_completados: number;
    questoes_respondidas: number;
    taxa_acerto_geral: number;
    disciplines_estudadas: string[];
  };
  progresso_disciplinas: DisciplinaProgress[];
  simulados_realizados: {
    id: string;
    nome: string;
    data: string;
    pontuacao: number;
    tempo_gasto: number;
  }[];
  recomendacoes: string[];
}

// ========================================
// TIPOS DE UTILITÁRIOS
// ========================================

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface SearchParams {
  query?: string;
  filters?: ConteudoFilters;
  pagination?: PaginationParams;
}

// ========================================
// TIPOS DE ERRO E VALIDAÇÃO
// ========================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: ValidationError[];
  timestamp: string;
}

// ========================================
// TIPOS DE SEGURANÇA E AUTORIZAÇÃO
// ========================================

export interface ContentAccess {
  user_id: string;
  concurso_id: string;
  tipo_conteudo: 'simulado' | 'flashcard' | 'apostila' | 'mapa_assunto';
  conteudo_id: string;
  nivel_acesso: 'read' | 'write' | 'admin';
  expires_at?: string;
}

export interface UserPermissions {
  user_id: string;
  concurso_id: string;
  can_access_content: boolean;
  can_modify_preferences: boolean;
  can_view_statistics: boolean;
  can_export_data: boolean;
  permissions_granted_at: string;
  permissions_expire_at?: string;
}