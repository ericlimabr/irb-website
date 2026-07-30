import "server-only"
import { createClient } from "@/utils/supabase/server"

export interface UserData {
  id: string
  name: string
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
    name:
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "Administrador",
  }
}
