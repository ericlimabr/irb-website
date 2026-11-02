import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente com a chave `service_role` do Supabase, a única que pode criar
 * usuário. NUNCA pode ser importado por componente de cliente: esta chave
 * ignora toda a política de acesso do banco, e no navegador ela seria pública.
 * O `server-only` acima é o que garante isso em tempo de build.
 *
 * Devolve `null` quando a chave não está configurada, em vez de explodir, no
 * mesmo espírito do getUser: a tela diz o que falta em vez de quebrar.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
