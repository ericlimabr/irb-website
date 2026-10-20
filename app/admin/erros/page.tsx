import {
  getLogErros,
  marcaErroVisto,
  marcaTodosVistos,
} from "@/app/actions/log-erro"

/**
 * Falhas do site, da mais recente para a mais antiga.
 *
 * Esta tela existe porque até 20/10/2026 a igreja só descobria que algo tinha
 * quebrado quando alguém reclamava: foi assim que apareceu o campo-isca
 * recusando pessoas de verdade. O `console.error` só vive no painel da Vercel,
 * que ninguém abre de hora em hora.
 *
 * Nada aqui se apaga. Dar baixa ("visto") só tira o destaque: o histórico é o
 * que permite ver que a mesma falha voltou.
 *
 * A hora é a de Brasília, declarada no formatador. O servidor da Vercel roda
 * em UTC, e sem isso a tela mostraria três horas à frente.
 */

const quando = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
})

const ORIGEM: Record<string, string> = {
  inscricao: "Inscrição da conferência",
  contato: "Formulário de contato",
  admin: "Painel da igreja",
}

export default async function ErrosPage() {
  const erros = await getLogErros()
  const semBaixa = erros.filter((e) => !e.vistoEm)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Falhas do site
          </h1>
          <p className="text-sm text-muted-foreground">
            {erros.length === 0
              ? "Nada registrado até agora."
              : `${erros.length} registro(s), ${semBaixa.length} sem baixa. Horário de Brasília.`}
          </p>
        </div>

        {semBaixa.length > 0 && (
          <form action={marcaTodosVistos}>
            <button
              type="submit"
              className="border border-border px-4 py-2 font-mono text-2xs uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary"
            >
              Dar baixa em tudo
            </button>
          </form>
        )}
      </div>

      {erros.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Quando algo quebrar, a falha aparece aqui e um aviso sai no WhatsApp.
        </p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {erros.map((e) => {
            const grave = e.nivel === "ERRO"
            return (
              <div
                key={e.id}
                className={`px-4 py-3 ${e.vistoEm ? "opacity-60" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`shrink-0 border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] ${
                      grave
                        ? "border-red-300 text-red-700"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {grave ? "Erro" : "Aviso"}
                  </span>

                  <span className="font-mono text-xs text-foreground">
                    {e.codigo}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {ORIGEM[e.origem] ?? e.origem}
                  </span>

                  <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
                    {quando.format(e.createdAt)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-foreground">{e.mensagem}</p>

                {(e.pessoa || e.contato) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Quem estava na tela: {e.pessoa ?? "sem nome"}
                    {e.contato ? ` · ${e.contato}` : ""}
                  </p>
                )}

                <p className="mt-1 font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                  {e.avisados > 0
                    ? `Aviso enviado para ${e.avisados} celular(es)`
                    : "Sem aviso no WhatsApp"}
                  {e.vistoEm ? ` · baixa em ${quando.format(e.vistoEm)}` : ""}
                </p>

                {e.detalhe && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
                      O que o servidor disse
                    </summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words bg-background p-3 text-xs text-muted-foreground">
                      {e.detalhe}
                    </pre>
                  </details>
                )}

                {!e.vistoEm && (
                  <form action={marcaErroVisto} className="mt-2">
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      className="font-mono text-2xs uppercase tracking-[0.1em] text-gold-600 transition-colors hover:text-foreground"
                    >
                      Dar baixa
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
