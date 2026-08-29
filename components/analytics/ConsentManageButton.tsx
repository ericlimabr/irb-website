"use client"

/**
 * Link "Gerenciar cookies" (rodapé). Reabre o banner de consentimento para quem
 * JÁ decidiu poder mudar ou retirar a escolha — exigência de LGPD (retirar tem
 * de ser tão fácil quanto conceder). Dispara um evento que o `CookieConsent`
 * escuta; se o banner não estiver montado (medição desligada), nada acontece.
 *
 * Só deve ser renderizado quando o sistema de consentimento está ativo — o
 * `Footer` faz esse gate no servidor.
 */
export default function ConsentManageButton({
  className = "",
}: {
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("irb:open-consent"))}
      className={className}
    >
      Gerenciar cookies
    </button>
  )
}
