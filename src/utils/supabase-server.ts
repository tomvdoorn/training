import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

export const createServerSupabaseClient = () => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    }
  });
}; 