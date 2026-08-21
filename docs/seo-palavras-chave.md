# SEO — Palavras-chave e termos de busca

Pesquisa dos termos de busca mais associados ao conteúdo atual **e potencial** do
site da Igreja Reformada de Brasília (IRB). Serve de base para títulos de página,
metadados, pauta de blog e SEO local.

> **Metodologia e ressalva importante.** Os termos abaixo vêm de pesquisa web
> qualitativa (SERPs reais, sites concorrentes, Wikipédia, livrarias, portais
> reformados). **Não há números de volume aqui**: a ferramenta de busca usada é
> indexada nos EUA e não devolve volume. Trate as colunas de "demanda" como
> *estimativas direcionais*. Antes de decidir prioridade, **valide com dados reais**:
> Google Keyword Planner, Google Trends (região Brasil / DF), e principalmente o
> **Search Console** do próprio domínio (mostra por quais termos o site já aparece).

---

## 0. Objetivo e horizonte de tempo

**Objetivo declarado:** ranquear bem **em Brasília/DF** (busca local) e, num segundo
momento, **no Brasil** (termos doutrinários nacionais).

> **Ponto de partida (confirmado).** **Este projeto é o site novo e já está no ar em
> `irbrasilia.org`.** O site antigo se perdeu (sem fonte editável). O domínio segue
> sob controle da igreja, então **idade do domínio e backlinks acumulados persistem**
> — **não é site do zero**, e isso puxa os prazos abaixo para a **ponta otimista**.
> O que está "errado" hoje é só o **índice do Google, que ainda reflete o site
> antigo** (URLs e conteúdo que já não existem no domínio). Mesmo com essa vantagem,
> ranquear leva **meses, não semanas** — SEO é acúmulo de sinais.
>
> **A tarefa real não é "migrar", é reindexar.** O site novo já está publicado; falta
> o Google recrawlear e substituir o cache velho. Pontos de atenção:
> 1. **Forçar o recrawl:** ligar o **Search Console** para o domínio, submeter o
>    `sitemap.xml` do site novo e usar "Solicitar indexação" nas páginas principais.
>    É o que corrige o índice desatualizado.
> 2. **URLs antigas que agora dão 404:** as páginas do site antigo ainda indexadas
>    (ex.: `/post/o-que-e-uma-igreja-reformada`) não existem mais e retornam 404. Onde
>    houver equivalente no site novo, criar **redirect 301** da URL antiga → nova
>    (preserva o "suco" de SEO do backlink); onde não houver, deixar cair (404/410) e
>    confiar no novo `sitemap.xml`. Para descobrir quais são: Search Console →
>    Páginas, ou Google `site:irbrasilia.org`.
> 3. **Reaproveitar conteúdo antigo com tração:** o post "O que é uma igreja
>    reformada?" já tinha alcance. Como o Wix não é mais editável, recuperar o texto
>    pelo **Wayback Machine** (web.archive.org) ou cache do Google e **reescrever/
>    republicar** no site novo (em `/sobre` ou `/blog`), com 301 da URL antiga.

Os dois alvos têm dificuldades muito diferentes, então o horizonte é dividido:

| Alvo | Dificuldade | Horizonte realista |
|---|---|---|
| **Brasília/DF** — "igreja reformada brasília/taguatinga", marca, horário de culto | Baixa (concorrência local pequena e batível) | **3–9 meses** para top 3 local |
| **Brasil** — long-tail doutrinário ("cânones de dort", "único consolo…", "três formas de unidade") | Média | **9–18 meses** para page 1 |
| **Brasil** — genéricos de alto volume ("calvinismo", "tulip", "cinco pontos") | Alta (Wikipédia, Ligonier, TGC) | **18–24+ meses**, e mesmo assim parcial — priorizar variações documentais |

### Cronograma em fases

- **Fase 0 — Fundação (mês 0–1, lançamento).** Site no ar, indexável (`robots`,
  `sitemap.xml`), Search Console + Analytics ligados, Google Business Profile criado,
  NAP consistente, Schema `Church`, title/meta por página. *Resultado esperado:*
  indexação e ranqueamento para o **nome da igreja** (marca).
