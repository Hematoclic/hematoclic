import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iyllteozniqgxoedkqha.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create a single supabase client for interacting with your database
// Use a placeholder key during build time to prevent errors
const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseAnonKey) {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please add it to your .env.local file.')
    console.warn('   Get your anon key from: https://supabase.com/dashboard/project/iyllteozniqgxoedkqha/settings/api')
    // Use a placeholder key during build time to allow static generation
    // The client won't work but it won't crash the build either
    return createClient(supabaseUrl, 'placeholder-key-for-build', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Client admin avec service role key (bypass RLS) - UNIQUEMENT côté serveur
const createSupabaseAdmin = (): SupabaseClient | null => {
  if (!supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdmin()

/**
 * Test the Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_test').select('count').limit(1)
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is fine for a connection test
      return { success: false, error: error.message }
    }
    
    return { success: true, message: 'Connected to Supabase successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

