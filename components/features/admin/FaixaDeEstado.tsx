import Link from "next/link"
import {
  CHURCH_DOMAIN,
  CONFERENCE_EDITION,
  CONFERENCE_DATES_LABEL,
} from "@/const"
import { contagemDaConferencia } from "@/utils/contagem-regressiva"

/**
 * A faixa do topo da visão geral: o site está no ar ou não, e quanto falta
 * para a conferência.
 *
 * SÓ PARA A CONTA DA IGREJA. Quem decide é a página (app/admin/page.tsx), que
 * a monta apenas quando `ehDono`. Está escrito aqui porque a faixa leva o
 * atalho para tirar o site do ar, e mostrar esse atalho para quem não pode
 * usá-lo é oferecer o que vai responder 404.
 *
 * O verde do sinal é a única cor fora da paleta do painel (navy e dourado):
 * um ponto de estado precisa ser lido antes da frase, e dourado piscando
 * pareceria alerta.
 */
export default function FaixaDeEstado({ manutencao }: { manutencao: boolean }) {
  const conferencia = contagemDaConferencia()

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 bg-navy-900 p-5 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            manutencao
              ? "bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.25)]"
              : "bg-[hsl(152_40%_40%)] shadow-[0_0_0_4px_hsl(152_40%_40%/0.25)]"
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-serif text-xl font-semibold leading-tight">
            {manutencao ? "O site está fora do ar" : "O site está no ar"}
          </p>
          <p className="truncate text-sm text-navy-50/70">
            {manutencao
              ? "quem abre o site vê a tela de manutenção"
              : `${CHURCH_DOMAIN} responde normalmente`}
          </p>
        </div>
      </div>

      {conferencia.vigente && (
        <>
          <span
            className="hidden h-9 w-px bg-white/15 sm:block"
            aria-hidden="true"
          />
          <div className="sm:ml-auto sm:text-right">
            <p className="font-serif text-2xl font-semibold leading-none text-gold-500">
              {conferencia.rotulo}
            </p>
            <p className="text-2xs text-navy-50/70">
              para a {CONFERENCE_EDITION}, {CONFERENCE_DATES_LABEL}
            </p>
          </div>
        </>
      )}

      <Link
        href="/admin/manutencao"
        className={`border border-white/25 px-4 py-2 font-mono text-2xs uppercase tracking-[0.1em] transition-colors hover:border-gold-500 hover:text-gold-500 ${
          conferencia.vigente ? "" : "ml-auto"
        }`}
      >
        {manutencao ? "Devolver ao ar" : "Tirar do ar"}
      </Link>
    </div>
  )
}
