import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is missing. Check your .env file.');
  throw new Error('supabaseUrl is required.');
}
if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is missing. Check your .env file.');
  throw new Error('supabaseAnonKey is required.');
}

console.log('[Supabase] Using URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

export const storage = supabase.storage;
export const PRODUCT_IMAGES_BUCKET = 'product-images';
export const SUPABASE_URL = supabaseUrl;

supabase
  .from('profiles')
  .select('id')
  .limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('[Supabase] Connection error:', error);
    } else {
      console.log('[Supabase] Connection successful');
    }
  });
