
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

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

// Export storage for file uploads
export const storage = supabase.storage;

// Define the correct bucket name as a constant to avoid mismatches
export const PRODUCT_IMAGES_BUCKET = 'product-images';

// Export the Supabase URL for use in other parts of the app
export const SUPABASE_URL = supabaseUrl;
