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
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
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
          concurso_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          questions_count: number
          time_minutes: number
          difficulty: string
          created_at?: string
          concurso_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          questions_count?: number
          time_minutes?: number
          difficulty?: string
          created_at?: string
          concurso_id?: string | null
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
        }
        Insert: {
          id?: string
          user_id: string
          simulado_id: string
          score: number
          completed_at?: string
          time_taken_minutes: number
          answers: Json
        }
        Update: {
          id?: string
          user_id?: string
          simulado_id?: string
          score?: number
          completed_at?: string
          time_taken_minutes?: number
          answers?: Json
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
        }
        Insert: {
          id?: string
          title: string
          description: string
          week_number: number
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          week_number?: number
          year?: number
          created_at?: string
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
        }
        Insert: {
          id?: string
          user_id: string
          questoes_semanais_id: string
          score: number
          completed_at?: string
          answers: Json
        }
        Update: {
          id?: string
          user_id?: string
          questoes_semanais_id?: string
          score?: number
          completed_at?: string
          answers?: Json
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
        }
        Insert: {
          id?: string
          disciplina: string
          tema: string
          subtema?: string | null
          concurso_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          disciplina?: string
          tema?: string
          subtema?: string | null
          concurso_id?: string | null
          created_at?: string
        }
      }
      user_mapa_assuntos_status: {
        Row: {
          id: string
          user_id: string
          mapa_assunto_id: string
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mapa_assunto_id: string
          status: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mapa_assunto_id?: string
          status?: string
          updated_at?: string
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
          schedule: Json
        }
        Insert: {
          id?: string
          user_id: string
          concurso_id?: string | null
          start_date: string
          end_date: string
          created_at?: string
          schedule: Json
        }
        Update: {
          id?: string
          user_id?: string
          concurso_id?: string | null
          start_date?: string
          end_date?: string
          created_at?: string
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
        }
        Insert: {
          id?: string
          front: string
          back: string
          disciplina: string
          tema: string
          subtema?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          front?: string
          back?: string
          disciplina?: string
          tema?: string
          subtema?: string | null
          created_at?: string
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
        }
        Insert: {
          id?: string
          user_id: string
          flashcard_id: string
          status: string
          next_review: string
          review_count: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flashcard_id?: string
          status?: string
          next_review?: string
          review_count?: number
          updated_at?: string
        }
      }
      apostilas: {
        Row: {
          id: string
          title: string
          description: string
          concurso_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          concurso_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          concurso_id?: string | null
          created_at?: string
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
        }
        Insert: {
          id?: string
          apostila_id: string
          module_number: number
          title: string
          content_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          apostila_id?: string
          module_number?: number
          title?: string
          content_json?: Json
          created_at?: string
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
        }
        Insert: {
          id?: string
          user_id: string
          apostila_content_id: string
          completed: boolean
          progress_percentage: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          apostila_content_id?: string
          completed?: boolean
          progress_percentage?: number
          updated_at?: string
        }
      }
    }
  }
}
