// Global type declarations

declare module 'lodash-es';
declare module 'ramda';
declare module 'axios';

// Add any other missing module declarations here

// Supabase client type extensions
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from: (table: string) => any; // Replace 'any' with your actual table types if available
  }
}

// Add any global type declarations here
