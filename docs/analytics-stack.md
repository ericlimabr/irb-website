# Stack de Analytics & Marketing — IRB

**Ponto único de entrada:** todo o rastreamento passa pelo container **Google Tag
Manager `GTM-PH2RDK44`**, injetado via `components/analytics/GoogleTagManager.tsx`
(produção apenas). Não há snippets diretos no código — cada serviço é uma tag
**dentro** do container. Isso evita contagem em dobro e permite adicionar/alterar
tags pela UI da GTM sem redeploy.

> Complementa [`seo-roadmap.md`](./seo-roadmap.md) (Frente 5 — medição) e
> [`admin-analytics-integration.md`](./admin-analytics-integration.md) (puxar
> esses dados de volta para o `/admin` via API).

---

## Identificadores

| Serviço | ID | Onde vive |
|---|---|---|
| Google Tag Manager (container) | `GTM-PH2RDK44` | Código (`app/layout.tsx`), override `NEXT_PUBLIC_GTM_ID` |
| Google Analytics 4 | `G-9VGVR21929` | Tag dentro do GTM |
| Microsoft Clarity | `y4vr1pvdsk` | Tag (Custom HTML) dentro do GTM |
| Google Ads — Conversion ID | `AW-18399148896` | Tag Remarketing dentro do GTM |
| Google Ads — Customer ID | `963-242-4403` | Conta Google Ads |
| Google Ads — Google tag (unificada) | `GT-TBV4VF4S` | Anexada ao mesmo tag |

> Todos os IDs acima são **públicos por natureza** (vão no HTML das páginas). Não
> são segredos — diferente de credenciais de API (service account do GA4, token
> do Clarity), que ficam **só** em env server-side. Ver `admin-analytics-integration.md`.

---

## Status das integrações

| Integração | Status | Observação |
|---|---|---|
| **GTM container** | ✅ Instalado (código) | Produção apenas; script + `<noscript>` |
| **GA4** | ✅ Tag publicada | Config tag, trigger *Initialization - All Pages* |
| **Microsoft Clarity** | ✅ Tag publicada | Custom HTML, trigger *All Pages* |
| **Google Ads — Conversion Linker** | ✅ Tag publicada | Baseline de atribuição |
| **Google Ads — Remarketing** | ✅ Tag publicada | `AW-18399148896`; audiência começando a popular |
| **Google Ads — Conversion Tracking** | ⏸️ Adiado | Sem conversion action / label ainda |
| **Google Search Console** | ✅ Integrado | — |
| **Google Business Profile** | ✅ Integrado | "Igreja Reformada de Brasília", Setor Hoteleiro |

---

## Pendências / próximos passos

| Item | Prioridade | Nota |
|---|---|---|
| **Eventos de CTA** (WhatsApp, form de contato, "como chegar", play de vídeo) → GA4 + conversion actions do Ads | 🔴 Alta | Desbloqueia goals no GA4, Conversion Label no Ads e remarketing melhor |
| **Consent Mode v2 + banner de cookies (LGPD)** | 🟠 Média | Antes de escalar tráfego real |
| **Meta Pixel** | ⚪ Opcional | Só se houver Facebook/Instagram |
| **Painel de analytics no `/admin`** (GA4 Data API) | ⚪ Planejado | Ver `admin-analytics-integration.md` |
| **Verificação de anunciante** (Google Ads) | ⚪ Adiado | Questionário pulado; retomar para elegibilidade de anúncios |
| **Conta Google Ads** | ℹ️ Provisionada | Sem campanha, R$ 0,00, sem billing/termos aceitos pelo agente |

---

_Documento vivo. Atualizar quando uma tag for adicionada/alterada no container ou
quando uma pendência for concluída._
