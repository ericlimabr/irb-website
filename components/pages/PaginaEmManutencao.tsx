import Logo from "@/components/ui/Logo"
import { CHURCH_EMAIL } from "@/const"

/**
 * O que o visitante vê quando o site está fora do ar pela via do admin.
 *
 * Quem a monta são os layouts públicos (app/(site), app/conferencia,
 * app/campanha) e a página /links, cada um perguntando antes a
 * lib/manutencao.ts. Quando ela aparece, aparece sozinha: sem menu, sem
 * rodapé, sem botão de WhatsApp e sem medição. Página de espera que ainda
 * carrega GTM e banner de consentimento mede visita de ninguém e pede
 * consentimento para nada.
 *
 * NÃO é a página de erro (app/not-found.tsx): aqui não houve defeito, e o
 * texto diz isso. Ela também não mente sobre prazo, porque quem liga o
 * interruptor é que sabe quando vai desligar.
 *
 * O `noindex` é a única defesa contra o Google guardar esta tela no lugar da
 * página de verdade: o portão responde 200, como toda página do site, e um
 * 503 só sairia de middleware ou de route handler. Em troca, a leitura do
 * estado vence em 60 segundos, então a janela é curta.
 *
 * O e-mail é o único contato aqui, e vem de const/index.ts. Celular não entra.
 */
export default function PaginaEmManutencao() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />

      <main className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-6 py-16 text-center">
        <div className="max-w-xl space-y-10">
          <div className="space-y-5">
            <Logo variant="full" tone="gold" height={96} className="mx-auto" />
            <p className="font-mono text-2xs uppercase tracking-[0.2em] text-gold-500">
              Igreja Reformada de Brasília
            </p>
          </div>

          <div className="space-y-5">
            <div className="mx-auto h-px w-16 bg-gold-500" />

            <h1 className="font-serif text-3xl font-light text-white sm:text-4xl">
              Estamos em manutenção
            </h1>

            <p className="text-balance leading-relaxed text-navy-50">
              O site está passando por um ajuste e volta em breve. Os cultos e
              as atividades da igreja seguem normalmente, no horário de sempre.
            </p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-8">
            <p className="font-mono text-2xs uppercase tracking-[0.2em] text-navy-50/60">
              Precisa falar com a igreja
            </p>
            <a
              href={`mailto:${CHURCH_EMAIL}`}
              className="inline-block font-mono text-sm text-gold-500 underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-gold-400"
            >
              {CHURCH_EMAIL}
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
