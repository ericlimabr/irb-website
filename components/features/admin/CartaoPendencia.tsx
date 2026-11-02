import Link from "next/link"

/**
 * Uma linha do bloco "precisa de você": o número grande, o que ele é, e para
 * onde ir.
 *
 * O número mudou de peso de propósito. Na tela antiga todo cartão tinha a
 * mesma cor e o mesmo tamanho, então "3 mensagens não lidas" e "0 FAQs"
 * gritavam igual. Aqui zero fica apagado e qualquer coisa acima de zero fica
 * em destaque: a tela só chama atenção quando há o que fazer.
 *
 * `valor` nulo quer dizer QUE NÃO DEU PARA LER, e não zero. A diferença é a
 * razão de este tipo existir: em 02/11/2026 uma leitura que falhou virou zero
 * na tela, e o painel anunciou "nenhuma falha sem baixa" existindo duas.
 */
export default function CartaoPendencia({
  valor,
  titulo,
  detalhe,
  href,
  detalheZero,
}: {
  valor: number | null
  titulo: string
  detalhe: string
  href: string
  /** O que dizer quando não há pendência. "Nada a fazer" é notícia boa. */
  detalheZero?: string
}) {
  const naoLido = valor === null
  const pendente = valor !== null && valor > 0

  return (
    <Link
      href={href}
      className="flex items-center gap-4 border border-border bg-card p-5 shadow-sm transition-colors hover:border-gold-500"
    >
      <span
        className={`min-w-[2ch] text-right font-serif text-4xl font-bold leading-none ${
          pendente ? "text-destructive" : "text-muted-foreground/40"
        }`}
      >
        {naoLido ? "–" : valor}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">
          {titulo}
        </span>
        <span className="block text-2xs text-muted-foreground">
          {naoLido
            ? "não deu para ler agora"
            : pendente
              ? detalhe
              : (detalheZero ?? detalhe)}
        </span>
      </span>
      <span className="ml-auto shrink-0 font-mono text-2xs uppercase tracking-[0.1em] text-gold-600">
        Ver
      </span>
    </Link>
  )
}
