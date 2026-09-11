import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function createIssuerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Trusted question issuance is not configured')
  // Never attach browser cookies or a user session to this privileged client.
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}})
}
