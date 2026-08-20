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
| **GTM container** | ✅ Instalado (código) | Só produção real; gate `VERCEL_ENV === "production"` (não dispara em previews `*.vercel.app`) |
| **GA4** | ✅ Tag publicada | Config tag, trigger *Initialization - All Pages* |
| **Microsoft Clarity** | ✅ Tag publicada | Custom HTML, trigger *All Pages* |
| **Google Ads — Conversion Linker** | ✅ Tag publicada | Baseline de atribuição; auto-link só `irbrasilia.org` |
| **Google Ads — Remarketing** | ✅ Tag publicada | `AW-18399148896`; audiência começando a popular |
| **Google Ads — Conversion Tracking** | ⏸️ Adiado | Sem conversion action / label ainda |
| **GA4 ↔ Google Ads (vínculo)** | ✅ Vinculado | Publicidade personalizada + auto-tagging ativos |
| **Eventos de CTA** | ✅ Ao vivo e validados | `whatsapp_click`, `directions_click`, `youtube_click` (GTM Click-URL) + `contact_form_submit` (dataLayer no `ContactForm`). Confirmados no GA4 Tempo real. |
| **Consent Mode v2 + banner (LGPD)** | ✅ No código | Bloqueio por padrão (`ConsentDefault`), banner opt-in `CookieConsent`, Política em `/politica-de-privacidade`. GA4/Ads respeitam o consentimento nativamente. **Clarity precisa do gate no GTM (abaixo).** |
| **Analytics fora da área logada** | ✅ No código | Bundle `Analytics.tsx` montado só em rotas públicas (`(site)/layout` + `/links`), NÃO no root layout → `/admin` e `/login` nunca carregam GTM/Clarity/banner. Evita gravar telas com dados de terceiros e poluir o GA4 com tráfego interno. |
| **Google Search Console** | ✅ Integrado | — |
| **Google Business Profile** | ✅ Integrado | "Igreja Reformada de Brasília", Setor Hoteleiro |
| **Qualidade do contêiner GTM** | ✅ Excelente | Domínios revisados; 2º admin adicionado (GTM/GA4/Ads) |

---

## Pendências / próximos passos

| Item | Prioridade | Nota |
|---|---|---|
| **Marcar eventos-chave no GA4** | 🔴 Próximo (com prazo) | `whatsapp_click`, `directions_click`, `contact_form_submit`. Só aparecem para estrelar no relatório **agregado** ~24–48h após começarem a ser recebidos (Realtime já confirmou). `youtube_click` fica comum. |
| **Importar eventos-chave como conversão no Ads** | 🟠 Depois do acima | Ads → Metas → Conversões → Importar → GA4. Gera o Conversion Label e liga ao `AW-18399148896`. Exige os eventos-chave já marcados. |
| **Clarity: exigir `analytics_storage` no GTM** | 🔴 Próximo | O Clarity é Custom HTML (sem consent nativo). Na tag do Clarity → Configurações avançadas → Consentimento → "Exigir consentimento adicional" → `analytics_storage`. Sem isso, o Clarity grava sessão mesmo sem aceite. Prompt de Cowork pronto. |
| **Meta Pixel** | ⚪ Opcional | Só se houver Facebook/Instagram |
| **Painel de analytics no `/admin`** (GA4 Data API) | ⚪ Planejado | Ver `admin-analytics-integration.md` |
| **Verificação de anunciante** (Google Ads) | ⚪ Adiado | Questionário pulado; retomar para elegibilidade de anúncios |
| **Conta Google Ads** | ℹ️ Provisionada | Sem campanha, R$ 0,00, sem billing/termos aceitos pelo agente |

---

_Documento vivo. Atualizar quando uma tag for adicionada/alterada no container ou
quando uma pendência for concluída._
