# A página da conferência e as inscrições

A página `/conferencia` da 2ª Conferência Reformada (7 e 8 de novembro de
2026), com inscrição e pagamento por Pix. Nasceu do mockup em
`~/Documentos/igreja/conferencia/MOCKUP-CONFERENCIA.html`.

Em 20/10/2026 o campo-isca deste formulário recusou uma pessoa de verdade, que
não conseguia se inscrever de jeito nenhum. Desse episódio nasceram a correção
da isca e o log de falhas do site, com aviso no WhatsApp: está em
`docs/log-de-erros.md`.

## Glossário, antes de tudo

- **BR Code**: o texto comprido do Pix "copia e cola". É um padrão do Banco
  Central: campos numerados, cada um com o seu tamanho, e um dígito de
  verificação no fim. O QR Code é esse mesmo texto desenhado em quadradinhos.
- **txid**: identificador que viaja dentro do BR Code. Alguns bancos o mostram
  no extrato de quem recebe, outros não. Aqui ele é `CONF` mais o número da
  inscrição.
- **os 7 centavos**: somados uma vez ao total, iguais em toda inscrição. Eles
  marcam que aquele Pix é da conferência; **não identificam a pessoa**. Quem
  identifica no extrato é o nome de quem paga.
- **server action**: função que roda no servidor e o formulário chama direto,
  sem precisar de uma rota de API escrita à mão.
- **migração**: o comando que cria no banco de dados a tabela nova descrita no
  `schema.prisma`. Sem ela a tabela não existe.
- **bandeira** (feature flag): um liga/desliga em `config/index.ts`.
- **CallMeBot**: serviço que entrega mensagem no WhatsApp de um número que o
  autorizou antes. É o que manda o aviso de inscrição nova para a igreja.

## O que está construído

| Arquivo | O que faz |
| --- | --- |
| `const/conferencia.ts` | Todos os dados do evento: tema, palestras, preletores, programação, preço, datas. Fonte única. |
| `app/conferencia/page.tsx` | A página. Estática, só o formulário é interativo. |
| `app/conferencia/layout.tsx` | Sem navegação nem rodapé do site, com a medição ligada. |
| `app/conferencia/agenda/route.ts` | "Adicionar à minha agenda": Apple recebe `.ics` com os dois dias, o resto vai para o Google Agenda. |
| `components/pages/conferencia/InscricaoForm.tsx` | O formulário e o Pix que aparece na tela depois de enviar. |
| `components/pages/conferencia/BarraInscricao.tsx` | A barra presa no pé da tela, que surge quando o herói sai de vista. |
| `app/actions/inscricao.ts` | Grava a inscrição, deriva os centavos, monta o Pix, manda o e-mail. |
| `lib/pix.ts` | BR Code (campos EMV e o CRC-16) e o QR. |
| `lib/mail.ts` | `sendInscricaoConfirmationEmail`, o e-mail de confirmação com o QR embutido. |
| `utils/inscricao.ts` | As contas e os rótulos que a tela e o servidor precisam compartilhar. |
| `app/admin/inscricoes/page.tsx` | A lista para conciliar com o extrato, com os botões de marcar paga, baixar em Excel e encerrar as inscrições. |
| `components/pages/conferencia/BotaoEncerrarInscricoes.tsx` | O botão que encerra e reabre as inscrições, com o modal de confirmação. |
| `lib/inscricoes-estado.ts` | Se as inscrições estão abertas ou encerradas: a leitura em cache para a página e a leitura direta para a gravação. |
| `app/admin/inscricoes/excel/route.ts` | A planilha em Excel, montada na hora a partir do banco. |
| `lib/xlsx.ts` | Escreve o arquivo `.xlsx`: o XML das células e o zip em volta. |
| `lib/whatsapp.ts` | O aviso de inscrição no WhatsApp, pelo CallMeBot. |
| `utils/mascaras.ts` | A formatação dos campos enquanto a pessoa digita. |
| `prisma/schema.prisma` | Modelo `Inscricao` e os quatro enums. |
| `public/conferencia/` | As cinco fotos e a capa do link, tiradas do mockup. |

O BR Code foi conferido contra os códigos do mockup: para 1, 5 e 8 adultos a
cadeia sai idêntica, caractere por caractere, CRC incluído.

## Onde a página diverge do mockup, de propósito

