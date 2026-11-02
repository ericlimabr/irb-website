import { notFound } from "next/navigation"
import { listaUsuarios } from "@/app/actions/usuarios"
import { getUser } from "@/utils/getUser"
import ConviteUsuarioForm from "@/components/features/admin/ConviteUsuarioForm"
import ReenviarConvite from "@/components/features/admin/ReenviarConvite"

/**
 * Quem entra no painel da igreja.
 *
 * Esta tela existe só para a conta da igreja (utils/dono.ts). Para qualquer
 * outra conta ela não aparece no menu E responde 404: esconder o item do menu
 * não é proteção, e quem digitasse o endereço entraria.
 *
 * O painel não tem papéis. Quem é convidado vê tudo o que a igreja vê, menos
 * esta tela. Está dito na própria página para ninguém convidar no escuro.
 *
 * A hora é a de Brasília, declarada no formatador: o servidor da Vercel roda
 * em UTC e sem isso a tela mostraria três horas à frente.
 */

const quando = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
})

export default async function UsuariosPage() {
  const atual = await getUser()
  if (!atual?.ehDono) notFound()

  const { usuarios, aviso } = await listaUsuarios()
  const semEntrar = usuarios.filter((u) => !u.jaEntrou && !u.ehDono)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Usuários
        </h1>
        <p className="text-sm text-muted-foreground">
          {usuarios.length === 0
            ? "Nenhum acesso listado."
            : `${usuarios.length} acesso(s)` +
              (semEntrar.length > 0
                ? `, ${semEntrar.length} ainda sem senha criada.`
                : ".")}{" "}
          Horário de Brasília.
        </p>
      </div>

      {aviso && (
        <p className="border border-destructive/40 bg-destructive/5 p-4 font-sans text-sm text-foreground">
          {aviso}
        </p>
      )}

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-bold text-foreground">
          Convidar alguém
        </h2>
        <p className="mb-5 mt-1 max-w-2xl text-sm text-muted-foreground">
          A pessoa recebe um e-mail com um link de uso único e cria a senha
          dela. Nenhuma senha é escolhida aqui nem viaja por e-mail. Atenção: o
          painel não tem níveis de acesso, então quem você convidar vê e edita
          tudo o que esta conta vê, menos esta tela de usuários.
        </p>
        <ConviteUsuarioForm />
      </section>

      {usuarios.length > 0 && (
        <section className="divide-y divide-border border border-border bg-card">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-medium text-foreground">
                  {u.nome ?? u.email}
                  {u.ehDono && (
                    <span className="ml-2 border border-primary/50 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-primary">
                      conta da igreja
                    </span>
                  )}
                </p>
                {u.nome && (
                  <p className="truncate font-sans text-xs text-muted-foreground">
                    {u.email}
                  </p>
                )}
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  Criado em {quando.format(new Date(u.criadoEm))}
                  {" · "}
                  {u.ultimoAcesso
                    ? `último acesso em ${quando.format(new Date(u.ultimoAcesso))}`
                    : "nunca entrou: convite pendente"}
                </p>
              </div>

              {!u.ehDono && !u.jaEntrou && <ReenviarConvite email={u.email} />}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
