import Link from "next/link"
import FaixaDeEstado from "@/components/features/admin/FaixaDeEstado"
import CartaoPendencia from "@/components/features/admin/CartaoPendencia"
import ResumoConferencia from "@/components/features/admin/ResumoConferencia"
import ResumoConsentimento from "@/components/features/admin/ResumoConsentimento"
import UltimosMovimentos from "@/components/features/admin/UltimosMovimentos"
import { resumoDoPainel } from "@/lib/painel"
import { siteEmManutencaoAgora } from "@/lib/manutencao"
import { getUser } from "@/utils/getUser"

/**
 * Visão geral do painel.
 *
 * A tela anterior tinha catorze cartões iguais em quatro fileiras, todos com o
 * mesmo peso: "mensagens não lidas" ao lado de "FAQs", que é zero e cuja tela
 * nem está montada. Dez dos catorze eram medição de cookies, que é diagnóstico
 * e não tarefa de ninguém. E as inscrições da conferência, que são o que a
 * igreja acompanha todo dia, não apareciam.
 *
 * A ordem agora é a da pergunta que a pessoa traz ao abrir o painel:
 *   1. o site está no ar? (só para a conta da igreja)
 *   2. tem algo esperando por mim?
 *   3. como vão as inscrições?
 *   4. e a medição? (uma caixa, não dez)
 *   5. o que aconteceu por último?
 *
 * A faixa de estado é da conta da igreja porque leva o atalho de tirar o site
 * do ar, e esse atalho responde 404 para as outras contas.
 *
 * Os atalhos do fim repõem o que o cartão "Ações Rápidas" tentava fazer. Ele
 * oferecia quatro botões para telas que não existem, três deles cinzas, e o
 * único clicável levava a /admin/publicacoes/novo, que não está no menu.
 */

const ATALHOS = [
  { href: "/admin/inscricoes", label: "Inscrições" },
  { href: "/admin/mensagens", label: "Mensagens" },
  { href: "/admin/erros", label: "Falhas do site" },
]

const quandoAgora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "full",
  timeStyle: "short",
})

export default async function AdminDashboardPage() {
  const [atual, dados] = await Promise.all([getUser(), resumoDoPainel()])
  const ehDono = !!atual?.ehDono
  // Só a conta da igreja vê a faixa, então só para ela o estado é consultado.
  const manutencao = ehDono ? await siteEmManutencaoAgora() : false

  const atalhos = ehDono
    ? [...ATALHOS, { href: "/admin/manutencao", label: "Manutenção" }]
    : ATALHOS

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Visão geral
        </h1>
        <p className="text-sm text-muted-foreground">
          {quandoAgora.format(new Date())}. Horário de Brasília.
        </p>
      </div>

      {ehDono && <FaixaDeEstado manutencao={manutencao} />}

      {/*
        Leitura que não deu certo aparece, em vez de virar zero em silêncio.
        O aviso nomeia o que não carregou, para a pessoa saber de qual número
        não pode confiar enquanto isso.
      */}
      {dados.naoLidos.length > 0 && (
        <p className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground">
          Não foi possível ler agora: {dados.naoLidos.join(", ")}. Os números
          desses blocos aparecem como travessão, e não como zero. Recarregue a
          página; se continuar, o motivo está no registro do servidor.
        </p>
      )}

      <section>
        <div className="mb-3">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Precisa de você
          </h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <CartaoPendencia
            valor={dados.mensagens?.naoLidas ?? null}
            titulo="Mensagens não lidas"
            detalhe={`de ${dados.mensagens?.total ?? 0} recebidas ao todo`}
            detalheZero={
              dados.mensagens?.total === 0
                ? "nenhuma mensagem recebida ainda"
                : `todas as ${dados.mensagens?.total ?? 0} já foram lidas`
            }
            href="/admin/mensagens"
          />
          <CartaoPendencia
            valor={dados.inscricoes?.aguardando ?? null}
            titulo="Inscrições a confirmar"
            detalhe="Pix ainda não conferido no extrato"
            detalheZero={
              dados.inscricoes?.total === 0
                ? "nenhuma inscrição ainda"
                : "todas as inscrições estão conciliadas"
            }
            href="/admin/inscricoes"
          />
          <CartaoPendencia
            valor={dados.falhas?.semBaixa ?? null}
            titulo="Falhas sem baixa"
            detalhe={`de ${dados.falhas?.total ?? 0} registradas ao todo`}
            /*
              Mesmo em zero o total aparece. Sem ele a tela dizia só "nada
              quebrado esperando olhada", e quem via duas falhas listadas em
              Falhas do site concluía que a visão geral estava errada: ela
              escondia justamente o número que explica o zero.
            */
            detalheZero={
              dados.falhas?.total
                ? `as ${dados.falhas.total} registradas já têm baixa`
                : "nenhuma falha registrada até hoje"
            }
            href="/admin/erros"
          />
        </div>
      </section>

      <ResumoConferencia dados={dados.inscricoes} />

      <ResumoConsentimento dados={dados.consentimento} />

      <UltimosMovimentos movimentos={dados.movimentos} />

      <section>
        <div className="mb-3">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Atalhos
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {atalhos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2.5 border border-border bg-card p-4 text-sm shadow-sm transition-colors hover:border-gold-500"
            >
              <s className="h-2 w-2 shrink-0 bg-gold-500 no-underline" />
              {a.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
