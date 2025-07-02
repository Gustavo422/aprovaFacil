import { z } from 'zod';

// Schema para Simulado
export const simuladoInsertSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  questions_count: z.number().min(1, 'Deve ter pelo menos 1 questão'),
  time_minutes: z.number().min(1, 'Tempo mínimo é 1 minuto'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil'], {
    errorMap: () => ({ message: 'Dificuldade deve ser Fácil, Médio ou Difícil' })
  }),
  concurso_id: z.string().uuid('ID do concurso deve ser um UUID válido').optional(),
  is_public: z.boolean().default(true),
  created_by: z.string().uuid('ID do criador deve ser um UUID válido').optional(),
});

export const simuladoUpdateSchema = simuladoInsertSchema.partial();

// Schema para SimuladoQuestion
export const simuladoQuestionInsertSchema = z.object({
  simulado_id: z.string().uuid('ID do simulado deve ser um UUID válido'),
  question_number: z.number().min(1, 'Número da questão deve ser maior que 0'),
  question_text: z.string().min(1, 'Texto da questão é obrigatório'),
  alternatives: z.record(z.string()).refine(
    (data) => Object.keys(data).length >= 2,
    'Deve ter pelo menos 2 alternativas'
  ),
  correct_answer: z.string().min(1, 'Resposta correta é obrigatória'),
  explanation: z.string().optional(),
  discipline: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']).optional(),
  concurso_id: z.string().uuid().optional(),
});

export const simuladoQuestionUpdateSchema = simuladoQuestionInsertSchema.partial().omit({ simulado_id: true });

// Schema para Flashcard
export const flashcardInsertSchema = z.object({
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  resposta: z.string().min(1, 'Resposta é obrigatória'),
  explicacao: z.string().optional(),
  materia: z.string().min(1, 'Matéria é obrigatória'),
  assunto: z.string().min(1, 'Assunto é obrigatório'),
  nivel_dificuldade: z.enum(['facil', 'medio', 'dificil'], {
    errorMap: () => ({ message: 'Nível deve ser facil, medio ou dificil' })
  }),
  concurso_id: z.string().uuid('ID do concurso deve ser um UUID válido'),
});

export const flashcardUpdateSchema = flashcardInsertSchema.partial();

// Schema para Apostila
export const apostilaInsertSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  concurso_id: z.string().uuid('ID do concurso deve ser um UUID válido').optional(),
});

export const apostilaUpdateSchema = apostilaInsertSchema.partial();

// Schema para ApostilaContent
export const apostilaContentInsertSchema = z.object({
  apostila_id: z.string().uuid('ID da apostila deve ser um UUID válido'),
  module_number: z.number().min(1, 'Número do módulo deve ser maior que 0'),
  title: z.string().min(1, 'Título é obrigatório'),
  content_json: z.any().refine(
    (data) => data !== null && data !== undefined,
    'Conteúdo JSON é obrigatório'
  ),
  concurso_id: z.string().uuid().optional(),
});

export const apostilaContentUpdateSchema = apostilaContentInsertSchema.partial().omit({ apostila_id: true });

// Schema para UserSimuladoProgress
export const userSimuladoProgressInsertSchema = z.object({
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),
  simulado_id: z.string().uuid('ID do simulado deve ser um UUID válido'),
  score: z.number().min(0).max(100, 'Score deve estar entre 0 e 100'),
  time_taken_minutes: z.number().min(0, 'Tempo deve ser maior ou igual a 0'),
  answers: z.any().refine(
    (data) => data !== null && data !== undefined,
    'Respostas são obrigatórias'
  ),
});

// Schema para UserFlashcardProgress
export const userFlashcardProgressInsertSchema = z.object({
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),
  flashcard_id: z.string().uuid('ID do flashcard deve ser um UUID válido'),
  acertou: z.boolean(),
  tempo_resposta: z.number().min(0).optional(),
  tentativas: z.number().min(0).default(1),
});

// Schema para UserApostilaProgress
export const userApostilaProgressInsertSchema = z.object({
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),
  apostila_content_id: z.string().uuid('ID do conteúdo da apostila deve ser um UUID válido'),
  completed: z.boolean().default(false),
  progress_percentage: z.number().min(0).max(100, 'Progresso deve estar entre 0 e 100').default(0),
});

// Função helper para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validação falhou: ${errorMessage}`);
    }
    throw error;
  }
} 