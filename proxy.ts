import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * Guards the admin area. Runs only on /admin and /login (see matcher), so the
 * public site is never touched. Redirects signed-out users away from /admin and
 * signed-in users away from /login. If Supabase isn't configured yet, it does
 * nothing (so /login and the admin shell still render).
 *
 * Next 16 uses the "proxy" file convention (formerly "middleware").
 *
 * Também fecha a porta do convite pela metade. O link do e-mail abre uma
 * sessão de verdade ao ser clicado, antes de a pessoa escrever qualquer senha.
 * Sem o desvio abaixo, quem clicasse no link e digitasse /admin entrava no
 * painel inteiro sem senha nenhuma e sem gerar o aviso no WhatsApp, até a
 * sessão vencer. Agora essa sessão só chega em /definir-senha.
 *
 * O teste é o par de marcas que o convite deixa (ver app/actions/usuarios.ts):
 * `convidadoEm` sem `senhaDefinidaEm` quer dizer convite aceito pela metade.
 * NÃO basta testar a ausência de `senhaDefinidaEm`: a conta da igreja é
 * anterior a essas marcas e não tem nenhuma das duas, e o desvio a prenderia
 * para sempre numa tela de criar senha que ela não precisa.
 */

/** Convite clicado e senha nunca escrita. */
function faltaEscreverSenha(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return false
  return (
    typeof metadata.convidadoEm === "string" &&
    typeof metadata.senhaDefinidaEm !== "string"
  )
}
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (!user && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && faltaEscreverSenha(user.user_metadata)) {
    return NextResponse.redirect(new URL("/definir-senha", request.url))
  }

  if (user && path === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