1. **A frase dos centavos.** O mockup dizia que os 7 centavos são "a sua
   identificação" e que é por eles que a igreja acha o Pix no extrato. Como
   eles são fixos e iguais em toda inscrição, isso não se sustenta: a página e
   o e-mail agora dizem que os centavos marcam que o Pix é da conferência, e
   que a inscrição é encontrada pelo valor e pelo **nome de quem paga**. O
   total, esse sim, aparece completo desde o começo, `R$ 20,07`, como no
   mockup.
2. **A tarja de mockup e a lista do que falta confirmar** não vieram. Aquilo é
   conversa interna.

E uma frase do e-mail do mockup ficou de fora: a que dizia que dá para pagar no
dia, no credenciamento. Isso é o item 5 da lista abaixo, ainda sem resposta.

## Três coisas para a página entrar no ar

1. **Criar a tabela no banco de produção.** No banco local ela já existe,
   criada em 18/10/2026 pelo SQL de `prisma/cria-inscricoes.sql`. Em produção
   ainda não:
   ```
   npx prisma db push
   ```
2. **Pôr a chave Pix no ambiente**: `PIX_KEY` no `.env` local e nas variáveis
   do projeto na Vercel. Enquanto estiver vazia, o formulário recusa a
   inscrição com recado em vez de gerar um código que não paga a igreja. Ver
   `.env.example`.
3. **Ligar a bandeira** `conferencia.active` em `config/index.ts`. Com ela
   desligada a página abre por link, mas não pede indexação ao Google e fica
   fora do sitemap.

Depois disso, o primeiro Pix de teste: inscrever-se, pagar o valor exato e
achar a linha no extrato. **Quem identifica a linha é o nome de quem paga**,
não os centavos, que são iguais em toda inscrição.

## O que a igreja ainda precisa responder

As oito perguntas que estavam na tarja do mockup, ainda sem resposta:

1. O título ajustado da palestra 2, que insere a palavra Gênesis, precisa do
   aval do preletor.
2. O prazo final das inscrições, e se haverá limite de vagas. A página hoje não
   afirma nenhum dos dois.
3. O mini currículo dos dois preletores. O texto atual só diz o que já se sabe:
   a busca não achou currículo de nenhum dos dois.
4. A chave Pix da igreja.
5. Se dá para se inscrever e pagar no dia, no credenciamento, ou se a inscrição
   só vale paga. Nem a página nem o e-mail prometem isso.
6. O que exatamente os R$ 20 cobrem, para a página dizer isso em uma linha.
7. Se o café do intervalo é oferecido pela igreja ou se cada um leva algo.
8. O cronograma do sábado é proposta, e precisa do aval do preletor.

## As duas perguntas de 19/10/2026

O formulário passou a perguntar mais duas coisas, e as duas entram no banco e
na planilha:

1. **Qual é a sua igreja**, um campo de texto que **só aparece** quando a
   pessoa escolhe "De outra igreja" em "Você é". A opção que destrava a
   pergunta está em `CONFERENCE_TIE_ASKS_CHURCH`, e não escrita à mão no
   componente, para o rótulo e o enum do banco não se separarem depois. O
   servidor grava a igreja **somente** nesse vínculo: em qualquer outro a
   coluna fica nula, mesmo que o envio traga texto, porque ali a pergunta não
   foi feita. O nome é limitado a 120 caracteres
   (`CONFERENCE_CHURCH_MAX`) e ganha as iniciais em maiúscula como os outros
   nomes do formulário.
2. **Como você ficou sabendo da conferência**, um seletor com sete respostas
   em `CONFERENCE_SOURCE_CHOICES`: avisos da igreja, convite de alguém,
   Instagram, YouTube, WhatsApp, busca no Google e de outro jeito. Ele **abre
   vazio e é opcional**. Isso é de propósito: uma primeira opção já escolhida
   faria a igreja ler como divulgação o que foi só o padrão da lista. Resposta
   fora da lista é tratada como resposta nenhuma.

Os rótulos aparecem duas vezes, e não é repetição por descuido. No formulário
eles estão na primeira pessoa, que é como se responde ("Alguém me convidou");
na planilha, na terceira, que é como se lê ("Por convite de alguém"). A
tradução mora em `comoSoubeLabel`, em `utils/inscricao.ts`, do mesmo jeito que
`vinculoLabel` já fazia.

**No banco** são a coluna `igreja` (texto, anulável) e a coluna `comoSoube`
(enum `InscricaoComoSoube`, anulável). O SQL está em
`prisma/adiciona-igreja-e-como-soube.sql` e **já foi aplicado** em 19/10/2026
no banco do `DIRECT_URL`. Conferido depois com

