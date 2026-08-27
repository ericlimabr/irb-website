# SEO — Roadmap de produção

Backlog do que **ainda podemos produzir** para SEO, incluindo SEO para a era das IAs
(AEO/GEO). Complementa o [`seo-palavras-chave.md`](./seo-palavras-chave.md) (termos de
busca) — este aqui é a lista de *entregáveis*.

> **Já implementado** (ver §9 de `seo-palavras-chave.md`): `robots.txt`, `sitemap.xml`
> (respeitando feature flags), scaffold de redirects 301, JSON-LD `Church` site-wide e
> `CHURCH_COORDS` (que também fixou o pino do mapa). Este roadmap é o que vem **depois**
> disso.

> **Atualização: a Frente 5 (medição) já está LIVE.** GTM, GA4, Microsoft Clarity,
> Google Ads, Consent Mode v2/LGPD, Google Business Profile e Google Search Console já
> foram integrados. O estado detalhado (IDs, tags, versões do container) vive em
> [`analytics-stack.md`](./analytics-stack.md); o texto da Frente 5 abaixo foi
> atualizado. Restam só refinamentos de medição/anúncios (GA4/Ads), que **não bloqueiam
> SEO**.

---

## Frente 1 — On-page / técnico (código, alto retorno)

> **Status: ✅ CONCLUÍDA.** Todos os itens abaixo executados. Detalhes em §Estado
> de implementação (fim do doc).

| Item | O que é | Status |
|---|---|---|
| **Auditoria de metadata por página** | Cada página exporta `title` + `description` **liderando pelo termo-alvo** + `alternates.canonical`. | ✅ 10 `layout.tsx` (client) + `sobre` direto + canonical nas 3 já feitas; `noindex` nas páginas de flag desligada. |
| **Compressão de imagens** | Rasters referenciados pesados derrubavam LCP/crawl budget. | ✅ sharp (máx 2560px, q82): **38,0 MB → 25,0 MB (−34%)**. PNGs não usados (~39,5 MB) movidos de `public/` para `docs/brand/`. |
| **`BreadcrumbList`** | Trilha semântica nas páginas internas (também vira rich result). | ✅ `BreadcrumbJsonLd` + `utils/siteUrl` em todas as páginas internas. |
| **Alt text + hierarquia de headings** | `alt` descritivo + ordem `h1→h2→h3`. | ✅ Auditado: 1 `<h1>` por página (Masthead), alt adequado. Sem defeito. |
| **Página 404 própria** | Com links de volta. | ✅ Já existia (`app/not-found.tsx`), boa. |
| **Internal linking** | Linkar as confissões entre si e ao hub. | ✅ `RelatedConfessions` nas 3 confissões (antes becos sem saída). |

---

## Frente 2 — Expansão de Schema (além do `Church` já feito)

| Schema | Onde | Ganho |
|---|---|---|
| **`FAQPage`** ✅ | Páginas com perguntas (o projeto **já tem modelo `faqs`**) | **Duplo**: rich result no Google **e** o formato que as IAs mais citam (ver Frente 3). Maior custo-benefício. |
| **`WebSite`** ✅ | Layout raiz | Identidade do site; base para sitelinks. Publisher aponta para o `@id` da igreja. |
| **`Person`** ✅ | Liderança (`CHURCH_COUNSEL`), como `employee` da igreja | E-E-A-T: quem ensina e governa. |
| **`Article` / `BlogPosting`** ✅ | Confissões (`Article`) e posts do blog (`BlogPosting`) | Elegibilidade a rich results de artigo; datas e autor. Confissões com `about` + `sameAs` (Wikipedia) para entity linking. |
| **`Event`** | Eventos datados da `/agenda` (conferências) | Rich result de evento. Culto recorrente continua via `openingHours`, não `Event`. |

---

## Frente 3 — ⭐ SEO para IAs (AEO / GEO)

> **Status:** `llms.txt`, política de crawlers de IA, conteúdo citável (aberturas
> "definição primeiro" nas páginas-chave) e entity linking das confissões ✅. Resta
> apenas o **Wikidata** da igreja (fora do código).

