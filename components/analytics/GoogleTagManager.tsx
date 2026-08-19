import Script from "next/script"

/**
 * Google Tag Manager (container GTM-…).
 *
 * O container ID é público (vai no HTML). Fica com o ID real como padrão para
 * funcionar direto no deploy; sobrescrevível por `NEXT_PUBLIC_GTM_ID`.
 *
 * Carrega SOMENTE na produção real — nunca em dev nem nos previews da Vercel.
 * Como o preview da Vercel roda com build de produção, `NODE_ENV` sozinho não
 * distingue produção de preview; por isso, na Vercel, gateamos por `VERCEL_ENV`
 * (só `"production"` = domínio real). Fora da Vercel, caímos no `NODE_ENV`.
 * Isso impede o GTM de disparar em URLs `*.vercel.app` e poluir GA4/Ads.
 * Snippet oficial da GTM em duas partes: o `<script>` (via `next/script`,
 * `afterInteractive`) e o `<noscript>` de fallback para JS desabilitado.
 *
 * Ponto ÚNICO de medição do site: GA4 (G-9VGVR21929), Microsoft Clarity e demais
 * tags são configurados DENTRO deste container pela web UI da GTM — não há
 * snippets diretos no código, justamente para evitar contagem em dobro.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PH2RDK44"

// Na Vercel, só o ambiente de produção (domínio real) dispara; previews não.
// Fora da Vercel (self-host), usa o NODE_ENV como fallback.
const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production"

const enabled = () => isProduction && !!GTM_ID

export function GoogleTagManagerScript() {
  if (!enabled()) return null

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}

export function GoogleTagManagerNoScript() {
  if (!enabled()) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
