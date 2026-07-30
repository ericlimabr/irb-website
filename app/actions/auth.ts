"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export type SignInState = { error?: string } | null

/**
 * Signs an admin in with Supabase email/password. On success sets the session
 * cookie and redirects to /admin; on failure returns an error for the form.
 * Shaped for React's useActionState (prevState, formData).
 */
export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Informe e-mail e senha." }
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { error: "Autenticação ainda não configurada." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "E-mail ou senha inválidos." }
  }

  revalidatePath("/admin", "layout")
  redirect("/admin")
}