Objetivo: ser **citado** por ChatGPT, Perplexity, Google AI Overviews e Gemini —
não só ranquear no azul tradicional. O que dá para produzir agora:

- **`llms.txt`** — padrão emergente servido em `/llms.txt`: mapa curado, em markdown,
  do conteúdo-chave do site para LLMs. É o "robots/sitemap da era IA". Gerável via
  `app/llms.txt/route.ts`. Barato e à frente da curva.
- **Política explícita de crawlers de IA no `robots.ts`** — decisão do cliente:
  **liberar** `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` etc.
  aumenta a chance de citação; bloquear protege conteúdo. **Recomendação:** para uma
  igreja que busca alcance, **liberar explicitamente**. Hoje o robots libera geral
  (já passa), mas convém tornar a decisão intencional e documentada.
- **Conteúdo extraível e "citável"** — parágrafos que **começam pela definição**
  ("Uma igreja reformada é…"), Q&A limpo, listas curtas. IAs extraem trechos diretos;
  esse formato é o que aparece nas respostas geradas.
- **Ativo raro que a IRB já tem** — as **confissões renderizadas na íntegra e
  autênticas** (Três Formas de Unidade completas) são *fonte primária*, o tipo de
  conteúdo que IA cita. Explorar com URLs estáveis por Dia do Senhor / artigo e
  âncoras profundas.
- **Clareza de entidade** — o `@id` / `sameAs` / NAP do JSON-LD `Church` já ajuda a IA
  a identificar a igreja como entidade. Reforço gratuito de alto valor: criar um
  verbete no **Wikidata** (e, se possível, Wikipédia).

> **Por que isso e SEO clássico convergem:** `FAQPage` (Frente 2) + conteúdo Q&A
> (Frente 4) + `llms.txt` atacam Google **e** motores de IA com o mesmo esforço.

---

## Frente 4 — Conteúdo (o motor real de longo prazo)

Schema e técnica *habilitam*; conteúdo é o que **ranqueia e é citado**.

- **Posts long-tail** (do §7 de `seo-palavras-chave.md`):
  - "Qual é o seu único consolo na vida e na morte? — Pergunta 1 de Heidelberg"
  - "O que são as Três Formas de Unidade?"
  - "Diferença entre igreja reformada e presbiteriana"
  - "O que são os Cinco Pontos do Calvinismo (Cânones de Dort)?"
  - "Por que cantamos salmos no culto? (salmodia)"
- **FAQ real** — alimenta Frentes 2 e 3 de uma vez.
- **Recuperar o post "O que é uma igreja reformada?"** (tinha tração) via Wayback
  Machine / cache e republicar, com 301 da URL antiga.

---

## Frente 5 — Medição (✅ LIVE)

O stack de medição/anúncios **foi implementado e está no ar**. Detalhes completos
(IDs, as 8 tags do container, histórico de versões, pendências finas) em
[`analytics-stack.md`](./analytics-stack.md). Resumo:

- **GTM** (`GTM-PH2RDK44`) como ponto único, só em produção real (não dispara em
  previews `*.vercel.app`).
- **GA4**, **Microsoft Clarity**, **Google Ads** (Conversion Linker + Remarketing),
  **GA4 ↔ Ads** vinculados.
- **Eventos de CTA** ao vivo e validados: `whatsapp_click`, `directions_click`,
  `youtube_click`, `contact_form_submit`.
- **Consent Mode v2 + banner LGPD** + `/politica-de-privacidade`; Clarity travado no
  consentimento (GTM v7); analytics **excluído de `/admin` e `/login`** (código + GTM v8).
- **Google Business Profile** e **Google Search Console** integrados.

**Refinamentos que restam** (não bloqueiam SEO, a maioria em UI externa): marcar os
eventos-chave no GA4, importá-los como conversão no Google Ads, Meta Pixel (se houver
redes), painel de analytics no `/admin` (GA4 Data API), verificação de anunciante no Ads.

