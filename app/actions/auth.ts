"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { avisaConviteAceito } from "@/lib/aviso-acesso"
import { ehDono } from "@/utils/dono"

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
 *
 * É aqui que o aviso de acesso novo sai no WhatsApp, e por isso a leitura do
 * `user_metadata` acontece ANTES de salvar: depois de salvar, `senhaDefinidaEm`
 * já estaria preenchida e a primeira senha ficaria indistinguível de uma
 * troca. Ver lib/aviso-acesso.ts.
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

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>
  const foiConvidado = typeof metadata.convidadoEm === "string"
  const jaTinhaSenha = typeof metadata.senhaDefinidaEm === "string"

  const { error } = await supabase.auth.updateUser({
    password: senha,
    data: {
      ...(nome ? { full_name: nome } : {}),
      senhaDefinidaEm: new Date().toISOString(),
    },
  })

  if (error) {
    return { error: "Não foi possível salvar a senha. Tente outra." }
  }

  // Convidado estreando: avisa. Quem só pediu senha nova, não, e a conta da
  // igreja nunca, que não foi convidada por ninguém.
  if (foiConvidado && !jaTinhaSenha && !ehDono(user.email)) {
    await avisaConviteAceito({
      email: user.email ?? null,
      nome: nome || (metadata.full_name as string | undefined) || null,
    })
  }

  revalidatePath("/admin", "layout")
  redirect("/admin")
}
