export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
          deleted_at: string | null
          last_login_at: string | null
          study_time_minutes: number
          total_questions_answered: number
          total_correct_answers: number
          average_score: number
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          last_login_at?: string | null
          study_time_minutes?: number
          total_questions_answered?: number
          total_correct_answers?: number
          average_score?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          last_login_at?: string | null
          study_time_minutes?: number
          total_questions_answered?: number
          total_correct_answers?: number
          average_score?: number
        }
      }
      simulados: {
        Row: {
          id: string
          title: string
          description: string
          questions_count: number
          time_minutes: number
          difficulty: string
          created_at: string
          updated_at: string
          deleted_at: string | null
          concurso_id: string | null
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          questions_count: number
          time_minutes: number
          difficulty: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          concurso_id?: string | null
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          questions_count?: number
          time_minutes?: number
          difficulty?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          concurso_id?: string | null
          created_by?: string | null
          is_public?: boolean
        }
      }
      user_simulado_progress: {
        Row: {
          id: string
          user_id: string
          simulado_id: string
          score: number
          completed_at: string
          time_taken_minutes: number
          answers: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          simulado_id: string
          score: number
          completed_at?: string
          time_taken_minutes: number
          answers: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          simulado_id?: string
          score?: number
          completed_at?: string
          time_taken_minutes?: number
          answers?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      questoes_semanais: {
        Row: {
          id: string
          title: string
          description: string
          week_number: number
          year: number
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          week_number: number
          year: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          week_number?: number
          year?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
      }
      user_questoes_semanais_progress: {
        Row: {
          id: string
          user_id: string
          questoes_semanais_id: string
          score: number
          completed_at: string
          answers: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          questoes_semanais_id: string
          score: number
          completed_at?: string
          answers: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          questoes_semanais_id?: string
          score?: number
          completed_at?: string
          answers?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      mapa_assuntos: {
        Row: {
          id: string
          disciplina: string
          tema: string
          subtema: string | null
          concurso_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          disciplina: string
          tema: string
          subtema?: string | null
          concurso_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          disciplina?: string
          tema?: string
          subtema?: string | null
          concurso_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
      }
      user_mapa_assuntos_status: {
        Row: {
          id: string
          user_id: string
          mapa_assunto_id: string
          status: string
          updated_at: string
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mapa_assunto_id: string
          status: string
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mapa_assunto_id?: string
          status?: string
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
      }
      planos_estudo: {
        Row: {
          id: string
          user_id: string
          concurso_id: string | null
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          deleted_at: string | null
          schedule: Json
        }
        Insert: {
          id?: string
          user_id: string
          concurso_id?: string | null
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          schedule: Json
        }
        Update: {
          id?: string
          user_id?: string
          concurso_id?: string | null
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          schedule?: Json
        }
      }
      flashcards: {
        Row: {
          id: string
          front: string
          back: string
          disciplina: string
          tema: string
          subtema: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          front: string
          back: string
          disciplina: string
          tema: string
          subtema?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          front?: string
          back?: string
          disciplina?: string
          tema?: string
          subtema?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
      }
      user_flashcard_progress: {
        Row: {
          id: string
          user_id: string
          flashcard_id: string
          status: string
          next_review: string
          review_count: number
          updated_at: string
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          flashcard_id: string
          status: string
          next_review: string
          review_count: number
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          flashcard_id?: string
          status?: string
          next_review?: string
          review_count?: number
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
      }
      apostilas: {
        Row: {
          id: string
          title: string
          description: string
          concurso_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          concurso_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          concurso_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          is_public?: boolean
        }
      }
      apostila_content: {
        Row: {
          id: string
          apostila_id: string
          module_number: number
          title: string
          content_json: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          apostila_id: string
          module_number: number
          title: string
          content_json: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          apostila_id?: string
          module_number?: number
          title?: string
          content_json?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      user_apostila_progress: {
        Row: {
          id: string
          user_id: string
          apostila_content_id: string
          completed: boolean
          progress_percentage: number
          updated_at: string
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          apostila_content_id: string
          completed: boolean
          progress_percentage: number
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          apostila_content_id?: string
          completed?: boolean
          progress_percentage?: number
          updated_at?: string
          created_at?: string
          deleted_at?: string | null
        }
      }
      user_performance_cache: {
        Row: {
          id: string
          user_id: string
          cache_key: string
          cache_data: Json
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cache_key: string
          cache_data: Json
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cache_key?: string
          cache_data?: Json
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      cache_config: {
        Row: {
          id: string
          cache_key: string
          ttl_minutes: number
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cache_key: string
          ttl_minutes: number
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cache_key?: string
          ttl_minutes?: number
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_discipline_stats: {
        Row: {
          id: string
          user_id: string
          disciplina: string
          total_questions: number
          correct_answers: number
          average_score: number
          study_time_minutes: number
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          disciplina: string
          total_questions: number
          correct_answers: number
          average_score: number
          study_time_minutes: number
          last_activity: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          disciplina?: string
          total_questions?: number
          correct_answers?: number
          average_score?: number
          study_time_minutes?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
