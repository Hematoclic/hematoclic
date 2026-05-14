import { createBrowserClient } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const buildClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        '⚠️ NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante. ' +
        'Ajoutez-les à votre fichier .env.local.'
      )
    }
    return createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key-for-build',
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    )
  }

  if (typeof window !== 'undefined') {
    // Côté navigateur : session stockée dans les cookies pour permettre
    // au middleware serveur de la lire (protection des routes /admin).
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  // Côté serveur (server components / route handlers anonymes) :
  // pas de session, lectures publiques uniquement.
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const supabase = buildClient()

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('_test').select('count').limit(1)

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message }
    }

    return { success: true, message: 'Connected to Supabase successfully' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}
