"use server"

import { revalidatePath } from "next/cache"
import { getUser } from "@/utils/getUser"
import { createAdminClient } from "@/utils/supabase/admin"
import { sanitizeEmail, isValidEmail } from "@/utils/strings"
import { sendConviteAdminEmail } from "@/lib/mail"
import { registraErro } from "@/lib/log-erro"
import { SITE_URL } from "@/utils/siteUrl"
import { ehDono } from "@/utils/dono"

/**
 * Quem pode entrar no painel da igreja.
 *
 * Só o dono (utils/dono.ts) chega aqui: a tela não aparece no menu de mais
 * ninguém e cada função abaixo confere de novo, porque esconder o botão não
 * protege nada. Quem souber o endereço /admin/usuarios bate nesta checagem.
 *
 * O convite NÃO cria senha. O Supabase gera um link de uso único, nós mesmos
 * mandamos esse link pelo SMTP da igreja, e a pessoa escreve a senha dela em
 * /definir-senha. Senha nenhuma passa por e-mail, por este código ou pelo
 * banco em texto.
 *
 * Quando ela escreve essa senha, o WhatsApp da igreja recebe um aviso: o
 * convite é assíncrono e ninguém ficaria olhando esta tela para saber que
 * alguém entrou. Ver lib/aviso-acesso.ts.
 *
 * Importante sobre o que o convidado pode fazer: o painel não tem papéis.
 * Quem entra vê tudo o que o dono vê, menos esta tela. Enquanto não houver
 * papéis, convidar alguém é dar acesso inteiro.
 */

export interface UsuarioDoPainel {
  id: string
  email: string
  nome: string | null
  /** A conta da igreja, que não pode ser removida nem reconvidada. */
  ehDono: boolean
  /** ISO, formatado na tela com o fuso de Brasília. */
  criadoEm: string
  ultimoAcesso: string | null
  /** Falso enquanto o convite não foi aceito: ninguém entrou com essa conta. */
  jaEntrou: boolean
}

export type ListaDeUsuarios = {
  usuarios: UsuarioDoPainel[]
  /** O que impediu a leitura, em português, quando impediu. */
  aviso?: string
}

export type ConviteState = { erro?: string; ok?: string } | null

/** Sem a chave service_role nada aqui funciona, e a tela precisa dizer isso. */
const FALTA_CHAVE =
  "O convite precisa da chave service_role do Supabase na variável " +
  "SUPABASE_SERVICE_ROLE_KEY. Enquanto ela não estiver configurada, aqui e na " +
  "Vercel, esta tela não cria ninguém."

export async function listaUsuarios(): Promise<ListaDeUsuarios> {
  const atual = await getUser()
  if (!atual?.ehDono) return { usuarios: [], aviso: "Não autorizado." }

  const admin = createAdminClient()
  if (!admin) return { usuarios: [], aviso: FALTA_CHAVE }

  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })

  if (error) {
    await registraErro({
      origem: "admin",
      codigo: "USUARIOS_LISTA",
      mensagem: "Não foi possível ler a lista de usuários do painel.",
      causa: error,
      avisar: false,
    })
    return { usuarios: [], aviso: "Não foi possível ler a lista agora." }
  }

  const usuarios = data.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      nome:
        (u.user_metadata?.full_name as string | undefined) ??
        (u.user_metadata?.name as string | undefined) ??
        null,
      ehDono: ehDono(u.email),
      criadoEm: u.created_at,
      ultimoAcesso: u.last_sign_in_at ?? null,
      jaEntrou: !!u.last_sign_in_at,
    }))
    .sort((a, b) => {
      if (a.ehDono !== b.ehDono) return a.ehDono ? -1 : 1
      return a.criadoEm.localeCompare(b.criadoEm)
    })

  return { usuarios }
}

