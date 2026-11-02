import Link from "next/link"
import Logo from "@/components/ui/Logo"
import DefinirSenhaForm from "@/components/features/admin/DefinirSenhaForm"
import { getUser } from "@/utils/getUser"

/**
 * Onde quem foi convidado escreve a própria senha.
 *
 * Só funciona com a sessão que /auth/confirm abriu a partir do link do
 * e-mail. Sem ela não há o que fazer nesta tela, e ela diz isso em vez de
 * mostrar um formulário que não salvaria nada.
 */

export const metadata = {
  title: "Criar senha de acesso",
  robots: { index: false, follow: false },
}

export default async function DefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>
}) {
  const { erro } = await searchParams
  const user = await getUser()

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden texture-grid px-6 py-16 bg-navy-900">
      <div className="relative z-10 w-full max-w-md bg-surface border border-border-subtle border-t-4 border-t-gold-500 p-8 sm:p-10">
        <div className="flex justify-center mb-8">
          <Logo
            variant="full"
            tone="navy"
            height={88}
            alt="Brasão da Igreja Reformada de Brasília"
            priority
          />
        </div>

        <p className="font-mono uppercase tracking-[0.2em] text-gold-500 text-center mb-3 text-2xs">
          Painel da igreja
        </p>

        {user ? (
          <>
            <h1
              className="font-serif font-light text-navy-700 text-center mb-8"
              style={{ fontSize: "var(--text-size-3xl)" }}
            >
              Crie a sua <em className="text-gold-500">senha</em>
            </h1>
            <p className="font-sans text-sm text-navy-700/70 text-center mb-8">
              Este acesso é do endereço {user.email}. A senha é só sua: ninguém
              da igreja a conhece.
            </p>
            <DefinirSenhaForm
              nomeAtual={user.name === "Administrador" ? null : user.name}
            />
          </>
        ) : (
          <>
            <h1
              className="font-serif font-light text-navy-700 text-center mb-6"
              style={{ fontSize: "var(--text-size-3xl)" }}
            >
              Este link não <em className="text-gold-500">vale mais</em>
            </h1>
            <p className="font-sans text-sm text-navy-700/70 text-center">
              {erro === "link"
                ? "O link do e-mail é de uso único e já foi usado, ou venceu."
                : "Abra esta tela pelo link que chegou no seu e-mail."}{" "}
              Peça um convite novo para a conta da igreja.
            </p>
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="font-mono uppercase tracking-[0.1em] text-navy-700/50 hover:text-gold-500 transition-colors duration-500 text-2xs"
              >
                Ir para a tela de entrada →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