```
npx prisma migrate diff --from-url "$DIRECT_URL" --to-schema-datamodel prisma/schema.prisma --script
```

que respondeu migração vazia: o banco e o `schema.prisma` estão iguais. As duas
colunas nascem nulas, então **nenhuma inscrição antiga foi alterada**; elas
aparecem na planilha como célula vazia.

## O botão de encerrar as inscrições

Em `/admin/inscricoes`, ao lado do botão de Excel. Clicar pergunta antes, como
a lixeira da lista, porque um clique aqui muda a página pública.

**O que acontece na página `/conferencia` quando está encerrado:**

| Antes | Depois |
| --- | --- |
| Formulário de inscrição | O recado de `CONFERENCE_CLOSED`, com um botão para `/contato` |
| "Quero me inscrever" no herói | O botão sai; o de agenda fica |
| Barra presa no pé convidando a inscrever | A barra não sobe |
| Palestras, preletores, programação e local | Tudo igual |

A página encolhe de 52,4 KB para 47,7 KB, que é o formulário saindo.

**A gravação também fecha.** Quem deixou a página aberta antes do clique, ou
quem monta o envio à mão, recebe "As inscrições estão encerradas. Fale com a
igreja se ainda quiser participar." e **nada é gravado**. Isso foi testado
disparando a server action direto, com o estado encerrado: resposta de recusa e
zero linhas no banco.

**Reabrir é o mesmo botão.** Nenhuma inscrição já gravada é tocada por nenhum
dos dois sentidos.

**O texto não promete vaga** e não diz que dá para pagar no dia: nenhuma das
duas coisas foi decidida pela igreja (é o item 5 da lista acima), e uma página
que promete o que ninguém prometeu cria discussão na porta no sábado.

### Onde o estado mora, e por que não é bandeira de código

Na coluna `conferenciaEncerrada` da tabela `GlobalSettings`. Não é bandeira em
`config/index.ts` porque bandeira exige deploy, e no dia em que a igreja
decidir fechar ninguém vai querer depender disso. O SQL está em
`prisma/encerra-inscricoes.sql` e já foi aplicado em 19/10/2026.

### O cache, que é a parte que engana

A página `/conferencia` continua **estática** (o build a marca com `○`), então
quem a serve é a borda da Vercel e não o servidor. Para isso o estado é lido
através de `unstable_cache`. Daí três comportamentos que convém ter escritos:

1. **O botão derruba o cache na hora.** Ele chama `updateTag` e
   `revalidatePath`, então o encerramento aparece imediatamente, e a própria
   tela do admin já volta com o estado novo.
2. **O cache tem prazo de 60 segundos**, e isso não é para o botão. Este cache
   **sobrevive ao build** e é restaurado entre deploys: sem prazo, um deploy
   feito depois do encerramento poderia republicar a página com o formulário
   aberto. Isso foi reproduzido de propósito aqui antes do prazo existir, e
   deixou de acontecer com ele.
3. **Mudar a coluna direto no banco** não aparece na hora, e sim em até 60
   segundos, porque o caminho previsto é o botão.

A tela do admin, ao contrário da página pública, lê **sempre direto do banco**,
sem cache: é a tela de controle, e ela tem de mostrar o que vale agora.

### Se faltar GLOBAL_CONFIG_ID

A coluna vive na linha de `GlobalSettings` apontada por `GLOBAL_CONFIG_ID`. Sem
essa variável no ambiente, o botão responde que falta configuração, e a leitura
trata as inscrições como **abertas**: é ausência de configuração, não falha
momentânea, e recusar toda inscrição por causa dela seria pior.

## A planilha em Excel

No admin há um botão **Baixar em Excel**. Ele aponta para
`/admin/inscricoes/excel`, que lê o banco naquele instante e devolve um arquivo
`.xlsx`. Não existe planilha guardada em lugar nenhum: o que a igreja baixa é
sempre o estado de agora, e por isso não há o que sincronizar nem reenviar.

**São 17 colunas, com tudo o que a inscrição tem:** número, recebida em, nome,
e-mail, WhatsApp, adultos, crianças, pessoas, dias, de onde vem, qual igreja,
como ficou sabendo, quem paga o Pix, valor, identificador do Pix, situação e
paga em.

As duas colunas novas ficam **vazias** quando a pergunta não foi feita (a
igreja, para quem não é de outra igreja) ou não foi respondida (como ficou
sabendo, que é opcional). Vazio é informação: escrever "Não informado" seria
registrar como resposta o que ninguém disse.

