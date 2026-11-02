import "server-only"
import { createClient } from "@/utils/supabase/server"
import { ehDono } from "@/utils/dono"

export interface UserData {
  id: string
  /** O endereço com que a pessoa entrou. É o que distingue o dono. */
  email: string | null
  name: string
  /** Verdadeiro só para a conta da igreja. Ver utils/dono.ts. */
  ehDono: boolean
}

export async function getUser(): Promise<UserData | null> {
  // Auth not configured yet (no Supabase env): treat as signed-out instead of
  // throwing, so pages/actions that gate on getUser degrade gracefully.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return {
    id: user.id,
    email: user.email ?? null,
    ehDono: ehDono(user.email),
    name:
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "Administrador",
  }
}
