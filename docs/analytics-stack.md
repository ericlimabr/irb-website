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
| Meta Pixel (Facebook/Instagram) | `2253501382066542` | Tag (Custom HTML) dentro do GTM |

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
| **Consent Mode v2 + banner (LGPD)** | ✅ Código + GTM | Bloqueio por padrão (`ConsentDefault`), banner opt-in `CookieConsent`, Política em `/politica-de-privacidade`. GA4/Ads respeitam o consentimento nativamente; **Clarity travado em `analytics_storage` no GTM (Versão 7).** |
| **Analytics fora da área logada** | ✅ Código + GTM | Camada 1 (código): bundle `Analytics.tsx` montado só em rotas públicas (`(site)/layout` + `/links`), NÃO no root layout → `/admin` e `/login` nunca carregam GTM/Clarity/banner. Camada 2 (GTM, Versão 8): acionador de bloqueio `{{Page Path}}` RegEx `^/(admin\|login)` como **exceção nas 8 tags** → cobre até a navegação SPA. Evita gravar telas com dados de terceiros e poluir o GA4 com tráfego interno. |
| **Google Search Console** | ✅ Integrado | — |
| **Google Business Profile** | ✅ Integrado | "Igreja Reformada de Brasília", Setor Hoteleiro |
| **Meta Pixel — PageView** | ✅ Publicado (v9) e validado | `2253501382066542`, Custom HTML na GTM. All Pages + gate `ad_storage` + exceção "Bloqueio - Área interna". Preview confirmou: não dispara sem aceite; dispara 1× após aceite; nada em /admin·/login. Falta só conferir no *Meta Events Manager* (Test Events). |
| **Meta Pixel — eventos de conversão** | 🟡 Em criação | `Lead` (form), `Contact` (whatsapp), `FindLocation` (rotas), `ViewContent` (youtube). Cada tag reusa o trigger GA4 existente + mesmos 2 guardrails (gate `ad_storage` + exceção admin/login). |
| **Qualidade do contêiner GTM** | ✅ Excelente | Domínios revisados; 2º admin adicionado (GTM/GA4/Ads) |

---

## GTM — o que existe no container (`GTM-PH2RDK44`)

**9 tags de medição:** GA4 - Configuration (`G-9VGVR21929`), GA4 - `contact_form_submit`,
GA4 - `directions_click`, GA4 - `whatsapp_click`, GA4 - `youtube_click`,
Google Ads - Conversion Linker, Google Ads - Remarketing (`AW-18399148896`),
Microsoft Clarity (`y4vr1pvdsk`), Meta Pixel - PageView (`2253501382066542`,
Custom HTML). Os 4 eventos de CTA são **tags de evento GA4** próprias (não só
triggers).

> ⚠️ **O Meta Pixel não herda os guardrails automaticamente.** Diferente das tags
> do Google, o pixel do Meta **ignora o Consent Mode** e o snippet dispara
> `PageView` no load. Para ficar em paridade com o resto do container ele precisa,
> na própria tag Custom HTML:
> 1. **Consentimento adicional** (Configurações avançadas → exigir `ad_storage`,
>    ou no mínimo `analytics_storage`, igual ao Clarity na v7) → só dispara com aceite.
> 2. **Exceção "Bloqueio - Área interna"** (`{{Page Path}}` RegEx `^/(admin\|login)`,
>    igual à v8) → não grava em `/admin` e `/login`.

**Histórico de versões relevante:**

| Versão | O que fez |
|---|---|
| **v7** | Clarity travado em consentimento adicional `analytics_storage` (só dispara com aceite). |
| **v8** | Acionador "Bloqueio - Área interna (admin/login)" (`{{Page Path}}` RegEx `^/(admin\|login)`) aplicado como **exceção nas 8 tags** → nada dispara em `/admin` e `/login`. |
| **v9** | Tag "Meta Pixel - PageView" (`2253501382066542`, Custom HTML, All Pages) com gate `ad_storage` + exceção "Bloqueio - Área interna". Validada no Tag Assistant. |

---

## Pendências / próximos passos

| Item | Prioridade | Nota |
|---|---|---|
| **Marcar eventos-chave no GA4** | 🔴 Próximo (com prazo) | `whatsapp_click`, `directions_click`, `contact_form_submit`. Só aparecem para estrelar no relatório **agregado** ~24–48h após começarem a ser recebidos (Realtime já confirmou). `youtube_click` fica comum. |
| **Importar eventos-chave como conversão no Ads** | 🟠 Depois do acima | Ads → Metas → Conversões → Importar → GA4. Gera o Conversion Label e liga ao `AW-18399148896`. Exige os eventos-chave já marcados. |
| **Meta Pixel — tags de evento (GTM)** | 🟡 Em criação | `Lead`/`Contact`/`FindLocation`/`ViewContent`, cada uma no trigger GA4 existente + gate `ad_storage` + exceção admin/login. |
| **Meta — verificar domínio** | 🟠 Depois das tags | Business Manager → Segurança da marca → Domínios → `irbrasilia.org`. Pré-requisito do AEM. |
| **Meta — priorizar eventos (AEM)** | 🟠 Depois das tags | Events Manager → Config. agregadas de eventos → ordenar os até 8 eventos (ex.: `Lead` no topo). Só após começarem a chegar. |
| **Meta — conferir no Events Manager** | 🔴 Próximo | Test Events do lado do Facebook (exige o Business Manager de vocês) para fechar o ciclo do `PageView` já publicado. |
| **Meta Pixel — evento `Donate`/`Schedule`** | ⚪ Futuro | Só quando existir dízimo/PIX (`Donate`) ou RSVP na /agenda (`Schedule`). |
| **Painel de analytics no `/admin`** (GA4 Data API) | ⚪ Planejado | Ver `admin-analytics-integration.md` |
| **Verificação de anunciante** (Google Ads) | ⚪ Adiado | Questionário pulado; retomar para elegibilidade de anúncios |
| **Conta Google Ads** | ℹ️ Provisionada | Sem campanha, R$ 0,00, sem billing/termos aceitos pelo agente |

---

_Documento vivo. Atualizar quando uma tag for adicionada/alterada no container ou
quando uma pendência for concluída._
