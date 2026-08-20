# Publicando um post no blog (template estático)

O blog é **estático**: cada post é um par de arquivos + algumas entradas em
consts. Não há CMS/banco em uso (política static-first, DB-ready; ver
[`static-to-db-migration.md`](./static-to-db-migration.md)).

O post **`/blog/o-que-e-uma-igreja-reformada`** é o **template de referência**:
copie-o para criar novos posts. Ele foi recuperado do site antigo (Wix) via
Wayback Machine; a proveniência está em
[`recovered/o-que-e-uma-igreja-reformada.md`](./recovered/o-que-e-uma-igreja-reformada.md).

> **Estado atual do `/blog`:** a listagem `/blog` ainda é **mockup** (posts e
> autores fictícios em `const/mockups.ts`) e está **desligada** por feature flag
> (`config/index.ts` → `blog.active: false`), com `robots: noindex` herdado de
> `app/(site)/blog/layout.tsx`. Por isso:
> - Cada post real precisa **sobrescrever o `robots` para indexável** no seu
>   próprio `layout.tsx` (o template já faz isso).
> - Há um **redirect 307 temporário** de `/blog` para o post real em
>   `next.config.ts` (remover quando o `/blog` virar seção de verdade).

---

## Anatomia de um post

| Arquivo | Papel |
|---|---|
| `app/(site)/blog/<slug>/page.tsx` | Client component. Conteúdo (objeto `article` + `body`), renderer de blocos, botões de compartilhar e o card de autor. |
| `app/(site)/blog/<slug>/layout.tsx` | Server component. Metadados (title, description, canonical, **robots index**, Open Graph `article`) + `<BlogPostingJsonLd>`. |
| `public/blog/<slug>-cover.webp` | Capa 1200x630 (também é a imagem OG). Gerada por `scripts/blog-cover.mjs`. |
| `const/index.ts` → `PAGE_TITLES` | Título do breadcrumb: `"/blog/<slug>": "Título"`. |
| `const/mockups.ts` → `MOCKUP_BLOG_POSTS` | Card na grade `/blog` (com `href` próprio para o post). |
| `app/sitemap.ts` | Entrada do post (para ser indexável mesmo com o `/blog` desligado). |
| `next.config.ts` | 301 de URL antiga, **se** estiver recuperando um post do site velho. |

Componentes reutilizáveis (já existem, não precisa recriar):
`components/seo/BlogPostingJsonLd.tsx`, `components/ui/ShareButton.tsx`.

---

## Passo a passo para um novo post

### 1. Copiar o template
```bash
cp -r "app/(site)/blog/o-que-e-uma-igreja-reformada" "app/(site)/blog/<slug>"
```

### 2. Editar o conteúdo (`page.tsx`)
No objeto `article`, ajuste:
- `category`, `title`, `date` (ex.: "10 março 2026"), `readTime` (ex.: "8 min de leitura")
- `author`, `initials` (2 letras). Se houver quem publicou (diferente do autor),
  `publisher` + `publisherInitials`; senão, remova o bloco "Publicado por".
- `ARTICLE_URL` (topo do arquivo): trocar o slug.
- Nos dois `<ShareButton>` (topo e fim), ajuste `title`/`text`.
- `relatedPosts`: apontar para páginas reais relacionadas.
- Se o autor não tiver página externa, remova o link "Outros textos do autor".

### 3. Escrever o corpo (`body`)
`body` é um array de blocos. Tipos suportados pelo renderer (ver `ArticleBlock`):

| `type` | Campos | Render |
|---|---|---|
| `lead` | `content` | Parágrafo de abertura (serif, maior) |
| `heading` | `content` | Subtítulo de seção |
| `paragraph` | `content` | Parágrafo corrido |
| `scripture` | `content`, `reference` | Citação bíblica (barra dourada + referência) |
| `pullquote` | `content`, `attribution?` | Destaque grande em itálico |

```ts
{ type: "scripture", content: "Porque Deus amou o mundo...", reference: "João 3.16 · ARA" }
```

> Separadores em títulos: use o ponto médio `·` (padrão do design), não travessão.

### 4. Gerar a capa
```bash
node scripts/blog-cover.mjs <slug> <img1> [img2] [img3]
```
- 1 imagem: capa simples. 2: fusão lado a lado. **3: a do MEIO é a dominante do
  centro**, as outras vão às laterais (com bordas esfumadas).
