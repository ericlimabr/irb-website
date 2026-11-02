import { notFound } from "next/navigation"
import BotaoManutencao from "@/components/features/admin/BotaoManutencao"
import { siteEmManutencaoAgora } from "@/lib/manutencao"
import { getUser } from "@/utils/getUser"
import { CHURCH_DOMAIN } from "@/const"

/**
 * Tirar o site do ar, e devolver.
 *
 * Esta tela existe só para a conta da igreja (utils/dono.ts), como a de
 * usuários, e pelo mesmo raciocínio: o painel não tem papéis, e derrubar o
 * site é a ação de maior alcance que existe aqui. Para qualquer outra conta
 * ela não aparece no menu E responde 404 — esconder o item do menu não é
 * proteção, e quem digitasse o endereço entraria. Para liberar a qualquer
 * sessão, basta o `ehDono` sair daqui e da action.
 *
 * O interruptor é o mesmo campo `maintenanceMode` que a tela de configurações
 * já mostrava desde o começo do projeto. A diferença é que agora alguém lê o
 * valor: antes, ligar não fazia nada.
 *
 * O estado é lido direto do banco, sem cache, porque esta é a tela de
 * controle: ela tem de mostrar o que vale agora, e não o que valia quando a
 * página pública foi montada.
 */

const AFETADAS = [
  { rota: "/", o_que: "o site inteiro: início, sobre, agenda, confissões" },
  { rota: "/conferencia", o_que: "a página da conferência e as inscrições" },
  { rota: "/campanha/…", o_que: "as landing pages do tráfego pago" },
  { rota: "/links", o_que: "a página de links da bio" },
]

const PRESERVADAS = [
  { rota: "/admin", o_que: "este painel, por onde o site volta ao ar" },
  { rota: "/login", o_que: "a entrada do painel" },
]

export default async function ManutencaoPage() {
  const atual = await getUser()
  if (!atual?.ehDono) notFound()

  const manutencao = await siteEmManutencaoAgora()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Manutenção
          </h1>
          <p className="text-sm text-muted-foreground">
            {manutencao
              ? `O site está FORA DO AR. Quem abre ${CHURCH_DOMAIN} vê a tela de manutenção.`
              : `O site está no ar, em ${CHURCH_DOMAIN}.`}
          </p>
        </div>

        <BotaoManutencao manutencao={manutencao} />
      </div>

      {manutencao && (
        <p className="border border-amber-600/40 bg-amber-50 p-4 font-sans text-sm text-amber-900">
          Enquanto estiver assim, ninguém consegue se inscrever na conferência,
          e o dinheiro gasto em anúncio cai numa tela de espera. Devolva o site
          ao ar pelo mesmo botão quando terminar.
        </p>
      )}

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-bold text-foreground">
          O que acontece ao tirar do ar
        </h2>
        <p className="mb-5 mt-1 max-w-2xl text-sm text-muted-foreground">
          O endereço continua respondendo: nada fica inacessível nem dá erro.
          Cada página passa a mostrar uma tela com o logotipo da igreja, dizendo
          que o site está em manutenção e deixando o e-mail de contato. Nada é
          apagado, e a volta é imediata.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
              Sai do ar
            </h3>
            <ul className="mt-3 space-y-2">
              {AFETADAS.map((i) => (
                <li key={i.rota} className="text-sm text-foreground">
                  <span className="font-mono text-xs text-amber-700">
                    {i.rota}
                  </span>
                  <span className="block text-muted-foreground">{i.o_que}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
              Continua funcionando
            </h3>
            <ul className="mt-3 space-y-2">
              {PRESERVADAS.map((i) => (
                <li key={i.rota} className="text-sm text-foreground">
                  <span className="font-mono text-xs text-gold-600">
                    {i.rota}
                  </span>
                  <span className="block text-muted-foreground">{i.o_que}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-bold text-foreground">
          Duas coisas que valem saber
        </h2>
        <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            A mudança aparece no site na hora. Se alguém estiver com uma página
            já aberta, ela só muda quando a pessoa recarregar.
          </li>
          <li>
            Esta tela é da conta da igreja. Quem for convidado para o painel não
            a vê, e não consegue tirar o site do ar.
          </li>
        </ul>
      </section>
    </div>
  )
}
