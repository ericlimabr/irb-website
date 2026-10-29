# Meta Conversions API — o evento enviado pelo servidor

**O que é:** o mesmo evento de conversão que o pixel manda do navegador, mandado
de novo pelo nosso servidor, direto para o Meta. Implementação em
[`lib/meta-capi.ts`](../lib/meta-capi.ts).

**Por que existe:** o pixel do navegador perde conversão. Bloqueador de anúncio,
Safari, aba fechada antes de a tag disparar e cookie de terceiro bloqueado fazem
o evento não chegar. O envio pelo servidor não depende de nada disso.

---

## Glossário

| Termo | O que quer dizer aqui |
|---|---|
| **Pixel** | O trechinho de código do Meta que roda no navegador de quem visita e conta o que aconteceu. O nosso é o `2253501382066542`. |
| **Conversions API (CAPI)** | O caminho alternativo: em vez do navegador, é o servidor que conta ao Meta o que aconteceu. |
| **Conjunto de dados (dataset)** | Como o Meta chama hoje o que antes chamava de pixel. É a mesma coisa e o mesmo ID. |
| **Evento** | Uma ação que vale medir. `CompleteRegistration` é "alguém se inscreveu"; `Purchase` é "alguém pagou". |
| **`event_id`** | Um nome único por acontecimento. Se o navegador e o servidor mandam o mesmo evento com o mesmo `event_id`, o Meta entende que é **um só** e não conta duas vezes. |
| **Desduplicação** | Exatamente isso: juntar os dois envios num evento só. |
| **SHA-256** | Um cálculo sem volta. Vira o e-mail em 64 caracteres sem sentido; dá para comparar dois iguais, mas não dá para descobrir o e-mail a partir do resultado. |
| **`_fbp` / `_fbc`** | Dois cookies que o pixel escreve no navegador. O `_fbp` identifica aquele navegador para o Meta, e o `_fbc` guarda o clique no anúncio que trouxe a pessoa. São eles que ligam a inscrição à campanha. |
| **`action_source`** | De onde o evento nasceu. `website` quando a pessoa estava no site; `system_generated` quando fomos nós que registramos depois, sem ninguém no navegador. |
| **AEM** | *Aggregated Event Measurement*, a lista de até 8 eventos priorizados que o Meta usa em iPhone. Exige o domínio verificado. |
| **Token da CAPI** | A senha do envio pelo servidor. É segredo, mora no `.env` e na Vercel, nunca em commit. |

---

## Os dois eventos que saem daqui

| Evento | Quando | De onde | Valor | `event_id` |
|---|---|---|---|---|
| `CompleteRegistration` | A inscrição foi gravada no banco | `submitInscricao`, em `app/actions/inscricao.ts` | total da inscrição em reais | `inscricao-<id da inscrição>` |
| `Purchase` | A igreja dá baixa no Pix, conferindo o extrato | `setInscricaoPaga`, no mesmo arquivo | total da inscrição em reais | `pago-<id da inscrição>` |

**Por que `CompleteRegistration` e não `Lead`:** `Lead` já é o evento do
formulário de **contato** no container da GTM. Inscrição em conferência é
registro concluído, que é o que `CompleteRegistration` quer dizer no vocabulário
do Meta, e assim os dois não se misturam num número só.

**Por que `Purchase` não sai junto com a inscrição:** o Pix é pago fora do site,
sem intermediário, e ninguém avisa que caiu. Compra só existe depois que alguém
da igreja conferiu o extrato, e é esse clique que dispara o evento. Como nessa
hora quem está no navegador é a igreja, e não a pessoa inscrita, o evento vai
com `action_source: "system_generated"` e com os cookies do pixel que ficaram
**gravados na inscrição**.

---

## Consentimento (LGPD)

Nada sai sem o aceite do banner de cookies. A trava é dupla:

1. **Na inscrição:** o servidor lê o cookie `irb_consent_v2` da própria
   requisição. Se não estiver em `granted`, o evento não é enviado.
2. **Na baixa do pagamento:** o aceite daquele momento ficou gravado na coluna
   `metaConsent` da inscrição. A baixa acontece horas depois, com a igreja no
   navegador, e sem essa coluna não haveria como respeitar a escolha da pessoa.

E-mail, telefone e nome saem sempre em SHA-256. O texto legível nunca atravessa
a rede. A [política de privacidade](../app/\(site\)/politica-de-privacidade/page.tsx)
(texto em `const/index.ts`, seções 2, 4 e 6) descreve isso para o titular.

---

## Desduplicação com o pixel do navegador

O servidor devolve o `event_id` para a página (`InscricaoResult.eventId`), e a
página o empurra para o `dataLayer` junto do evento `conferencia_inscricao`:

```js
{ event: "conferencia_inscricao", valor: 20, event_id: "inscricao-abc123" }
```

**A tag do Meta na GTM precisa passar esse valor no campo `Event ID`, e usar o
mesmo nome de evento `CompleteRegistration`.** Sem isso o Meta conta a mesma
inscrição duas vezes. Enquanto a tag do navegador não existir, o evento do
servidor já vale sozinho.

---

## Falha não derruba inscrição

`lib/meta-capi.ts` nunca lança erro, tem teto de 5 segundos de espera e roda
dentro de `after()`, depois de a resposta já ter sido entregue: ninguém espera o
Meta na frente do botão. Quando o envio falha, fica uma linha em `/admin/erros`
com os códigos `META_CAPI_RECUSOU` ou `META_CAPI_SEM_RESPOSTA`, **sem aviso no
WhatsApp**: medição que falha não vale acordar ninguém, e a inscrição continua
inteira.

Sem `META_CAPI_TOKEN` no ambiente, nada é enviado e o site funciona igual.

---

## O que falta, e de quem é

| Passo | Onde | Estado em 29/10/2026 |
|---|---|---|
| Token da CAPI em `META_CAPI_TOKEN`, no `.env` e na Vercel | Gerenciador de Eventos → conjunto de dados `2253501382066542` → Configurações → Conversions API → Gerar token | ✅ Feito por ele. O token nunca passou por chat. |
| `metaFbp`, `metaFbc` e `metaConsent` na tabela `Inscricao` | `npx prisma db push` no Postgres do Supabase | ✅ Rodado em 29/10/2026, banco em sincronia com o schema |
| Meta tag de verificação do domínio `irbrasilia.org` | `metadata.verification.other` em `app/layout.tsx` | ✅ No código: `facebook-domain-verification`. Falta o deploy e depois clicar em "Verificar" no painel. |
| Priorizar os eventos no AEM, com `Purchase` e `CompleteRegistration` no topo | Gerenciador de Eventos → Configurações agregadas de eventos | ⏸️ Só depois de o domínio verificar e de o primeiro evento chegar |
| Tag `CompleteRegistration` na GTM com o `Event ID` do `dataLayer` | Container `GTM-PH2RDK44` | ⏸️ Opcional. Sem ela o evento do servidor vale sozinho; com ela, o `Event ID` é obrigatório. |
| Conferir na aba Eventos de teste | Gerenciador de Eventos → Eventos de teste, com `META_CAPI_TEST_EVENT_CODE` preenchido | ⏸️ Depois do deploy |

---

_Documento vivo. Atualizar quando um evento for criado ou mudar de nome._
