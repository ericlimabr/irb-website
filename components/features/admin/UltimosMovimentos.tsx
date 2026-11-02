import Link from "next/link"
import type { Movimento } from "@/lib/painel"

/**
 * Os últimos acontecimentos de verdade, de três tabelas (inscrições,
 * mensagens e falhas), em ordem de tempo.
 *
 * Substitui a "Atividade Recente" da tela antiga, que era uma lista fixa
 * escrita no código, com sermões e publicações que nunca existiram. Lista
 * inventada no painel é pior do que lista vazia: a igreja acredita nela.
 *
 * A hora é a de Brasília, declarada no formatador. O servidor da Vercel roda
 * em UTC e sem isso a tela mostraria três horas à frente.
 */

const hora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
})

const dia = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
})

/** Hoje mostra a hora; antes disso, a data. */
function quando(d: Date): string {
  const mesmoDia =
    dia.format(d) === dia.format(new Date()) &&
    new Date().getTime() - d.getTime() < 36 * 60 * 60 * 1000
  return mesmoDia ? `${hora.format(d)}` : dia.format(d)
}

export default function UltimosMovimentos({
  movimentos,
}: {
  movimentos: Movimento[]
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Últimos movimentos
        </h2>
      </div>

      {movimentos.length === 0 ? (
        <p className="border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Nada aconteceu ainda: nenhuma inscrição, mensagem ou falha registrada.
        </p>
      ) : (
        <ul className="border border-border bg-card shadow-sm">
          {movimentos.map((m) => (
            <li key={m.id} className="border-b border-border last:border-b-0">
              <Link
                href={m.href}
                className="flex items-baseline gap-4 px-5 py-3 transition-colors hover:bg-muted"
              >
                <time className="w-[6ch] shrink-0 font-mono text-2xs text-muted-foreground">
                  {quando(m.quando)}
                </time>
                <span className="min-w-0 text-sm text-foreground">
                  {m.texto}{" "}
                  <span className="text-muted-foreground">{m.detalhe}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
