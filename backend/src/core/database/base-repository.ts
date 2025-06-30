import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { PaginatedResponse } from './types';
import { logger } from '@/lib/logger';

export abstract class BaseRepository<T, InsertT, UpdateT> {
  protected supabase: SupabaseClient<Database>;
  protected tableName: string;

  constructor(supabase: SupabaseClient<Database>, tableName: string) {
    this.supabase = supabase;
    this.tableName = tableName;
  }

  /**
   * Busca todos os registros com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      logger.error(`Erro ao buscar ${this.tableName}:`, { error });
      throw error; // Relança o erro original para tratamento na camada de serviço
    }
  }

  /**
   * Busca um registro por ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      logger.error(`Erro ao buscar ${this.tableName} por ID:`, { error });
      throw error;
    }
  }

  /**
   * Cria um novo registro
   */
  async create(data: InsertT): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return result;
    } catch (error) {
      logger.error(`Erro ao criar ${this.tableName}:`, { error });
      throw error;
    }
  }

  /**
   * Atualiza um registro
   */
  async update(id: string, data: UpdateT): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return result;
    } catch (error) {
      logger.error(`Erro ao atualizar ${this.tableName}:`, { error });
      throw error;
    }
  }

  /**
   * Remove um registro (soft delete se houver deleted_at)
   */
  async delete(id: string): Promise<void> {
    try {
      // Verificar se a tabela tem coluna deleted_at
      const { data: tableInfo } = await this.supabase
        .from(this.tableName)
        .select('deleted_at')
        .limit(1);

      const hasDeletedAt = tableInfo && tableInfo.length > 0 && 'deleted_at' in tableInfo[0];

      if (hasDeletedAt) {
        // Soft delete
        const { error } = await this.supabase
          .from(this.tableName)
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Hard delete
        const { error } = await this.supabase
          .from(this.tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
    } catch (error) {
      logger.error(`Erro ao deletar ${this.tableName}:`, { error });
      throw error;
    }
  }

  /**
   * Busca registros por filtros específicos
   */
  async findByFilters(filters: Record<string, unknown>): Promise<T[]> {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error(`Erro ao buscar ${this.tableName} por filtros:`, { error });
      throw error;
    }
  }

  /**
   * Conta registros com filtros opcionais
   */
  async count(filters?: Record<string, unknown>): Promise<number> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    } catch (error) {
      logger.error(`Erro ao contar ${this.tableName}:`, { error });
      throw error;
    }
  }
}