// Initializes a Supabase client for static pages.
// Ensure you set `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` before importing this module.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  console.warn('Supabase config missing: set window.SUPABASE_URL and window.SUPABASE_ANON_KEY (see supabase-config.example.js)');
}

export const supabase = createClient(window.SUPABASE_URL || '', window.SUPABASE_ANON_KEY || '');
