# Integração de Analytics no painel administrativo

Como trazer os dados de **GA4**, **Microsoft Clarity** e (opcionalmente) **Google
Ads** para dentro da **view administrativa** do próprio site, em vez de depender
só dos painéis externos. Este documento é o **plano** — nada aqui está
implementado ainda. Executar quando as contas estiverem finalizadas.

> **Contexto de projeto:** a medição do site já passa por um **único container
> GTM** (`GTM-PH2RDK44`); GA4 (`G-9VGVR21929`) e Clarity (`y4vr1pvdsk`) são
> configurados como tags **dentro** do container, não como snippets no código
> (ver `app/layout.tsx` → `components/analytics/GoogleTagManager.tsx`). Este doc
> trata do caminho **inverso**: *puxar* os dados desses serviços de volta para o
> admin via API server-side.

---

## 0. Objetivo

Um painel de "saúde do site" dentro do admin (`/admin`) com KPIs — visitantes,
sessões, páginas mais vistas, origem de tráfego — sem sair da aplicação. Fonte de
verdade continua sendo cada serviço; o admin apenas **lê** via API e renderiza.

---

## 1. O que cada fonte oferece

| Fonte | API | Auth | O que dá | Esforço |
|---|---|---|---|---|
| **GA4** | Google Analytics **Data API** (v1) | **Service account** do Google Cloud com papel *Viewer* na propriedade GA4 | Usuários, sessões, pageviews, páginas mais vistas, origem de tráfego, país/cidade, tempo real — como consultas métrica+dimensão | **Médio** ✅ melhor custo-benefício |
| **Clarity** | **Clarity Data Export API** | **Token** de projeto (Clarity → Settings → Data Export) | Métricas **agregadas** (sessões, profundidade de scroll, dead/rage clicks, páginas top) dos **últimos 1–3 dias**. **Sem gravações/heatmaps via API** — só na UI do Clarity | **Baixo, porém limitado** |
| **Google Ads** | **Google Ads API** | OAuth2 **+ developer token (aprovação do Google)** | Gasto, cliques, impressões, conversões de campanha | **Alto** — burocrático; só vale se houver campanha ativa |
| **GTM** | Tag Manager API | OAuth2 | Gerencia **configuração do container**, **não** dados de analytics — não serve aqui | n/a |

---

## 2. Recomendação (ordem de execução)

1. **GA4 Data API — fazer.** Maior valor, autocontido, entrega um painel de
   saúde real dentro do admin. É o item que justifica o trabalho.
2. **Clarity API — opcional, nice-to-have.** Barato de somar, mas dado fino; o
   valor real do Clarity (gravações, heatmaps) **não** está na API, então ainda
   se abre a UI do Clarity para isso. No admin, serve para um card de "páginas
   top / rage clicks" e pouco mais.
3. **Ads API — pular por ora.** Não compensa a aprovação de developer token
   enquanto não houver campanha paga rodando.

---

## 3. Arquitetura — encaixe no projeto

Segue a política **estático-primeiro / pronto-para-banco** e o padrão de *seam*
de acesso a dados descritos em [`static-to-db-migration.md`](./static-to-db-migration.md).
A diferença: aqui a fonte é uma **API externa**, não o banco — mas o seam é o
mesmo, então a UI não sabe de onde vêm os números.

```
types/analytics.ts        # AnalyticsSummary, TopPage, TrafficSource… (tipos puros)
data/analytics.ts         # accessor server-only: getAnalyticsSummary() → AnalyticsSummary
                          #   - chama a GA4 Data API (e, opcional, a do Clarity)
                          #   - normaliza para os tipos acima
                          #   - React `cache()` + revalidate para não martelar a API
app/(admin)/.../page.tsx  # server component: await getAnalyticsSummary() → tiles
components/admin/AnalyticsTiles.tsx  # apresentação (KPI tiles, sem lógica de fetch)
```

Princípios:

- **Server-only.** O accessor roda só no servidor (server component / route
  handler / server action). As credenciais **nunca** vão para o cliente. Marcar
  o módulo com `import "server-only"`.
- **Cache.** Envolver a leitura em `cache()` e servir com `revalidate` (ex.: a
  cada 1–6 h). Analytics não precisa ser tempo real no admin; cache evita
  estourar cota e bloquear a renderização da página.
- **Degradação graciosa.** Se a API falhar ou as credenciais faltarem, o
  accessor retorna `null`/vazio e os tiles mostram um estado "sem dados" — nunca
  quebram o `/admin`. Igual ao resto do admin quando o backend não está ligado
  (ver `admin-cms-unwired`).
- **Um tipo, várias fontes.** `AnalyticsSummary` agrega GA4 (e Clarity, se
  ligado) num único formato; a UI consome só o tipo. Trocar/expandir fonte não
  mexe na apresentação.

---

## 4. GA4 — passos de configuração (quando for executar)

1. **Google Cloud** → criar (ou reusar) um projeto → **habilitar** a *Google
   Analytics Data API*.