A rota exige sessão. Rota de arquivo não passa pelo layout do admin, então ela
confere por conta própria quem está logado; sem sessão responde 401.

**Por que .xlsx e não .csv.** No `.csv` o Excel adivinha o que é cada coluna, e
erra: "R$ 20,07" vira texto, data vira data americana e telefone perde o zero
da frente. Aqui cada coluna declara o que é, então a data chega data, o valor
chega dinheiro que soma, e o telefone chega texto, com o zero. O cabeçalho vem
congelado e com filtro, para ordenar sem configurar nada.

**Nenhuma biblioteca nova entrou no projeto por causa disto.** Um `.xlsx` é um
`.zip` com alguns XML dentro, e `lib/xlsx.ts` monta os dois. O arquivo foi
conferido abrindo-o no LibreOffice: os acentos, os sinais `&` e `<>`, o fuso de
Brasília, o zero à esquerda do telefone e a coluna de dinheiro saem certos.

**Esta planilha leva nome, e-mail e telefone de quem se inscreveu.** Ela é
dado pessoal: fica com quem precisa dela, não vai para grupo de WhatsApp, e se
apaga depois do evento, que é o que a política de privacidade do site promete.

A rota de planilha no Google Drive foi abandonada em 18/10/2026 e o código
saiu. Sobrou a coluna `planilhaEm` no banco, que ninguém lê nem escreve, porque
apagar coluna é destrutivo. O `PLANILHA-APPS-SCRIPT.js`, em
`~/Documentos/igreja/conferencia/`, não serve mais para nada.

## O aviso no WhatsApp

Quando uma inscrição chega, sai um aviso no WhatsApp da igreja. Quem entrega é
o **CallMeBot**: o número é autorizado uma vez, conversando com o bot, que
responde com uma chave. Daí para a frente é uma chamada GET. Não há conta da
Meta, número de empresa nem modelo de mensagem aprovado no meio, e é por isso
que serve aqui: **é aviso interno, não canal de atendimento**. Ninguém
responde a essa mensagem.

**Ligado em 18/10/2026 para um número.** Para avisar dois celulares, vírgula
nas duas variáveis, na mesma ordem: cada número tem a sua própria chave.

```
WHATSAPP_ALERT_PHONE=556100000000,556111111111
WHATSAPP_ALERT_APIKEY=111111,222222
```

Com as duas vazias nenhum aviso sai e a inscrição funciona igual. Se as listas
tiverem tamanhos diferentes, nada é enviado e o erro aparece no log: é melhor
não avisar do que avisar o número errado.

**O aviso é cópia, o banco é o original.** Nada aqui lança erro, e o CallMeBot
fora do ar não derruba inscrição de ninguém.

**O que vai na mensagem:** número, nome, quantas pessoas, dias, de onde vem
(com o nome da igreja, quando é de outra igreja), como ficou sabendo da
conferência, se respondeu, e o valor, mais o endereço do admin. **E-mail e telefone de quem se inscreveu não
vão.** WhatsApp é tela de bloqueio, prévia de notificação e aparelho
emprestado; esses dados ficam atrás do login do admin, que é onde eles já
estão. O aviso serve para decidir se vale olhar, não para carregar o cadastro.

## O que ainda não foi construído

- **O lembrete da véspera.** Depende de duas decisões que não são técnicas:
  quando ele sai e o que ele diz. O campo `lembreteEm` já existe no banco para
  não enviar duas vezes.
- **Dados estruturados de evento** (`Event` em JSON-LD), que fazem a data e o
  local aparecerem direto na busca do Google.
- **Logo no topo do e-mail.** Falta um PNG claro: em `public/logo` só há PNG
  na versão navy, que desapareceria no fundo navy do cabeçalho.

## Como o pagamento é conferido

Não há intermediário e ninguém avisa que o Pix caiu. A inscrição nasce
`AGUARDANDO`, e a igreja marca `PAGA` na lista do admin olhando o extrato.

A chave para achar a linha é o **nome de quem paga**, e é por isso que o
formulário pergunta por ele quando o Pix sai da conta de outra pessoa. O valor
ajuda a separar inscrições de tamanhos diferentes (R$ 20,07, R$ 40,07, R$
60,07), e o `txid` com o número da inscrição viaja dentro do BR Code, mas nem
todo banco o mostra a quem recebe. Nenhum dos dois substitui o nome.
