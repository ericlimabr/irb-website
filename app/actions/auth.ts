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

export type SenhaState = { error?: string } | null

/**
 * Escreve a senha de quem acabou de aceitar um convite (ou pediu uma nova).
 *
 * O link do e-mail já virou sessão em /auth/confirm, então aqui só existe uma
 * pessoa possível: a que está com a sessão aberta. É por isso que não há
 * e-mail nem token neste formulário, e é por isso que ele não serve para
 * trocar a senha de mais ninguém.
 *
 * O piso de 8 caracteres é nosso, não do Supabase, que aceita 6 por padrão.
 */
export async function defineSenha(
  _prev: SenhaState,
  formData: FormData,
): Promise<SenhaState> {
  const senha = String(formData.get("password") ?? "")
  const confirmacao = String(formData.get("confirm") ?? "")
  const nome = String(formData.get("nome") ?? "").trim()

  if (senha.length < 8) {
    return { error: "A senha precisa de pelo menos 8 caracteres." }
  }
  if (senha !== confirmacao) {
    return { error: "As duas senhas digitadas não são iguais." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error:
        "O link não vale mais. Peça um convite novo para a conta da igreja.",
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: senha,
    ...(nome ? { data: { full_name: nome } } : {}),
  })

  if (error) {
    return { error: "Não foi possível salvar a senha. Tente outra." }
  }

  revalidatePath("/admin", "layout")
  redirect("/admin")
}
