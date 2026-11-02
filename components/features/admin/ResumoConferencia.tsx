import Link from "next/link"
import { brl } from "@/utils/inscricao"
import { CONFERENCE_EDITION } from "@/const"
import type { ResumoDoPainel } from "@/lib/painel"

/**
 * As inscrições da conferência, que são a coisa viva do site agora e nem
 * apareciam na visão geral antiga.
 *
 * A barra é a conciliação: a fatia dourada já caiu no extrato, o resto
 * aguarda Pix. É a mesma pergunta que a igreja faz toda manhã, respondida sem
 * abrir a lista.
 */
export default function ResumoConferencia({
  dados,
}: {
  dados: ResumoDoPainel["inscricoes"]
}) {
  /*
    O percentual e a barra medem a CONCILIAÇÃO, então o denominador é o que
    ainda está de pé: pagas mais aguardando. Inscrição cancelada não é dívida
    nem recebimento, e inflaria o denominador fazendo a igreja ler menos
    conciliação do que existe.
  */
  const emJogo = dados ? dados.pagas + dados.aguardando : 0
  const pct = emJogo ? Math.round((dados!.pagas / emJogo) * 100) : 0

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-serif text-xl font-bold text-foreground">
          {CONFERENCE_EDITION}
        </h2>
        <Link
          href="/admin/inscricoes"
          className="border-b border-gold-200 text-sm text-gold-600"
        >
          Ver as inscrições
        </Link>
      </div>

      <div className="border border-border bg-card p-6 shadow-sm">
        {dados === null ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível ler as inscrições agora. A lista continua certa em
            Inscrições; é só esta caixa que não carregou.
          </p>
        ) : dados.total === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma inscrição ainda. Assim que a primeira chegar, ela aparece
            aqui com o valor a conciliar.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="block font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                  Inscrições
                </span>
                <b className="font-serif text-3xl font-bold leading-none text-foreground">
                  {dados.total}
                </b>
                <small className="mt-1 block text-2xs text-muted-foreground">
                  {dados.pessoas} pessoa(s), com crianças
                  {dados.canceladas > 0 && `, ${dados.canceladas} cancelada(s)`}
                </small>
              </div>
              <div>
                <span className="block font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                  Pagas
                </span>
                <b className="font-serif text-3xl font-bold leading-none text-foreground">
                  {dados.pagas}
                </b>
                <small className="mt-1 block text-2xs text-muted-foreground">
                  {pct}% das que estão de pé
                </small>
              </div>
              <div>
                <span className="block font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                  Recebido
                </span>
                <b className="font-serif text-3xl font-bold leading-none text-foreground">
                  {brl(dados.recebidoCentavos)}
                </b>
                <small className="mt-1 block text-2xs text-muted-foreground">
                  já conferido no extrato
                </small>
              </div>
              <div>
                <span className="block font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                  A receber
                </span>
                <b className="font-serif text-3xl font-bold leading-none text-foreground">
                  {brl(dados.aReceberCentavos)}
                </b>
                <small className="mt-1 block text-2xs text-muted-foreground">
                  {dados.aguardando} aguardando Pix
                </small>
              </div>
            </div>

            <div
              className="mt-6 flex h-2 border border-border bg-muted"
              aria-hidden="true"
            >
              <i className="block bg-gold-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-2xs text-muted-foreground">
              <span>
                <s className="mr-1.5 inline-block h-2 w-2 bg-gold-500 no-underline" />
                Pagas
              </span>
              <span>
                <s className="mr-1.5 inline-block h-2 w-2 border border-border bg-muted no-underline" />
                Aguardando Pix
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
