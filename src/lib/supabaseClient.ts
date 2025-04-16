
import { createClient } from '@supabase/supabase-js';

// These are placeholder values that will be replaced with your actual Supabase credentials
// when you connect the project to Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
