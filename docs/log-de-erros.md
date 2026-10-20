# Falhas do site: por que a irmã não conseguiu se inscrever, e o log que resolve

Escrito em 20/10/2026. Todos os horários aqui são de Brasília (UTC-3).

## Glossário

| Termo                 | O que quer dizer aqui                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Campo-isca (honeypot) | Campo escondido no formulário. Pessoa nenhuma vê; robô preenche tudo o que encontra. Se vier preenchido, o servidor trata o envio como robô. |
| Autofill              | O preenchimento automático do navegador ou do celular, que completa campos pelo **nome** deles.                                              |
| Gerenciador de senha  | Programa que guarda senhas e preenche formulários (1Password, LastPass, Bitwarden, Dashlane, o do próprio navegador).                        |
| Action                | Função do servidor que o formulário chama ao enviar. Aqui, `app/actions/inscricao.ts`.                                                       |
| Sequência (Postgres)  | Contador que dá o próximo número da inscrição. Avança até quando a gravação falha, e é por isso que ela serve de prova.                      |
| `console.error`       | Mensagem que o servidor escreve no log da Vercel. Só aparece lá, só se alguém abrir, e expira.                                               |
| CallMeBot             | Serviço que entrega mensagem no WhatsApp por uma chamada de endereço. Já era quem avisava das inscrições novas.                              |
| Janela de silêncio    | Tempo em que o mesmo tipo de falha não avisa de novo, para o celular não tocar sem parar.                                                    |
| Dar baixa             | Marcar a falha como vista no admin. Não apaga: o log é histórico.                                                                            |

## O que aconteceu

Uma irmã avisou que não conseguia se inscrever. O que ela deu foi:

- a mensagem `Não foi possível concluir a inscrição.`
- o valor na tela, R$ 40,07
- não chegou a ver o QR Code
- o endereço estava certo

Três dessas informações já apontam o caminho:

1. **R$ 40,07** são 2 adultos a R$ 20 mais os 7 centavos. Esse valor é somado
   **no navegador**, enquanto a pessoa escolhe quantas pessoas vão. Ver o valor
   certo não prova que o servidor fez nada: prova só que ela preencheu o
   formulário até o fim.
2. **A mensagem é a curta.** A action tem duas mensagens que começam com
   "Não foi possível concluir a inscrição": a do campo-isca, que termina no
   ponto, e a do erro de gravação, que termina com "Tente de novo em
   instantes.". Ela recebeu a primeira.
3. **O banco não tem linha nenhuma dela.** Mais: a sequência do número da
   inscrição está em 6, e a inscrição 6 é o teste do Eric às 13h46. Se o envio
   dela tivesse chegado à gravação, teria consumido um número, e o teste seria
   o 7. Logo a recusa veio **antes** de tocar o banco.