2. Criar uma **service account** → gerar uma **chave JSON**.
3. No **GA4** (Admin → Property Access Management), conceder à service account
   (o e-mail `...@...iam.gserviceaccount.com`) o papel **Viewer** na propriedade
   `G-9VGVR21929`.
4. Guardar a credencial **como env, no servidor** — nunca commitada:
   - `GA4_PROPERTY_ID` — o **Property ID numérico** (não o `G-…`; é o número em
     GA4 Admin → Property Settings).
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON` — o conteúdo do JSON da service
     account (string única). Ler e parsear no accessor.
5. Biblioteca: `@google-analytics/data` (client oficial Node). Consulta típica
   (`runReport`): métricas `activeUsers`, `sessions`, `screenPageViews` por
   dimensões `pagePath`, `sessionSource` num `dateRange`.

> **Segredo:** o JSON da service account é credencial sensível. Vai **só** em
> env server-side (mesma disciplina do `SMTP_PASS`/`DATABASE_URL`). Nunca em
> arquivo commitado, nunca com prefixo `NEXT_PUBLIC_`, nunca no bundle do
> cliente.

---

## 5. Clarity — passos (opcional)

1. Clarity → **Settings → Data Export** → gerar um **API token** do projeto.
2. Guardar como env server-side: `CLARITY_API_TOKEN`.
3. Chamar o endpoint de export (métricas agregadas, janela de 1–3 dias) a partir
   do mesmo `data/analytics.ts`, fundindo no `AnalyticsSummary`.
4. **Expectativa realista:** um ou dois cards ("páginas top", "rage/dead
   clicks"). Para gravações e heatmaps, continua-se abrindo a UI do Clarity — a
   API não os expõe.

---

## 6. Google Ads — nota (adiado)

Requer **developer token** (aprovação do Google) + OAuth2 + o `AW-…` do fluxo de
conversão. Só implementar se houver campanha paga cujo gasto/conversões valham um
card no admin. Enquanto for só "reservar a conta", não integrar.

---

## 7. Slots de `.env` a reservar (sem valores ainda)

```env
# ── Admin Analytics / GA4 Data API (server-only) ──
# Property ID NUMÉRICO do GA4 (não o G-…). GA4 Admin → Property Settings.
GA4_PROPERTY_ID=""
# Conteúdo do JSON da service account (uma linha). NUNCA commitar. NUNCA NEXT_PUBLIC_.
GOOGLE_APPLICATION_CREDENTIALS_JSON=""

# ── Admin Analytics / Clarity Data Export (opcional, server-only) ──
CLARITY_API_TOKEN=""
```

> Manter fora do `NEXT_PUBLIC_` de propósito: são chaves de leitura de dados, uso
> exclusivo do servidor.

---

## 8. Spec dos tiles (admin)

Cards a renderizar no `/admin`, na linguagem visual do design system (cantos
retos, mono uppercase nos rótulos/eyebrows, navy/gold):

- **Visitantes (28 d)** — `activeUsers`, com variação vs. período anterior.
- **Sessões (28 d)** — `sessions`.
- **Páginas mais vistas** — top 5 `pagePath` por `screenPageViews`.
- **Origem de tráfego** — `sessionSource` (orgânico / direto / referência).
- *(Clarity, se ligado)* **Atrito** — rage/dead clicks nas páginas top.

Cada tile mostra estado "sem dados" quando o accessor retorna vazio.

---

## 9. Restrições de segurança (inegociáveis)

- Credenciais (JSON da service account, token do Clarity) **só** em env
  server-side; jamais no cliente, jamais commitadas, jamais `NEXT_PUBLIC_`.
- O accessor é `import "server-only"`; nenhuma chamada de API de analytics parte
  do browser.
- O painel é **somente leitura**: nunca escreve nesses serviços.
- Atrás da autenticação do admin (mesma proteção de `/admin` e `/login` já
  bloqueados no `robots.ts`).

---

## 10. Checklist de execução

- [ ] `types/analytics.ts` — tipos (`AnalyticsSummary`, `TopPage`, `TrafficSource`).
- [ ] Habilitar GA4 Data API no Google Cloud; criar service account + chave JSON.
- [ ] Conceder *Viewer* da propriedade GA4 à service account.
- [ ] Preencher `GA4_PROPERTY_ID` + `GOOGLE_APPLICATION_CREDENTIALS_JSON` no `.env`.
- [ ] `data/analytics.ts` — accessor GA4 (`server-only`, `cache()` + `revalidate`).
- [ ] `components/admin/AnalyticsTiles.tsx` + montar no dashboard `/admin`.
- [ ] (Opcional) token do Clarity + fundir métricas agregadas no summary.
- [ ] Estado "sem dados" testado (credenciais ausentes não quebram o admin).
- [ ] (Adiado) Google Ads, só com campanha ativa.

---

_Documento vivo. Complementa [`seo-roadmap.md`](./seo-roadmap.md) (Frente 5 —
medição) e [`static-to-db-migration.md`](./static-to-db-migration.md) (padrão de
seam de dados)._