- **Fase 1 — Local (mês 1–3).** GBP verificado, avaliações, fotos, backlinks da
  federação e do diretório `igrejasreformadasdobrasil.com`. *Resultado esperado:*
  aparecer no **pacote local** de "igreja reformada perto de mim" e subir para
  "igreja reformada brasília/taguatinga".
- **Fase 2 — Autoridade temática (mês 3–9).** Blog ativo com as long-tails
  doutrinárias; páginas de confissão consolidadas. *Resultado esperado:* top 3 local
  firme; long-tails doutrinárias entrando (page 1–2 nacional).
- **Fase 3 — Expansão nacional (mês 9–18+).** Backlinks temáticos, conteúdo
  aprofundado, atualização contínua. *Resultado esperado:* page 1 nacional nas
  long-tails; presença (não necessariamente topo) nos genéricos.

### Como medir (KPIs, não "achismo")

- **Search Console:** impressões e posição média por termo (fonte de verdade).
- **Pacote local / GBP:** visualizações, cliques em rota, cliques no WhatsApp.
- **Marcos de checagem:** posição de "igreja reformada brasília" aos 3, 6 e 9 meses.

> Reforço: os prazos são estimativas de mercado para um site bem executado e
> **mantido** (conteúdo novo com regularidade). Abandonar o blog após o lançamento
> estende todos os horizontes.

---

## 1. Perfil de quem busca

Três públicos, três intenções distintas:

1. **Buscador local** — quer achar uma igreja para congregar/visitar em Brasília.
   Intenção alta de conversão (visita física). Poucos termos, muito valiosos.
2. **Buscador doutrinário/informacional** — pesquisa conceitos reformados
   (confissões, catecismo, calvinismo). Volume muito maior, conversão indireta:
   cria autoridade e atrai quem está migrando para a fé reformada.
3. **Buscador de marca** — já conhece a igreja e procura por nome, horário, endereço.

O diferencial competitivo do site (ver §5) é ser **reformada continental /
confessional (Três Formas de Unidade)**, não presbiteriana (Westminster) — isso é a
"cunha" de SEO que separa a IRB das muitas igrejas presbiterianas de Taguatinga.

---

## 2. Cluster LOCAL (maior intenção de conversão)

Página-alvo principal: **`/` (home)**, **`/agenda`**, **`/contato`**.

| Termo | Intenção | Demanda est. | Página-alvo |
|---|---|---|---|
| igreja reformada de brasília | marca/local | média | `/` |
| igreja reformada brasília | local | média | `/` |
| igreja reformada taguatinga | local | baixa-média | `/` |
| igreja reformada df | local | baixa-média | `/` |
| igreja reformada perto de mim | local | média | `/` + GMB |
| igreja confessional brasília | local nicho | baixa | `/sobre` |
| igreja calvinista brasília | local nicho | baixa | `/` |
| horário de culto igreja reformada brasília | marca/local | baixa | `/agenda` |
| igreja reformada continental brasil | nicho | baixa | `/sobre` |

**Ações de SEO local (fora do código, alto retorno):**
- **Google Business Profile** (antigo Google Meu Negócio): cadastrar a igreja com
  endereço, horários de culto (Dom 09h/17h, Escola Dominical 10h20, Estudo Qui 20h),
  telefone/WhatsApp e fotos. Isso é o que faz "igreja reformada perto de mim"
  funcionar e resolve o comentário de geocodificação do `const/index.ts` (o mapa
  passa a devolver o local nomeado).
- Consistência **NAP** (Nome, Endereço, Telefone) idêntica em site, GMB, Facebook,
  Instagram e no diretório `igrejasreformadasdobrasil.com`.
- Pedir para a federação (Igrejas Reformadas do Brasil) e sites parceiros linkarem
  para `irbrasilia.org` (backlinks de autoridade temática).

---

