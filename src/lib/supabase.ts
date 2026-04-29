import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'projects';
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseInstance;
}

export function createSupabaseServerClient() {
  return getSupabaseClient();
}

// Deprecated: Use getSupabaseClient() instead
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
