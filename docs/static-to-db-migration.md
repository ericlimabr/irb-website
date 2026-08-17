# Estático → Banco: política e plano de migração

## Princípio (política do projeto)

> **Static-first, DB-ready.** Toda funcionalidade que envolva a escolha entre
> **conteúdo estático (const)** e **banco de dados (CMS)** é **construída estática
> agora**, mas **arquitetada para virar banco no futuro**, sem retrabalho.

**Por quê:**
- **Publica já** — não depende do banco estar populado nem acessível em runtime.
- **Coerente com a arquitetura atual** — hoje nenhuma página pública sob
  `app/(site)/` toca o DB; o conteúdo vive em `const/`.
- **Editável em código** agora; **editável por não-desenvolvedores** (via admin)
  depois, sem deploy.
- **Reversível e incremental** — dá para migrar um recurso de cada vez.

Esta política vale para **todo recurso novo** que caia nessa bifurcação, não só a FAQ.

---

## O padrão que torna a troca barata: a "costura" de dados (data-access seam)

A regra de ouro: **componentes e páginas NUNCA importam o const diretamente.** Eles
consomem um **acessor único** por recurso. Hoje o acessor devolve o const; amanhã
devolve o resultado do banco. A migração fica **em um arquivo só**.

```ts
// data/faq.ts  — a "costura": único ponto que sabe DE ONDE vêm os dados.
import { FAQ_ITEMS } from "@/const"
import type { FaqItem } from "@/types/faq"

export async function getFaqItems(): Promise<FaqItem[]> {
  // HOJE (estático):
  return FAQ_ITEMS

  // FUTURO (banco): trocar o corpo por —
  //   const rows = await getActiveFaqs()
  //   return rows.map(({ question, answer }) => ({ question, answer }))
  // Nada mais no app precisa mudar.
}
```

Requisitos para o padrão funcionar:
1. **Acessor `async`** desde já (mesmo retornando const síncrono), para que virar
   `await db()` no futuro não altere assinatura.
2. **Tipo compartilhado** (`types/faq.ts`) idêntico ao shape que o banco devolverá —
   const e DB produzem o **mesmo tipo**.
3. **Componentes consomem o acessor**, não o const. Viram Server Components `async`.
4. **O schema JSON-LD também lê do acessor**, não do const.

> Observação sobre a FAQ **já entregue**: hoje `FaqAccordion` e `FaqJsonLd` importam
> `FAQ_ITEMS` direto. Para cumprir a política, o passo pequeno é introduzir
> `data/faq.ts` + `types/faq.ts` e fazer os dois (e a página) consumirem o acessor.
> Ver checklist abaixo.

---

## Plano de migração da FAQ (caso de referência)

**Estado atual:**
- Estático: `FAQ_ITEMS` em `const/index.ts` (10 itens).
- Consumidores: `components/features/faq/FaqAccordion.tsx`,
  `components/seo/FaqJsonLd.tsx`, página `/perguntas-frequentes`.
- Infra de banco **já existe**: modelo `Faq` (`prisma/schema.prisma`), actions em
  `app/actions/faq.ts` (`getActiveFaqs`, `createFaq`, `updateFaq`, `deleteFaq`,
  `reorderFaqs`) e admin (`FaqAdminPageComponent`).

**Passos para migrar (quando decidirmos ligar o CMS):**

1. **Introduzir a costura** — criar `types/faq.ts` (`FaqItem = { question; answer }`)
   e `data/faq.ts` com `getFaqItems()` retornando `FAQ_ITEMS` (estático). *[pode ser
   feito já, ainda estático — recomendado]*
2. **Apontar consumidores para a costura** — `FaqAccordion`, `FaqJsonLd` e a página
   passam a `await getFaqItems()`. *[ainda estático]*
3. **Semear o banco** — popular a tabela `faqs` com os 10 itens atuais (script de
   seed a partir de `FAQ_ITEMS`, para não reescrever à mão).
