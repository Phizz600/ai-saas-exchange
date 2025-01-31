import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3MjQxNjAsImV4cCI6MjAyMjMwMDE2MH0.SbUXk6kbHxST6kG-ZKVo8KTHJDujrZ46TJl9TGqF4oo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});