- Saída: `public/blog/<slug>-cover.webp` (1200x630, tom navy/gold + logo dourada
  na base). Imagens costumam vir de `public/galery/<album>/`.

### 5. Metadados + JSON-LD (`layout.tsx`)
Ajuste o `metadata` (title, description, `alternates.canonical`, `openGraph`) e
**mantenha `robots: { index: true, follow: true }`** (sobrescreve o noindex do
blog). No `<BlogPostingJsonLd>`, passe:

```tsx
<BlogPostingJsonLd
  headline="..."
  description="..."
  path="/blog/<slug>"
  image="/blog/<slug>-cover.webp"   // ImageObject 1200x630
  articleSection="..."               // a categoria
  datePublished="AAAA-MM-DD"
  authorName="..."
  authorUrl="https://..."            // opcional
/>
```
O componente já preenche `publisher` (Organization + logo raster
`public/logo/logo-navy.png`, 592x512), `mainEntityOfPage`, `inLanguage`, etc.

### 6. Registrar nas consts
- `const/index.ts` → `PAGE_TITLES`: `"/blog/<slug>": "Título"`.
- `const/mockups.ts` → `MOCKUP_BLOG_POSTS`: um item com `href: "/blog/<slug>"`.

### 7. Sitemap
Em `app/sitemap.ts`, adicione ao `staticRoutes`:
```ts
{ path: "/blog/<slug>", priority: 0.6, changeFrequency: "yearly" }
```
(assim o post entra no sitemap mesmo com o `/blog` desligado.)

### 8. Redirect de URL antiga (só ao recuperar do site velho)
Em `next.config.ts`, `permanent: true` (301 permanente; o Next emite 308,
equivalente para o Google).

> **Gotcha do acento:** o `path-to-regexp` do Next **não casa caractere acentuado**
> numa `source` literal (dá 404). Use um **parâmetro curinga** na posição do
> acento, que casa `é`/`e` e qualquer codificação:
> ```ts
> { source: "/post/o-que-:conector-uma-igreja-reformada",
>   destination: "/blog/<slug>", permanent: true }
> ```

---

## Autor vs. Publicador

`author` e `publisher` são coisas diferentes (e nenhum exige criar um `User` no
schema Prisma: `User` é conta de login; o byline é só uma string):
- **Autor:** quem escreveu o texto (crédito principal, vai no JSON-LD e OG).
- **Publicou:** quem apenas disponibilizou/publicou no site (crédito secundário).

No template, o autor aparece no cabeçalho e no card do fim; o publicador aparece
ao lado, com seu próprio avatar. Ex.: o post recuperado tem autor **Rev. Kenneth
Wieske** (missionário das Igrejas Reformadas do Canadá no Brasil) e foi
**publicado por Weliton de Eça**.

---

## Compartilhamento

`components/ui/ShareButton.tsx` usa a Web Share API nativa (folha do sistema no
celular, com a preview OG) e, no desktop sem Web Share, copia o link. Props:
`url`, `title`, `text`, `label`, `className`. O template já o usa no topo (linha
de metadados) e no fim do artigo.

---

## Checklist

- [ ] `page.tsx` e `layout.tsx` na pasta `<slug>`
- [ ] `article` editado (autor/publicador, data, categoria, `ARTICLE_URL`)
- [ ] `body` escrito com os blocos
- [ ] Capa gerada em `public/blog/<slug>-cover.webp`
- [ ] `layout.tsx`: metadata + `robots.index: true` + `BlogPostingJsonLd`
- [ ] `PAGE_TITLES` (breadcrumb) e `MOCKUP_BLOG_POSTS` (card)
- [ ] `sitemap.ts` com o post
- [ ] 301 em `next.config.ts` (se recuperando URL antiga)
- [ ] `npx tsc --noEmit` limpo

---

## SEO contínuo (relacionado)

- Levantar as **URLs antigas do Wix** no Search Console e criar os 301 (ver
  [`seo-palavras-chave.md`](./seo-palavras-chave.md)). Até agora só o post
  recuperado tem 301.
- O JSON-LD já cobre o Article do Google (autor, data, imagem, publisher com logo
  raster). Passa limpo no Rich Results Test.