Antes da gravação a action tem nove saídas. Oito têm mensagem própria
("Preencha nome, WhatsApp e e-mail", "Confira o e-mail", "As inscrições estão
encerradas", e assim por diante). Sobra uma com o texto que ela viu: **o
campo-isca**.

## A causa

O campo-isca se chamava `website`:

```tsx
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden
  className="isca"
/>
```

Escondido para gente, com `position:absolute; left:-9999px`. O problema não é
o esconderijo: é o **nome**. `website`, `url` e `site` são nomes que
gerenciador de senha, autofill de navegador e serviço de preenchimento do
celular reconhecem e completam sozinhos, e vários deles ignoram
`autocomplete="off"` de propósito, porque foi muito usado para atrapalhar o
usuário.

Quando isso acontece com uma pessoa de verdade, o servidor a trata como robô.
E o efeito é exatamente o que ela relatou: **não adianta tentar de novo**, o
erro é sempre o mesmo, e o site não dá nenhuma saída. Nada disso aparecia em
lugar nenhum, porque essa recusa nem escrevia no log.

O mesmo campo, com o mesmo nome, estava no formulário de contato
(`/contato`) — e lá era pior: a resposta era "enviado" mesmo recusando. Quem
caísse na isca achava que tinha escrito para a igreja, e a mensagem não existia.

## O que mudou

**1. O nome do campo saiu de `website`.** Agora está em `const/isca.ts`, com os
atributos que cada gerenciador documenta para ser ignorado (`data-1p-ignore`,
`data-lpignore`, `data-bwignore`, `data-form-type="other"`). Os dois
formulários, conferência e contato, usam a mesma constante.

**2. A recusa deixou de ser parede.** Quando a isca pega alguém na inscrição, a
pessoa agora recebe o convite para falar com a igreja no WhatsApp, com link, em
vez de bater de frente num erro sem saída. A recusa continua, porque robô
existe.

**3. Toda falha vira linha no banco e aviso no WhatsApp.** A tabela é
`logs_erro`, quem escreve é `lib/log-erro.ts`, e quem lê é `/admin/erros`.

Códigos registrados hoje:

| Código                           | Nível | Quando sai                                                                                                                                                                                                                                                                                   |
| -------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ISCA_MARCADA`                   | Aviso | A isca de robô veio marcada. **Nada foi recusado**: a inscrição ou a mensagem seguiu em frente, e o aviso só pede para a igreja conferir se aquilo é de gente. Antes de 20/10/2026 o código se chamava `ISCA_PREENCHIDA` e recusava; `docs/isca-de-robo.md` conta por que deixou de recusar. |
| `GRAVACAO_FALHOU`                | Erro  | A inscrição não foi gravada.                                                                                                                                                                                                                                                                 |
| `ESTADO_DAS_INSCRICOES_ILEGIVEL` | Erro  | Não deu para ler no banco se as inscrições estão abertas.                                                                                                                                                                                                                                    |
| `PIX_KEY_AUSENTE`                | Erro  | Falta a chave Pix no ambiente, e ninguém consegue se inscrever.                                                                                                                                                                                                                              |
| `MENSAGEM_NAO_GRAVADA`           | Erro  | Mensagem do formulário de contato perdida.                                                                                                                                                                                                                                                   |
| `LIMITE_POR_EMAIL_ILEGIVEL`      | Aviso | A contagem do limite por e-mail falhou; a inscrição seguiu em frente.                                                                                                                                                                                                                        |
| `EMAIL_NAO_ENVIADO`              | Aviso | A inscrição foi gravada, mas o e-mail com o QR Code não saiu.                                                                                                                                                                                                                                |

**4. Um erro que escapava da action foi fechado.** A leitura de "as inscrições
estão encerradas?" acontecia **antes** do `try`, apesar de o comentário no
código dizer o contrário. Se ela falhasse, o erro escapava inteiro: a promessa
no navegador era rejeitada e a pessoa ficava olhando o botão travado, sem
mensagem nenhuma. Agora ela tem o seu próprio `try`, grava
`ESTADO_DAS_INSCRICOES_ILEGIVEL` e manda a pessoa para o WhatsApp da igreja.

## Três regras que o log obedece

1. **Nada em `lib/log-erro.ts` lança erro.** Quem chama já está no meio de uma
   falha; registrar não pode virar a segunda falha.
2. **Nome e contato da pessoa vão para o banco, nunca para o WhatsApp.** Mesma
   regra do aviso de inscrição: WhatsApp é tela de bloqueio, prévia de
   notificação e aparelho emprestado. No banco, os dados ficam atrás do login
   do admin.
3. **Janela de silêncio de 10 minutos por código.** Se o banco cair, cada
   visita falha; sem a janela, o celular tocaria sem parar. A janela é
   verificada primeiro na memória do servidor, que responde mesmo com o banco
   fora do ar, e depois no próprio banco, que enxerga as outras instâncias da
   Vercel.

O `console.error` continua em todos os caminhos. É o único canal que sobra se o
banco e o CallMeBot estiverem os dois fora do ar.

## O que o aviso no WhatsApp parece

```
⚠️ Falha no site da igreja
inscricao · ISCA_MARCADA

A isca de robô veio marcada e a inscrição seguiu em frente de propósito.
Confira se esta inscrição é de gente antes de dar baixa no pagamento.
Pessoa: <nome que a pessoa digitou>
20/10 14:22 (horário de Brasília)

https://irbrasilia.org/admin/erros
```

## Arquivos

| Arquivo                    | O que é                                                 |
| -------------------------- | ------------------------------------------------------- |
| `const/isca.ts`            | Nome do campo-isca e os atributos de "não me preencha". |
| `lib/log-erro.ts`          | `registraErro()`: grava e avisa. Nunca lança.           |
| `app/actions/log-erro.ts`  | Leitura e baixa, só com sessão.                         |
| `app/admin/erros/page.tsx` | A tela "Falhas do site".                                |
| `prisma/schema.prisma`     | `model LogErro` e `enum LogNivel`.                      |

## Para colocar no ar

A ordem importa: a tabela precisa existir antes de o código novo atender
visita.

1. `npx prisma db push` — cria `logs_erro`, o tipo `LogNivel` e dois índices.
   É só adição: nada é alterado nem derrubado. O SQL exato sai em
   `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`.
2. Commit e push do ramo, que é o que faz a Vercel publicar.
3. Conferir no ar: abrir `/conferencia`, inscrever-se com dados de teste e ver
   o QR Code aparecer; e abrir `/admin/erros`, que deve estar vazia.
4. Apagar a inscrição de teste no admin.

## O que ficou de fora

- **Não dá para saber qual programa preencheu a isca da irmã.** Não foi
  registrado nada no momento, e a correção não depende de saber: o nome do
  campo mudou e, se acontecer de novo com qualquer navegador, o aviso chega no
  WhatsApp em segundos, com o nome e o contato de quem ficou de fora.
- **A irmã continua sem inscrição.** Ela precisa ser inscrita na mão, ou
  avisada para tentar de novo depois que isto subir.
- **A hora no admin de inscrições sai em UTC.** O formatador de lá não declara
  fuso, e o servidor da Vercel roda em UTC: a tela mostra três horas à frente.
  A tela nova já sai em horário de Brasília. Corrigir a antiga é conserto de
  uma linha, e ninguém pediu ainda.
- **O log não tem limpeza automática.** `logs_erro` cresce; 200 linhas
  aparecem na tela. Quando incomodar, a saída é uma limpeza do que já tem baixa
  e mais de X dias.
