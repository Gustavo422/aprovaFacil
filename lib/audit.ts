import { createServerSupabaseClient } from './supabase';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ACCESS'
  | 'DOWNLOAD'
  | 'SHARE'
  | 'COMPLETE_SIMULADO'
  | 'COMPLETE_QUESTAO'
  | 'UPDATE_PROGRESS';

export interface AuditLogData {
  userId?: string | null;
  action: AuditAction;
  tableName: string;
  recordId?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private supabase = createServerSupabaseClient();

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Registra uma ação de auditoria
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      const headersList = await headers();
      const userAgent = headersList.get('user-agent') || null;
      const forwardedFor = headersList.get('x-forwarded-for') || null;
      const realIp = headersList.get('x-real-ip') || null;
      const ipAddress = forwardedFor || realIp || null;

      const { error } = await this.supabase.from('audit_logs').insert({
        user_id: data.userId,
        action: data.action,
        table_name: data.tableName,
        record_id: data.recordId,
        old_values: data.oldValues,
        new_values: data.newValues,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      });

      if (error) {
        logger.error('Erro ao registrar log de auditoria:', {
          error: error.message,
          details: error,
        });
      }
    } catch (error) {
      logger.error('Erro ao registrar log de auditoria:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Registra login do usuário
   */
  async logLogin(userId: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGIN',
      tableName: 'users',
      recordId: userId,
      newValues: { login_at: new Date().toISOString() },
    });
  }

  /**
   * Registra logout do usuário
   */
  async logLogout(userId: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGOUT',
      tableName: 'users',
      recordId: userId,
    });
  }

  /**
   * Registra criação de recurso
   */
  async logCreate(
    userId: string,
    tableName: string,
    recordId: string,
    newValues: unknown
  ): Promise<void> {
    await this.log({
      userId,
      action: 'CREATE',
      tableName,
      recordId,
      newValues,
    });
  }

  /**
   * Registra atualização de recurso
   */
  async logUpdate(
    userId: string,
    tableName: string,
    recordId: string,
    oldValues: unknown,
    newValues: unknown
  ): Promise<void> {
    await this.log({
      userId,
      action: 'UPDATE',
      tableName,
      recordId,
      oldValues,
      newValues,
    });
  }

  /**
   * Registra exclusão de recurso
   */
  async logDelete(
    userId: string,
    tableName: string,
    recordId: string,
    oldValues: unknown
  ): Promise<void> {
    await this.log({
      userId,
      action: 'DELETE',
      tableName,
      recordId,
      oldValues,
    });
  }

  /**
   * Registra acesso a recurso
   */
  async logAccess(
    userId: string,
    tableName: string,
    recordId: string
  ): Promise<void> {
    await this.log({
      userId,
      action: 'ACCESS',
      tableName,
      recordId,
    });
  }

  /**
   * Registra conclusão de simulado
   */
  async logSimuladoComplete(
    userId: string,
    simuladoId: string,
    score: number,
    timeTaken: number
  ): Promise<void> {
    await this.log({
      userId,
      action: 'COMPLETE_SIMULADO',
      tableName: 'user_simulado_progress',
      recordId: simuladoId,
      newValues: {
        score,
        time_taken_minutes: timeTaken,
        completed_at: new Date().toISOString(),
      },
    });
  }

  /**
   * Registra conclusão de questões semanais
   */
  async logQuestaoComplete(
    userId: string,
    questaoId: string,
    score: number
  ): Promise<void> {
    await this.log({
      userId,
      action: 'COMPLETE_QUESTAO',
      tableName: 'user_questoes_semanais_progress',
      recordId: questaoId,
      newValues: {
        score,
        completed_at: new Date().toISOString(),
      },
    });
  }

  /**
   * Registra atualização de progresso
   */
  async logProgressUpdate(
    userId: string,
    tableName: string,
    recordId: string,
    oldProgress: unknown,
    newProgress: unknown
  ): Promise<void> {
    await this.log({
      userId,
      action: 'UPDATE_PROGRESS',
      tableName,
      recordId,
      oldValues: oldProgress,
      newValues: newProgress,
    });
  }

  /**
   * Obtém logs de auditoria de um usuário
   */
  async getUserLogs(userId: string, limit: number = 50): Promise<unknown[]> {
    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Erro ao buscar logs do usuário:', {
          error: error.message,
          details: error,
        });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs do usuário:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Obtém logs de auditoria de um recurso específico
   */
  async getResourceLogs(
    tableName: string,
    recordId: string,
    limit: number = 50
  ): Promise<unknown[]> {
    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', tableName)
        .eq('record_id', recordId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Erro ao buscar logs do recurso:', {
          error: error.message,
          details: error,
        });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs do recurso:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Obtém logs de auditoria por período
   */
  async getLogsByPeriod(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<unknown[]> {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Erro ao buscar logs por período:', {
          error: error.message,
          details: error,
        });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar logs por período:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }
}

// Função utilitária para obter instância do logger
export const getAuditLogger = () => AuditLogger.getInstance();
