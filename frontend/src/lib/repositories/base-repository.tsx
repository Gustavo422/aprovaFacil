import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type TableName = keyof Database['public']['Tables'];

export abstract class BaseRepository<T extends TableName> {
  protected tableName: T;

  constructor(tableName: T) {
    this.tableName = tableName;
  }

  // Basic CRUD operations
  async findById(id: string | number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(filters?: Record<string, any>) {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data;
  }

  async create(data: Database['public']['Tables'][T]['Insert']) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string | number, data: Partial<Database['public']['Tables'][T]['Update']>) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async delete(id: string | number) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Soft delete implementation
  async softDelete(id: string | number) {
    return this.update(id, { deleted_at: new Date().toISOString() } as any);
  }

  // Pagination support
  async paginate(page: number = 1, pageSize: number = 10, filters?: Record<string, any>) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) throw error;

    return {
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }
}
