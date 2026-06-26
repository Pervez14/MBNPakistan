import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  rawSupabaseUrl && rawSupabaseUrl.startsWith('http')
    ? rawSupabaseUrl
    : 'https://clevjwiuldiowvtfvzjm.supabase.co';

const supabaseAnonKey =
  rawSupabaseAnonKey && rawSupabaseAnonKey.length > 10
    ? rawSupabaseAnonKey
    : 'missing-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