export async function convidaUsuario(
  _prev: ConviteState,
  formData: FormData,
): Promise<ConviteState> {
  const atual = await getUser()
  if (!atual?.ehDono) return { erro: "Não autorizado." }

  const email = sanitizeEmail(String(formData.get("email") ?? ""))
  const nome = String(formData.get("nome") ?? "").trim()

  if (!email) return { erro: "Informe o e-mail de quem vai receber o acesso." }
  if (!isValidEmail(email)) return { erro: "Esse e-mail não parece válido." }
  if (ehDono(email)) {
    return { erro: "Esse é o endereço desta conta: ela já tem acesso." }
  }

  const admin = createAdminClient()
  if (!admin) return { erro: FALTA_CHAVE }

  // `generateLink` com type "invite" cria a conta SEM senha e devolve o token,
  // sem mandar e-mail nenhum: o envio é nosso, logo abaixo.
  //
  // Sem `redirectTo` de propósito. Ele só serve ao link pronto que o Supabase
  // devolve (`action_link`), que não usamos: montamos o nosso apontando para
  // /auth/confirm. Assim o convite não depende da lista de URLs de
  // redirecionamento do painel do Supabase, que é mais uma coisa para
  // configurar e mais uma para esquecer.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    // `convidadoEm` marca a conta como nascida de um convite nosso. É o que
    // permite avisar no WhatsApp quando ela criar a senha, sem confundir isso
    // com uma troca de senha de quem já usava o painel: ver lib/aviso-acesso.ts.
    options: {
      data: {
        ...(nome ? { full_name: nome } : {}),
        convidadoEm: new Date().toISOString(),
      },
    },
  })

  if (error || !data?.properties?.hashed_token) {
    // Já convidado é o caso comum, e não é falha de sistema: não vale log.
    const msg = String(error?.message ?? "").toLowerCase()
    if (
      msg.includes("already been registered") ||
      msg.includes("already exists")
    ) {
      return {
        erro:
          "Esse e-mail já tem acesso ao painel. Se a pessoa perdeu a senha, " +
          "ela mesma pede uma nova na tela de entrada.",
      }
    }
    await registraErro({
      origem: "admin",
      codigo: "USUARIOS_CONVITE",
      mensagem: "Não foi possível gerar o convite para o painel.",
      causa: error,
      contato: email,
    })
    return { erro: "Não foi possível gerar o convite agora. Tente de novo." }
  }

  const link =
    `${SITE_URL}/auth/confirm` +
    `?token_hash=${encodeURIComponent(data.properties.hashed_token)}` +
    `&type=invite&next=${encodeURIComponent("/definir-senha")}`

  const enviado = await sendConviteAdminEmail({ email, nome, link })

  if (!enviado.success) {
    await registraErro({
      origem: "admin",
      codigo: "USUARIOS_CONVITE_EMAIL",
      mensagem:
        "A conta foi criada, mas o e-mail do convite não saiu. O acesso " +
        "existe e está sem senha.",
      contato: email,
    })
    return {
      erro:
        "A conta foi criada, mas o e-mail do convite não saiu. Reenvie o " +
        "convite pela lista abaixo.",
    }
  }

  revalidatePath("/admin/usuarios")
  return { ok: `Convite enviado para ${email}.` }
}

/**
 * Manda outro link para quem já foi convidado e ainda não entrou. Serve para
 * o caso em que o primeiro e-mail não chegou ou foi perdido. Não mexe em quem
 * já criou senha: para esses, o caminho é a própria pessoa pedir nova senha.
 */
export async function reenviaConvite(
  _prev: ConviteState,
  formData: FormData,
): Promise<ConviteState> {
  const atual = await getUser()
  if (!atual?.ehDono) return { erro: "Não autorizado." }

  const email = sanitizeEmail(String(formData.get("email") ?? ""))
  if (!email || !isValidEmail(email)) return { erro: "E-mail inválido." }
  if (ehDono(email)) return { erro: "Essa é a conta da igreja." }

  const admin = createAdminClient()
  if (!admin) return { erro: FALTA_CHAVE }

  // "invite" num endereço que já existe é recusado pelo Supabase, então o
  // reenvio usa "recovery", que vale para conta existente e cai na mesma tela
  // de escrever a senha.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  })

  if (error || !data?.properties?.hashed_token) {
    await registraErro({
      origem: "admin",
      codigo: "USUARIOS_REENVIO",
      mensagem: "Não foi possível gerar o link de acesso novamente.",
      causa: error,
      contato: email,
    })
    return { erro: "Não foi possível gerar o link agora." }
  }

  const link =
    `${SITE_URL}/auth/confirm` +
    `?token_hash=${encodeURIComponent(data.properties.hashed_token)}` +
    `&type=recovery&next=${encodeURIComponent("/definir-senha")}`

  const enviado = await sendConviteAdminEmail({ email, nome: null, link })
  if (!enviado.success) return { erro: "O e-mail não saiu. Tente de novo." }

  revalidatePath("/admin/usuarios")
  return { ok: `Novo link enviado para ${email}.` }
}
