# A isca de robô, e por que ela deixou de recusar

Escrito em 20/10/2026, depois de a isca barrar pessoas de verdade duas vezes no
mesmo dia. Este documento existe para que ninguém, inclusive eu, volte a ligar
a recusa sem ler a história.

## Glossário

| Termo                    | O que é                                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Isca de robô             | Campo escondido no formulário que pessoa nenhuma vê. A ideia é que só programa preenche campo invisível, então campo preenchido denuncia o programa. O nome em inglês é honeypot. |
| Preenchimento automático | O serviço do navegador ou do celular que completa formulário sozinho, com os dados que ele guardou de você.                                                                       |
| Gerenciador de senha     | Programa que guarda seus acessos e preenche formulário, como o do Google, o do iPhone, 1Password, LastPass, Bitwarden.                                                            |
| `autocomplete="off"`     | Pedido ao navegador para não preencher aquele campo. É pedido, não ordem: navegador e gerenciador de senha ignoram quando acham que sabem melhor.                                 |
| Atributo de opt-out      | Marca que cada gerenciador de senha documenta para ser ignorado naquele campo, como `data-1p-ignore` e `data-lpignore`. Também é pedido.                                          |
| `display: none`          | Instrução de CSS que faz o elemento não ser desenhado. Diferente de empurrar para fora da tela: o que está fora da tela continua existindo e sendo um campo de verdade.           |
| Caixa de marcar          | O campo quadradinho de marcar e desmarcar, `checkbox`. Preenchimento automático escreve texto; não marca caixa.                                                                   |
| Falso positivo           | Quando a defesa acusa quem é inocente. Aqui: pessoa tratada como robô.                                                                                                            |
| Limite por e-mail        | A defesa que ficou de pé: conta quantas inscrições aquele e-mail fez na última hora e recusa a partir do limite. Conta linha no banco, não chuta.                                 |

## O que aconteceu, na ordem

**Primeira falha.** O campo se chamava `website`, era campo de texto e ficava
escondido fora da tela, em `left: -9999px`. Gerenciador de senha e
preenchimento automático reconhecem os nomes `website`, `url` e `site` e
completam sozinhos, mesmo escondido e mesmo com `autocomplete="off"`. Resultado:
a pessoa era tratada como robô e não conseguia se inscrever de jeito nenhum,
sempre com a mesma mensagem, por mais que tentasse.

**O primeiro conserto, que não bastou.** Trocamos o nome por
`confirmacao_de_envio`, que nenhum desses programas conhece, e pusemos todos os
atributos de opt-out documentados. Também passamos a registrar a ocorrência no
log e a avisar no WhatsApp, e a oferecer à pessoa a saída pelo WhatsApp da
igreja em vez de uma parede.

**Segunda falha, no mesmo dia.** Duas tentativas, às 16:54 e às 16:55 do dia
20/10/2026, as duas pelo celular, as duas recusadas. O log pegou e o aviso
chegou, o que prova que a parte nova funcionou. Mas o preenchimento automático
do telefone achou o campo outra vez, agora sem conhecer o nome dele: ele se
guia também pelo formato e pela posição do campo no formulário, e o nosso era
um campo de texto, o primeiro do formulário.

## A conclusão

A isca é um palpite. Ela não tem como saber se quem preencheu foi programa ou
foi o telefone da pessoa preenchendo por ela, e as duas falhas mostraram que
esse palpite erra com gente de verdade, do lado que mais dói.

Pesando os dois erros possíveis:

- **Falso positivo:** uma irmã não consegue se inscrever na conferência e
  desiste. Ninguém fica sabendo, a não ser que ela avise alguém.
- **Falso negativo:** entra uma linha de inscrição que é de robô. Ela nasce
  AGUARDANDO, ninguém paga, a igreja não dá baixa, e a linha fica lá.

O segundo é barato. O primeiro não tem preço. **Então a isca deixou de
recusar.**

## Como ficou

1. **A isca é sinal, não parede.** Se vier marcada, a inscrição ou a mensagem
   segue em frente normalmente, e fica uma linha de nível Aviso no log, com o
   código `ISCA_MARCADA`, pedindo para a igreja conferir se aquilo é de gente.
   No formulário de contato isso é um ganho a mais: antes a pessoa via
   "enviado" e a mensagem não chegava a ninguém.
2. **Quem defende de robô é o limite por e-mail**, que conta linhas no banco em
   vez de chutar.
3. **O campo virou caixa de marcar**, porque preenchimento automático escreve
   texto e não marca caixa.
4. **O campo é escondido com `display: none`**, e não empurrado para fora da
   tela, porque campo que não é desenhado não entra no preenchimento
   automático, enquanto campo fora da tela continua sendo um campo de verdade.

Os itens 3 e 4 são duas razões independentes para nenhum preenchimento
automático encostar na isca. E se as duas falharem, ninguém fica de fora: o
pior que acontece é uma linha de aviso no log.

## Se alguém quiser ligar a recusa de novo

Não ligue sem trocar o palpite por prova. O que serviria, em ordem de
preferência:

1. Olhar o tempo entre abrir o formulário e enviar. Robô envia em menos de dois
   segundos; pessoa não preenche nome, WhatsApp e e-mail nesse tempo. É medida,
   não chute, e não depende de palpite sobre o navegador.
2. Recusar só quando houver dois sinais ao mesmo tempo, por exemplo isca marcada
   **e** envio em menos de dois segundos.
3. Nunca recusar sem oferecer caminho de saída na mesma tela, porque a pessoa
   que apanha de uma defesa não sabe que existe defesa nenhuma.

## Arquivos

| Arquivo                                          | O que tem                                                       |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `const/isca.ts`                                  | O nome do campo, os atributos de opt-out e a história resumida. |
| `app/actions/inscricao.ts`                       | O trecho da isca na inscrição, que registra e segue em frente.  |
| `app/actions/contact.ts`                         | O mesmo no formulário de contato.                               |
| `components/pages/conferencia/InscricaoForm.tsx` | A caixa escondida no formulário de inscrição.                   |
| `components/features/contact/ContactForm.tsx`    | A caixa escondida no formulário de contato.                     |
| `app/conferencia/conferencia.css`                | A classe `.isca`, agora `display: none`.                        |
| `docs/log-de-erros.md`                           | O log de falhas, o aviso no WhatsApp e a tabela de códigos.     |
