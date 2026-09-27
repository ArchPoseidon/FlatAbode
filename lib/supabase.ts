import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let client: ReturnType<typeof createClient<Database>> | null = null;

// Service-role client, server-only. Never import this from a Client Component.
export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set');
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
