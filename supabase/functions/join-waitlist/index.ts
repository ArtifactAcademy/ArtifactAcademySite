import { createClient } from '@supabase/supabase-js'
import { createJoinWaitlistHandler } from './handler.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Required Supabase server credentials are not configured.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const handler = createJoinWaitlistHandler(async (signup) => {
  const { error } = await supabase.from('interest_signups').insert(signup)
  return { error: error ? { code: error.code } : null }
})

Deno.serve(handler)
