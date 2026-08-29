import {
  GoogleTagManagerScript,
  GoogleTagManagerNoScript,
  analyticsEnabled,
  consentPreviewEnabled,
} from "./GoogleTagManager"
import ConsentDefault from "./ConsentDefault"
import CookieConsent from "./CookieConsent"

/**
 * Bundle de medição do site (GTM + Consent Mode v2 + banner LGPD).
 *
 * Montado SÓ nas rotas públicas — em `(site)/layout.tsx` e na página `/links`.
 * NÃO é montado pelo root layout, portanto `/admin` e `/login` (área interna,
 * logada) nunca carregam analytics, gravação de sessão ou banner. É exclusão no
 * CÓDIGO — defesa em profundidade: não depende da configuração da GTM.
 *
 * `ConsentDefault` renderiza antes do GTM (nega tudo até haver consentimento).
 */
export default function Analytics() {
  return (
    <>
      <ConsentDefault />
      <GoogleTagManagerNoScript />
      <GoogleTagManagerScript />
      {(analyticsEnabled() || consentPreviewEnabled()) && <CookieConsent />}
    </>
  )
}
