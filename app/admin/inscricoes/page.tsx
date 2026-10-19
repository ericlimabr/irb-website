import { getInscricoes, toggleInscricaoPaga } from "@/app/actions/inscricao"
import BotaoApagarInscricao from "@/components/pages/conferencia/BotaoApagarInscricao"
import BotaoEncerrarInscricoes from "@/components/pages/conferencia/BotaoEncerrarInscricoes"
import { inscricoesEncerradasAgora } from "@/lib/inscricoes-estado"
import { brl, diasLabel, pessoasLabel } from "@/utils/inscricao"
import { CONFERENCE_EDITION, CONFERENCE_PATH } from "@/const"

/**
 * Inscrições da conferência, para conciliar com o extrato.
 *
 * O Pix não avisa que caiu, então esta tela existe para a igreja marcar à mão
 * o que já foi pago. A coluna do valor destaca os centavos, que são a
 * identificação: é por eles que a linha do extrato encontra a inscrição.
 *
 * `getInscricoes()` já exige sessão; sem ela a lista volta vazia.
 *
 * O botão de Excel aponta para /admin/inscricoes/excel, que monta o arquivo
 * na hora a partir do banco. Não existe planilha guardada em lugar nenhum: o
 * que a igreja baixa é sempre o estado daquele instante.
 *
 * O estado das inscrições é lido direto do banco, sem cache, porque esta é a
 * tela de controle: ela tem de mostrar o que vale agora, e não o que valia
 * quando a página pública foi montada.
 */

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

const VINCULO: Record<string, string> = {
  MEMBRO: "Membro ou congregado",
  OUTRA_IGREJA: "De outra igreja",
  CONVIDADO: "Convidado",
  SEM_IGREJA: "Sem igreja",
}

export default async function InscricoesPage() {
  const [inscricoes, encerrada] = await Promise.all([
    getInscricoes(),
    inscricoesEncerradasAgora(),
  ])

  const pagas = inscricoes.filter((i) => i.status === "PAGA")
  const aguardando = inscricoes.filter((i) => i.status === "AGUARDANDO")
  const pessoas = inscricoes.reduce((s, i) => s + i.adultos + i.criancas, 0)
  const recebido = pagas.reduce((s, i) => s + i.valor, 0)
  const aReceber = aguardando.reduce((s, i) => s + i.valor, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Inscrições
          </h1>
          <p className="text-sm text-muted-foreground">
            {CONFERENCE_EDITION} · {inscricoes.length} inscrição(ões), {pessoas}{" "}
            pessoa(s).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BotaoEncerrarInscricoes encerrada={encerrada} />

          <a
            href="/admin/inscricoes/excel"
            className={`border px-4 py-2 font-mono text-2xs uppercase tracking-[0.1em] transition-colors ${
              inscricoes.length === 0
                ? "pointer-events-none border-border text-muted-foreground opacity-50"
                : "border-gold-500 text-foreground hover:bg-gold-500 hover:text-navy-900"
            }`}
            aria-disabled={inscricoes.length === 0}
          >
            Baixar em Excel
          </a>
        </div>
      </div>

      {encerrada && (
        <p className="border-l-2 border-gold-500 bg-card px-4 py-3 text-sm text-muted-foreground">
          <b className="text-foreground">As inscrições estão encerradas.</b> A
          página <code>{CONFERENCE_PATH}</code> não mostra mais o formulário, e
          um envio que chegue de uma aba já aberta é recusado. As inscrições já
          gravadas continuam como estão.
        </p>
      )}

      <div className="grid gap-px bg-border sm:grid-cols-3">
        <div className="bg-card p-4">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground">
            Pagas
          </p>
          <p className="mt-1 font-serif text-2xl lining-nums text-foreground">
            {pagas.length}
          </p>
          <p className="text-sm text-muted-foreground">{brl(recebido)}</p>
        </div>
        <div className="bg-card p-4">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground">
            Aguardando
          </p>
          <p className="mt-1 font-serif text-2xl lining-nums text-foreground">
            {aguardando.length}
          </p>
          <p className="text-sm text-muted-foreground">{brl(aReceber)}</p>
        </div>
        <div className="bg-card p-4">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground">
            Pessoas esperadas
          </p>
          <p className="mt-1 font-serif text-2xl lining-nums text-foreground">
            {pessoas}
          </p>
          <p className="text-sm text-muted-foreground">
            adultos e crianças somados
          </p>
        </div>
      </div>

      {inscricoes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma inscrição ainda.
        </p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {inscricoes.map((i) => {
            const paga = i.status === "PAGA"
            const reais = Math.floor(i.valor / 100)
            return (
              <div
                key={i.id}
                className="flex flex-wrap items-center gap-4 px-4 py-3"
              >
                <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
                  {String(i.numero).padStart(4, "0")}
                </span>

                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {i.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i.email} · {i.whatsapp}
                  </p>
                  {i.pagador && (
                    <p className="text-xs text-muted-foreground">
                      Paga por {i.pagador}
                    </p>
                  )}
                </div>

                <div className="min-w-[150px] text-xs text-muted-foreground">
                  <p>{pessoasLabel(i.adultos, i.criancas)}</p>
                  <p>
                    {diasLabel(i.dias)} · {VINCULO[i.vinculo] ?? i.vinculo}
                  </p>
                </div>

                <p className="shrink-0 font-mono text-sm text-foreground">
                  R$ {reais},
                  <b className="text-gold-600">
                    {String(i.centavos).padStart(2, "0")}
                  </b>
                </p>

                <time className="shrink-0 text-xs text-muted-foreground">
                  {dateFmt.format(i.createdAt)}
                </time>

                <form action={toggleInscricaoPaga} className="shrink-0">
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="paga" value={paga ? "0" : "1"} />
                  <button
                    type="submit"
                    className={`border px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.1em] transition-colors ${
                      paga
                        ? "border-gold-500 bg-gold-500 text-navy-900"
                        : "border-border text-muted-foreground hover:border-gold-500"
                    }`}
                  >
                    {paga ? "Paga" : "Marcar paga"}
                  </button>
                </form>

                <BotaoApagarInscricao
                  id={i.id}
                  numero={i.numero}
                  nome={i.nome}
                  valor={i.valor}
                  paga={paga}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
