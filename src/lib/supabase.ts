import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    '[MainU] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in values.',
  )
}

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'anon')

export const STORAGE_BUCKET = 'rating-photos'
