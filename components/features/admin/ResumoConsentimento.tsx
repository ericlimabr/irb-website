import type { ResumoDoPainel } from "@/lib/painel"

/**
 * O consentimento de cookies em UM cartão, no lugar dos dez cartões iguais da
 * tela antiga.
 *
 * O que interessa aqui não é cada contagem: é o destino das visitas. A barra
 * empilhada mostra isso de uma vez, e os dois achados embaixo são as únicas
 * linhas que mudaram decisão até hoje (o navegador de dentro do Instagram,
 * onde quase ninguém decide, e o que a segunda chamada do banner recupera).
 *
 * Os percentuais são calculados aqui, na contagem exibida, e não escritos à
 * mão em lugar nenhum.
 *
 * O milhar é separado à mão, e não com `toLocaleString`: o resultado dele
 * depende do ICU disponível, e um Node compilado sem os dados de locale
 * devolve o número sem separador nenhum.
 */

/** 1284 vira "1.284". */
function milhar(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
export default function ResumoConsentimento({
  dados,
}: {
  dados: ResumoDoPainel["consentimento"]
}) {
  const exibido = dados?.exibido ?? 0
  const aceitou = dados?.aceitou ?? 0
  const recusou = dados?.recusou ?? 0
  const ignorou = dados?.ignorou ?? 0
  const pct = (n: number) => (exibido ? Math.round((n / exibido) * 100) : 0)
  const pctApp = dados?.appExibido
    ? Math.round((dados.appAceitou / dados.appExibido) * 100)
    : 0
  const pct2a = dados?.segundaExibido
    ? Math.round((dados.segundaDecidiu / dados.segundaExibido) * 100)
    : 0

  return (
    <section>
      <div className="mb-3">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Consentimento de cookies
        </h2>
      </div>

      <div className="border border-border bg-card p-6 shadow-sm">
        {dados === null ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível ler a medição agora.
          </p>
        ) : exibido === 0 ? (
          <p className="text-sm text-muted-foreground">
            O banner ainda não foi exibido nenhuma vez, ou a medição está
            desligada neste ambiente.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              De <strong className="text-foreground">{milhar(exibido)}</strong>{" "}
              vezes que o banner apareceu, este foi o destino de cada visita.
              Quem não aceita fica fora do Analytics e do pixel, então esta é a
              única janela sobre esse público.
            </p>

            <div
              className="mt-4 flex h-7 border border-border"
              aria-hidden="true"
            >
              <i
                className="block bg-[hsl(152_40%_40%)]"
                style={{ width: `${pct(aceitou)}%` }}
              />
              <i
                className="block bg-navy-700"
                style={{ width: `${pct(recusou)}%` }}
              />
              <i
                className="block bg-gold-200"
                style={{ width: `${pct(ignorou)}%` }}
              />
            </div>

            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-2xs text-muted-foreground">
              <span>
                <s className="mr-1.5 inline-block h-2 w-2 bg-[hsl(152_40%_40%)] no-underline" />
                Aceitou, {aceitou} ({pct(aceitou)}%)
              </span>
              <span>
                <s className="mr-1.5 inline-block h-2 w-2 bg-navy-700 no-underline" />
                Recusou, {recusou} ({pct(recusou)}%)
              </span>
              <span>
                <s className="mr-1.5 inline-block h-2 w-2 bg-gold-200 no-underline" />
                Ignorou, {ignorou} ({pct(ignorou)}%)
              </span>
            </p>

            {(dados.appExibido > 0 || dados.segundaExibido > 0) && (
              <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                {dados.appExibido > 0 && (
                  <p className="flex gap-3 text-sm">
                    <b className="shrink-0 font-serif text-xl leading-none text-navy-700">
                      {dados.appAceitou} em {dados.appExibido}
                    </b>
                    <span className="text-muted-foreground">
                      é o que o navegador de dentro do Instagram e do Facebook
                      aceita, {pctApp}% das exibições de lá.
                    </span>
                  </p>
                )}
                {dados.segundaExibido > 0 && (
                  <p className="flex gap-3 text-sm">
                    <b className="shrink-0 font-serif text-xl leading-none text-navy-700">
                      {pct2a}%
                    </b>
                    <span className="text-muted-foreground">
                      de quem viu a segunda chamada acabou decidindo,{" "}
                      {dados.segundaDecidiu} de {dados.segundaExibido}.
                    </span>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