## 3. Cluster DOUTRINÁRIO / CONFISSIONAL (maior volume, autoridade)

Este é o maior manancial de tráfego informacional. Cada confissão tem página
dedicada no site — são "aterrissagens" naturais para estes termos.

### 3.1 Três Formas de Unidade → `/confissoes`
| Termo | Página-alvo |
|---|---|
| três formas de unidade | `/confissoes` |
| três formas de unidade das igrejas reformadas | `/confissoes` |
| símbolos de fé reformados | `/confissoes` |
| confissões reformadas | `/confissoes` |

### 3.2 Confissão Belga → `/confissao-belga`
| Termo | Página-alvo |
|---|---|
| confissão belga | `/confissao-belga` |
| confissão de fé belga | `/confissao-belga` |
| confissão belga o que é | `/confissao-belga` |
| confissão belga 37 artigos | `/confissao-belga` |
| guido de brès / guido de bres | `/confissao-belga` |
| confissão belga 1561 | `/confissao-belga` |

### 3.3 Catecismo de Heidelberg → `/catecismo`
| Termo | Página-alvo |
|---|---|
| catecismo de heidelberg | `/catecismo` |
| catecismo de heidelberg pergunta 1 | `/catecismo` |
| qual é o seu único consolo na vida e na morte | `/catecismo` |
| único consolo na vida e na morte | `/catecismo` |
| catecismo de heidelberg perguntas e respostas | `/catecismo` |
| dia do senhor catecismo | `/catecismo` |
| catecismo de heidelberg 129 perguntas | `/catecismo` |

> Oportunidade forte: "qual é o seu único consolo na vida e na morte" é uma
> long-tail muito buscada e citável. Vale um bloco/artigo dedicado à Pergunta 1.

### 3.4 Cânones de Dort → `/canones-de-dort`
| Termo | Página-alvo |
|---|---|
| cânones de dort | `/canones-de-dort` |
| cinco pontos do calvinismo | `/canones-de-dort` |
| tulip calvinismo | `/canones-de-dort` |
| cinco pontos da graça | `/canones-de-dort` |
| sínodo de dort | `/canones-de-dort` |
| graça soberana | `/canones-de-dort` |
| depravação total / eleição incondicional / expiação limitada / graça irresistível / perseverança dos santos | `/canones-de-dort` |
| remonstrantes arminianismo | `/canones-de-dort` |

> "cinco pontos do calvinismo" e "TULIP" têm volume alto e concorrência de portais
> grandes (Ligonier, TGC, Wikipédia). O site não vence esses no genérico, mas pode
> capturar a variação **"cânones de dort"** (documento-fonte), onde há menos briga.

---

## 4. Cluster IDENTIDADE / DOUTRINA GERAL → `/sobre`, `/doutrina`

| Termo | Intenção | Página-alvo |
|---|---|---|
| o que é uma igreja reformada | informacional | `/sobre` |
| diferença entre reformada e presbiteriana | informacional | `/sobre` |
| igreja reformada x presbiteriana | informacional | `/sobre` |
| doutrinas da graça | doutrinário | `/doutrina` |
| soberania de deus na salvação | doutrinário | `/doutrina` |
| cinco solas da reforma | doutrinário | `/doutrina` |
| sola scriptura / suficiência das escrituras | doutrinário | `/doutrina` |
| igreja confessional o que é | informacional | `/sobre` |
| calvinismo o que é | informacional | `/doutrina` |

> ✅ O post **"O que é uma igreja reformada?"** (que já ranqueava no Wix) foi
> **recuperado via Wayback e republicado** em `/blog/o-que-e-uma-igreja-reformada`,
> com 301 da URL antiga e JSON-LD `BlogPosting`. Ativo de SEO preservado.

---

## 5. Cluster LITÚRGICO / CULTO → `/agenda`, `/media`

Termos que refletem a prática distintiva (nicho, mas altamente qualificado):

