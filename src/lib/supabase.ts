import { createClient } from '@supabase/supabase-js';

/* const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key'; */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL veya SUPABASE_ANON_KEY ortam degiskenleri ayarlanmamis');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Supabase degerlerini projenin Settings > API kisimindan alabilirsiniz.
 */