> ⚠️ **Search Console é uma property NOVA** (mesmo domínio de sempre, mas conta recém-
> criada). Ela **não faz backfill**: o relatório de Páginas popula só conforme o Google
> recrawleia daqui pra frente, então **não** vai listar prontamente os 404 das URLs
> antigas do Wix. Para o sweep de 301 no curto prazo, a ferramenta prática continua
> sendo `site:irbrasilia.org` (foi assim que as 5 URLs já redirecionadas foram achadas);
> o Search Console fecha a lista aos poucos, com o tempo.

---

## Backlog priorizado (impacto ÷ esforço)

Ordem sugerida para execução:

1. ✅ **`FAQPage` schema + conteúdo de FAQ** — Frentes 2+3+4 num item; melhor jogada pró-IA. *(concluído)*
2. ✅ **Auditoria de metadata por página** — fundação rápida e barata. *(Frente 1)*
3. ✅ **`llms.txt` + política explícita de crawlers de IA** — a frente "IA". *(concluído)*
4. ✅ **Compressão das imagens** — Core Web Vitals real e mensurável. *(Frente 1)*
5. ✅ **`BreadcrumbList` + `Person` + internal linking** — todos concluídos (`Person` = liderança via `CHURCH_COUNSEL`).
6. **Posts long-tail + recuperação do post antigo** — motor de conteúdo (contínuo). **← próximo sugerido**
7. 🟡 **`Article`/`Event` + `WebSite`** — `WebSite` ✅; `Article` ✅ (blog + 3 confissões); `Event` pendente, conforme a flag `/agenda` ativar.
8. **Wikidata + verbete de entidade** — fora do código, alto valor de longo prazo.

---

## Notas honestas

- **Conteúdo > tudo.** Schema e técnica são *elegibilidade*, não *garantia*. Sem os
  textos da Frente 4, as outras frentes rendem uma fração do potencial.
- **AEO/GEO é área nova e movediça.** `llms.txt` ainda não é adotado por todos os
  motores; tratamos como aposta de baixo custo, não como certeza.
- **Dependências externas** (Wikidata, Google Business Profile, backlinks da
  federação) não são código e dependem de ação do cliente — estão marcadas como tal.

---

## Estado de implementação

### ✅ Item 1 do backlog — FAQPage + conteúdo
- `const/index.ts` → `FAQ_ITEMS` (10 perguntas, "definição primeiro").
- `components/seo/FaqJsonLd.tsx` (schema `FAQPage`), `components/features/faq/FaqAccordion.tsx`
  (`<details>` nativo, conteúdo sempre no DOM), página `/perguntas-frequentes`,
  link no footer, rota no sitemap.
- Estático por decisão registrada; migração para banco planejada em
  `docs/static-to-db-migration.md`.

### ✅ Frente 1 — On-page / técnico
- **Metadata**: 10 `layout.tsx` server em `app/(site)/*` (para as páginas `"use client"`,
  que não podem exportar metadata) + `sobre` direto. `title` líder por termo +
  `description` + `alternates.canonical`. Páginas de flag desligada (`agenda`,
  `media`, `blog`, `biblioteca`) com `robots: { index: false }`.
- **BreadcrumbList**: `components/seo/BreadcrumbJsonLd.tsx` + `utils/siteUrl.ts`
  (deduplicou a base URL de robots/sitemap). Ligado a todas as páginas internas.
- **Internal linking**: `components/features/confessions/RelatedConfessions.tsx`
  nas 3 páginas de confissão (cross-link entre irmãs + hub).
- **Imagens**: 143 rasters processados via sharp (máx 2560px, q82, strip meta) —
  **38,0 MB → 25,0 MB (−34%)**. 5 PNGs não referenciados (~39,5 MB) movidos de
  `public/logo/` para `docs/brand/` (deixam de ir no deploy).
- **Alt / headings**: auditados, adequados (1 `<h1>` por página via Masthead). Sem mudança.
- **404**: já existente e adequado.