| Termo | Página-alvo |
|---|---|
| pregação expositiva | `/media` |
| culto reformado | `/agenda` |
| canto de salmos / salmodia | `/agenda`, `/doutrina` |
| escola dominical reformada | `/agenda` |
| estudo bíblico salmos | `/agenda`, `/media` |
| sermões reformados / pregações expositivas online | `/media` |
| liturgia reformada | `/agenda` |

---

## 6. Panorama competitivo (Taguatinga / Brasília)

Concorrentes reais que aparecem nas SERPs para "igreja reformada Taguatinga":

- **Presbiterianas** (Westminster, maioria): Primeira IP de Taguatinga (piptaguatinga.com.br),
  Quarta IP de Taguatinga, IP Videira.
- **Batistas reformadas**: Igreja Batista Reformada de Brasília (ibrb.com.br), PIBRT.
- **Reformadas continentais / confessionais** (mesmo nicho da IRB): Igreja Cristã de
  Confissão Reformada (Taguatinga), Igreja Reformada do Brasil (Samambaia, endereço
  SMSE — daí vinha o comentário antigo de geocodificação).
- **Diretório temático**: `igrejasreformadasdobrasil.com/igrejas/brasilia/` — vale
  garantir que a IRB está listada e linkada ali.

**Leitura estratégica:** o termo genérico "igreja reformada Brasília" é disputado por
presbiterianas e batistas. A IRB ganha diferenciação ao **possuir** o vocabulário
continental — "Três Formas de Unidade", "Confissão Belga", "Cânones de Dort",
"reformada continental/confessional" —, onde os concorrentes presbiterianos (que usam
Westminster) não competem diretamente.

---

## 7. Recomendações acionáveis (ordem de prioridade)

1. **Google Business Profile** + NAP consistente. Maior retorno de todos para o
   buscador local; nenhum código envolvido.
2. **Title tags / meta descriptions** de cada página de confissão com o termo exato
   como cabeça (ex.: `<title>Catecismo de Heidelberg — …`). O conteúdo já existe; é
   só garantir que o `metadata` de cada página lidere pelo termo.
3. ✅ **Preservar o ativo existente** "O que é uma igreja reformada?" — recuperado do
   Wix (Wayback) e republicado em `/blog`, com 301 da URL antiga.
4. **Dados estruturados (Schema.org)**: marcar como `Church` (subtipo de
   `LocalBusiness`) com `address`, `geo`, `openingHours` — ajuda o pacote local e os
   rich results de horário de culto. **✅ Implementado — ver §9.**
5. **Pauta de blog** de baixa concorrência e alta intenção (long-tail) — briefing de
   redação pronto em [`guia-posts-long-tail.html`](./guia-posts-long-tail.html):
   - "Qual é o seu único consolo na vida e na morte? — Pergunta 1 de Heidelberg"
   - "O que são as Três Formas de Unidade?"
   - "Diferença entre igreja reformada e presbiteriana"
   - "O que são os Cinco Pontos do Calvinismo (Cânones de Dort)?"
   - "Por que cantamos salmos no culto? (salmodia)"
6. **Validar com dados reais** (Keyword Planner / Trends BR / Search Console) antes
   de investir esforço — esta lista é o mapa, não o território.

---

## 8. Termos a NÃO perseguir (fora de escopo / baixo encaixe)

- Genéricos de altíssima concorrência sem ângulo local ("calvinismo", "TULIP" puro):
  perde-se para Wikipédia/Ligonier/TGC. Capturar só via variação documental
  ("cânones de dort") e conteúdo próprio.
- Termos de outras tradições (pentecostal, batista comum, católico) — não refletem a
  identidade da igreja e trariam tráfego que não converte.

---

## 9. Estado de implementação (código)

O que já foi feito no repositório para dar base técnica de indexação e SEO local.

### ✅ Implementado

