import { createServerSupabaseClient } from "./supabase"
import { getAuditLogger } from "./audit"

export class SoftDeleteManager {
  private static instance: SoftDeleteManager
  private supabase = createServerSupabaseClient()
  private auditLogger = getAuditLogger()

  private constructor() {}

  public static getInstance(): SoftDeleteManager {
    if (!SoftDeleteManager.instance) {
      SoftDeleteManager.instance = new SoftDeleteManager()
    }
    return SoftDeleteManager.instance
  }

  /**
   * Executa soft delete de um registro
   */
  async softDelete(
    userId: string,
    tableName: string,
    recordId: string,
    reason?: string
  ): Promise<boolean> {
    try {
      // Buscar dados atuais antes do soft delete
      const { data: currentData, error: fetchError } = await this.supabase
        .from(tableName)
        .select('*')
        .eq('id', recordId)
        .single()

      if (fetchError || !currentData) {
        console.error('Erro ao buscar dados para soft delete:', fetchError)
        return false
      }

      // Executar soft delete
      const { error } = await this.supabase
        .from(tableName)
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) {
        console.error('Erro ao executar soft delete:', error)
        return false
      }

      // Registrar no log de auditoria
      await this.auditLogger.log({
        userId,
        action: 'DELETE',
        tableName,
        recordId,
        oldValues: currentData,
        newValues: { deleted_at: new Date().toISOString(), reason }
      })

      return true
    } catch (error) {
      console.error('Erro ao executar soft delete:', error)
      return false
    }
  }

  /**
   * Restaura um registro soft deleted
   */
  async restore(
    userId: string,
    tableName: string,
    recordId: string
  ): Promise<boolean> {
    try {
      // Buscar dados atuais
      const { data: currentData, error: fetchError } = await this.supabase
        .from(tableName)
        .select('*')
        .eq('id', recordId)
        .single()

      if (fetchError || !currentData) {
        console.error('Erro ao buscar dados para restauração:', fetchError)
        return false
      }

      // Restaurar registro
      const { error } = await this.supabase
        .from(tableName)
        .update({
          deleted_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) {
        console.error('Erro ao restaurar registro:', error)
        return false
      }

      // Registrar no log de auditoria
      await this.auditLogger.log({
        userId,
        action: 'UPDATE',
        tableName,
        recordId,
        oldValues: currentData,
        newValues: { deleted_at: null }
      })

      return true
    } catch (error) {
      console.error('Erro ao restaurar registro:', error)
      return false
    }
  }

  /**
   * Executa hard delete de registros soft deleted antigos
   */
  async hardDeleteOldRecords(
    tableName: string,
    daysToKeep: number = 365
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString()

      // Buscar registros soft deleted antigos
      const { data: oldRecords, error: fetchError } = await this.supabase
        .from(tableName)
        .select('id')
        .not('deleted_at', 'is', null)
        .lt('deleted_at', cutoffDate)

      if (fetchError) {
        console.error('Erro ao buscar registros antigos:', fetchError)
        return 0
      }

      if (!oldRecords || oldRecords.length === 0) {
        return 0
      }

      // Executar hard delete
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .in('id', oldRecords.map(record => record.id))

      if (error) {
        console.error('Erro ao executar hard delete:', error)
        return 0
      }

      // Registrar no log de auditoria
      await this.auditLogger.log({
        action: 'DELETE',
        tableName,
        newValues: {
          hard_deleted_count: oldRecords.length,
          cutoff_date: cutoffDate,
          reason: 'Automatic cleanup of old soft deleted records'
        }
      })

      return oldRecords.length
    } catch (error) {
      console.error('Erro ao executar hard delete de registros antigos:', error)
      return 0
    }
  }

  /**
   * Busca registros soft deleted
   */
  async getSoftDeletedRecords(
    tableName: string,
    userId?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      let query = this.supabase
        .from(tableName)
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar registros soft deleted:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar registros soft deleted:', error)
      return []
    }
  }

  /**
   * Verifica se um registro está soft deleted
   */
  async isSoftDeleted(tableName: string, recordId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('deleted_at')
        .eq('id', recordId)
        .single()

      if (error || !data) {
        return false
      }

      return data.deleted_at !== null
    } catch (error) {
      console.error('Erro ao verificar soft delete:', error)
      return false
    }
  }

  /**
   * Executa limpeza automática de registros antigos
   */
  async performAutomaticCleanup(): Promise<void> {
    const tables = [
      'user_simulado_progress',
      'user_questoes_semanais_progress',
      'user_flashcard_progress',
      'user_apostila_progress',
      'user_mapa_assuntos_status'
    ]

    const cleanupResults = []

    for (const table of tables) {
      try {
        const deletedCount = await this.hardDeleteOldRecords(table, 365) // Manter por 1 ano
        if (deletedCount > 0) {
          cleanupResults.push({ table, deletedCount })
        }
      } catch (error) {
        console.error(`Erro na limpeza da tabela ${table}:`, error)
      }
    }

    // Registrar resultado da limpeza
    if (cleanupResults.length > 0) {
      await this.auditLogger.log({
        action: 'DELETE',
        tableName: 'system',
        newValues: {
          cleanup_results: cleanupResults,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  /**
   * Exporta dados históricos antes do hard delete
   */
  async exportHistoricalData(
    tableName: string,
    recordIds: string[]
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .in('id', recordIds)

      if (error) {
        console.error('Erro ao exportar dados históricos:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao exportar dados históricos:', error)
      return []
    }
  }
}

// Função utilitária para obter instância do gerenciador
export const getSoftDeleteManager = () => SoftDeleteManager.getInstance()

// Middleware para soft delete automático
export async function withSoftDelete<T>(
  userId: string,
  tableName: string,
  recordId: string,
  action: () => Promise<T>
): Promise<T> {
  const softDeleteManager = getSoftDeleteManager()
  
  // Verificar se o registro já está soft deleted
  const isDeleted = await softDeleteManager.isSoftDeleted(tableName, recordId)
  if (isDeleted) {
    throw new Error('Registro não encontrado ou foi excluído')
  }

  return await action()
} 