### ✅ Item 3 do backlog — llms.txt + crawlers de IA
- `app/llms.txt/route.ts` → serve `/llms.txt` (mapa curado em markdown: fatos-chave
  + páginas + FAQ), gerado dos consts, `force-static`.
- `app/robots.ts` → regra dedicada **liberando** bots de citação/busca por IA
  (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai,
  PerplexityBot, Perplexity-User, Google-Extended, CCBot, Applebot-Extended,
  cohere-ai); `/admin` e `/login` seguem bloqueados. Scrapers de treino agressivos
  (Bytespider, Meta-ExternalAgent) deixados de fora por ora.

### ✅ Item 5/7 — Person + WebSite schema
- `ChurchJsonLd.tsx`: `employee[]` a partir de `CHURCH_COUNSEL` (pastores, presbíteros,
  diácono) como `Person` com `jobTitle`. Refatorado para usar `utils/siteUrl`.
- `components/seo/WebSiteJsonLd.tsx` (ligado no layout): nó `WebSite` com `publisher`
  referenciando o `@id` da igreja. Fecha o item 5; adianta o `WebSite` do item 7.

### ✅ Frente 2 — Article nas confissões
- `components/seo/ArticleJsonLd.tsx`: schema `Article` para textos históricos (autor
  histórico, não redator do site; `publisher` = igreja; `isPartOf` o hub `/confissoes`).
  O nó `about` liga a obra à sua entidade na Wikipedia via `sameAs` (entity linking,
  reforço de AEO/Frente 3).
- Ligado em `catecismo`, `confissao-belga` e `canones-de-dort` (layouts). Autores:
  Ursino/Oleviano, Guido de Brès, Sínodo de Dordrecht (Organization). Datas da obra
  (1563/1561/1619) vão em `about.datePublished`, não na página.

### ✅ Frente 3 — Aberturas "definição primeiro" (AEO)
- Parágrafo de abertura definicional (serif, `--text-size-lg`, começando pelo termo)
  no topo da primeira seção de `/catecismo`, `/confissoes`, `/confissao-belga`,
  `/canones-de-dort` e `/sobre`. É o primeiro texto corrido após o `<h1>`, o trecho
  que buscadores e IAs extraem para responder "o que é". Padrão descrito em
  `docs/guia-posts-long-tail.html`. De passagem, travessões nos subtítulos de herói
  (`/catecismo`, `/confissoes`, `/confissao-belga`) trocados por `·`/vírgula/`:`.

### ✅ Frente 1/SEO — Redirects 301 das URLs antigas do Wix
- `next.config.ts`: além do post recuperado (`/post/o-que-é-…` → `/blog/…`), mais 5
  URLs do Wix ainda indexadas (levantadas via `site:irbrasilia.org`): `/pregacoes`
  → `/catecismo`; `/post/salmos-salmo-1-…`, `/post/jesus-é-o-único-caminho-…`,
  `/post/…shabbat…`, `/post/refutando-o-relativismo-…` → `/doutrina` (equivalente
  temático; são reposts de terceiros). `permanent: true` (308 = 301). Parâmetro com
  regex nas posições acentuadas. **Sweep definitivo:** o Search Console é uma property
  nova (sem backfill), então no curto prazo a descoberta é via `site:irbrasilia.org`;
  o relatório de Páginas fecha a lista com o tempo.

### Pendente próximo
- **Frente 4 (conteúdo)** — os 5 posts long-tail (briefing pronto em
  `docs/guia-posts-long-tail.html`). É o motor real de longo prazo; schema/técnica só habilitam.
- **`Event`** — quando a flag `/agenda` for ativada.
- **Wikidata** (fora do código; item de entidade, não artigo de Wikipédia, que uma
  igreja local dificilmente satisfaz por notabilidade).
- **Frente 5 (medição)** — já LIVE; restam só refinamentos de GA4/Ads (ver
  `analytics-stack.md`), que não bloqueiam SEO.

---

_Documento vivo. Revisitar a cada entrega concluída e quando o stack de medição
(Frente 5) for ativado._