| Item | Arquivo | Observações |
|---|---|---|
| **`robots.txt`** | `app/robots.ts` | Libera o crawl, **bloqueia `/admin` e `/login`**, aponta para `/sitemap.xml`. Serve em `irbrasilia.org/robots.txt`. |
| **`sitemap.xml`** | `app/sitemap.ts` | Lista as 10 páginas públicas estáveis. **Respeita as feature flags** (`/agenda`, `/media`, `/blog`, `/biblioteca` só entram quando `website_config_variables.*.active === true` — hoje todas desligadas). Serve em `irbrasilia.org/sitemap.xml`. |
| **Redirects 301** | `next.config.ts` | `/post/o-que-é-uma-igreja-reformada` → `/blog/o-que-e-uma-igreja-reformada` (post recuperado). Mais 5 URLs antigas do Wix (`/pregacoes` e 4 posts de terceiros), levantadas via `site:irbrasilia.org` e hoje em 404 → equivalente temático (`/catecismo`, `/doutrina`). `permanent: true` (308 = 301); parâmetro com regex cobre as posições acentuadas. **O sweep completo ainda depende do Search Console.** |
| **JSON-LD `Article` / `BlogPosting`** | `components/seo/ArticleJsonLd.tsx` (confissões), `BlogPostingJsonLd.tsx` (blog) | Artigos elegíveis a rich result. Confissões com `about` + `sameAs` (Wikipedia) para *entity linking* (reforço de AEO). Aberturas "definição primeiro" nas páginas-chave alimentam o mesmo objetivo. |
| **JSON-LD `Church`** | `components/seo/ChurchJsonLd.tsx` (injetado em `app/layout.tsx`) | Monta o schema a partir do `const/index.ts` (fonte única). Preenchidos: identidade, `address`, `areaServed`, `geo`, `telephone`/`contactPoint`, `openingHoursSpecification` (4 cultos/estudos), `sameAs` com o **YouTube**. |
| **Coordenadas do templo** | `const/index.ts` (`CHURCH_COORDS`) | Setado `-15.8343599,-48.053391`. **Efeito colateral positivo:** `utils/maps.ts` usa `CHURCH_COORDS || CHURCH_ADDRESS_QUERY`, então o **mapa passou a fixar o pino exato** em vez de geocodificar pelo texto — comportamento que o próprio comentário do const recomendava. |

### ⏳ Pendente (depende de dado externo, não de código)

- **Sweep completo de 301** — os redirects conhecidos já entraram (post recuperado +
  5 URLs do Wix via `site:irbrasilia.org`). Falta o levantamento definitivo no Search
  Console → Páginas, que revela o que o `site:` não mostra, e adicionar o que faltar
  no `next.config.ts`.
- **Campos `⚠️` do JSON-LD** (comentados em `ChurchJsonLd.tsx` aguardando confirmação):
  - `sameAs`: **Facebook** e **Instagram** (URLs reais).
  - `parentOrganization`: confirmar se a IRB é confederada à federação *Igrejas
    Reformadas do Brasil* e a URL oficial.
  - `hasMap`: opcional, após criar o Google Business Profile.
  - `email`: **deliberadamente fora** enquanto a caixa não existir (flag desligada).

### ⚠️ Observações técnicas

- **`logo` do schema**: o `ChurchJsonLd` referencia o SVG (`/logo/logo-navy.svg`),
  aceito. Para os artigos (`Article`/`BlogPosting`), já existe um raster enxuto
  `public/logo/logo-navy.png` (592x512), usado como `publisher.logo` (o Google prefere
  raster para logo de publisher).
- **`openingHoursSpecification` só tem `opens`** (horário de início), não `closes` —
  não temos a duração dos cultos. Válido assim; fica mais forte com o fim.
- **Validar após publicar:** [Rich Results Test](https://search.google.com/test/rich-results)
  ou o Schema Markup Validator — colar a URL e conferir o `Church` interpretado.
- **NAP** — o `telephone` do schema é o WhatsApp pessoal do pastor (DDD 22). Precisa
  bater **exatamente** com o que for cadastrado no Google Business Profile.

---

_Documento vivo. Revisar após ligar o Search Console e ter 30–90 dias de dados
reais de impressão/clique._