4. **Trocar o corpo da costura** — `getFaqItems()` passa a `getActiveFaqs()` e mapear
   para `FaqItem`. Único ponto que muda.
5. **Tratar o caso vazio** — se o banco vier sem FAQs ativas, decidir: (a) esconder a
   seção, ou (b) **fallback para `FAQ_ITEMS`**. Recomendo o fallback para nunca sair
   com página/schema vazios.
6. **Cache/revalidação** — definir estratégia (ISR `revalidate` na página, ou confiar
   no `revalidatePath` que as actions já disparam) para o admin refletir sem redeploy.
7. **Validar** — Rich Results Test continua reconhecendo o `FAQPage` (o schema agora
   lê do banco via costura).

---

## Outros pontos com a mesma bifurcação (aplicar a mesma política)

Recursos que têm (ou terão) representação estática **e** um modelo no banco. Todos
seguem "static-first, DB-ready".

| Recurso | Estático hoje | Modelo/acessor de banco | Situação |
|---|---|---|---|
| **FAQ** | `FAQ_ITEMS` (`const/index.ts`) | `Faq` · `getActiveFaqs()` | Estático entregue; migração planejada (acima). |
| **Blog / Artigos / Mídia** | mocks em `const/mockups.ts` | `Post` · `getAllPublishedArticles*` (`utils/getDbData.ts`) | Flags `blog`/`media` **desligadas**. Quando ligarem, construir estático primeiro e migrar via costura. |
| **Configurações globais** | valores em `const`/`config` | `GlobalSettings` · `getSystemConfig()` | Depende de `GLOBAL_CONFIG_ID`. Mesma política. |
| **Tags / Autores** | — | `Tag`, `User` (`getAllTags`, `getAllAuthors`) | Só relevante quando o blog migrar; parte do pacote de Posts. |
| **Agenda / Eventos** | `SCHEDULE_DATA` (`const/index.ts`) | (sem modelo dedicado ainda) | Flag `agenda` desligada. Se ganhar modelo, aplicar a política. |

> **Contato** é exceção: já é banco na escrita (`prisma.contactMessage.create`) — não
> entra nesta política, pois nunca foi estático.

---

## Checklist de migração (genérico, por recurso)

- [ ] Existe **um acessor `async`** único (`data/<recurso>.ts`) e é o **único** ponto
      de acesso ao dado.
- [ ] **Tipo compartilhado** (`types/<recurso>.ts`); const e DB devolvem o mesmo shape.
- [ ] **Todos os consumidores** (UI + JSON-LD + metadata) usam o acessor, não o const.
- [ ] **Seed** do banco a partir do const (não reescrever conteúdo à mão).
- [ ] **Caso vazio** tratado (fallback para o const, de preferência).
- [ ] **Cache/revalidação** definida (ISR ou `revalidatePath`).
- [ ] **Feature flag / rollout** para alternar estático↔banco com segurança.
- [ ] **Validação** pós-troca (rich results, render, performance).

---

## Riscos e observações

- **Página pública passando a tocar o DB** muda o perfil de cache/performance (de
  estático/SSG para SSR/ISR). Sempre definir `revalidate` para não fazer query a cada
  request.
- **Indisponibilidade do banco** vira risco de runtime — daí a recomendação de
  **fallback para o const** no acessor.
- **Quebra intencional** do padrão atual ("páginas públicas não tocam o DB"): quando
  a primeira migração acontecer, atualizar a documentação/memória que registra esse
  padrão, para não gerar confusão.
- **Conteúdo autêntico** (ex.: confissões) que hoje é gerado por script a partir de
  fontes externas pode permanecer estático — nem tudo precisa ir para o banco; a
  política se aplica a conteúdo que se **beneficia** de edição pelo admin.

---

_Documento vivo. Atualizar a cada recurso migrado e revisar a política se a
arquitetura de dados mudar._
