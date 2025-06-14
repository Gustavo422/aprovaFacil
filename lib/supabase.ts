import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Cliente para uso no lado do cliente (componentes)
export const supabase = createClientComponentClient<Database>();

// Cliente para uso no lado do servidor (API routes, Server Actions)
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
