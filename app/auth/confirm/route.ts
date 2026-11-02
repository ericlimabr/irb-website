import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/server"
import { registraErro } from "@/lib/log-erro"

/**
 * Porta de entrada dos links que saem por e-mail (convite do painel e troca de
 * senha). O link traz um token de uso único; aqui ele é trocado por uma sessão
 * e a pessoa segue para a tela que o link pedir.
 *
 * Por que é uma rota de servidor e não uma página: a troca do token precisa
 * escrever o cookie de sessão, e só rota e action escrevem cookie no Next. No
 * navegador o token também apareceria no histórico.
 *
 * O `next` é filtrado de propósito: sem o filtro, qualquer um poderia montar
 * um link do site da igreja que joga a pessoa logada para fora, em outro
 * domínio. Só caminho interno passa.
 */

const DESTINO_PADRAO = "/definir-senha"

/** Aceita só caminho do próprio site. "//evil.com" é endereço externo. */
function destinoSeguro(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DESTINO_PADRAO
  }
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const destino = destinoSeguro(searchParams.get("next"))

  if (!tokenHash || !type) {
    redirect(`${DESTINO_PADRAO}?erro=link`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error) {
    // Link vencido ou já usado é o caso comum, e não é falha do site: a pessoa
    // precisa de um convite novo. Fica no log sem tocar o celular de ninguém.
    await registraErro({
      origem: "admin",
      codigo: "CONVITE_LINK_RECUSADO",
      mensagem: "Um link de convite ou de senha não foi aceito.",
      nivel: "AVISO",
      causa: error,
      avisar: false,
    })
    redirect(`${DESTINO_PADRAO}?erro=link`)
  }

  redirect(destino)
}
