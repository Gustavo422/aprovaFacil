import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Export database types
export type Database = {
  // Define your database schema types here
  // Example:
  // public: {
  //   Tables: {
  //     your_table: {
  //       Row: { ... };
  //       Insert: { ... };
  //       Update: { ... };
  //     };
  //   };
  // };
};

// Re-export types from Supabase
export type { Session, User } from '@supabase/supabase-js';

// Helper type for tables
export type TableName = keyof Database['public']['Tables'];
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];
