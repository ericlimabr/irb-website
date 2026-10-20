# Contraste do texto: o que foi medido, o que foi corrigido, o que ficou aberto

Medido em 20/10/2026, na página `/conferencia` e nos tokens de cor do site.

## Glossário

| Termo | O que quer dizer aqui |
|---|---|
| Razão de contraste | Quanto um texto se separa do fundo, de 1:1 (invisível) a 21:1 (preto no branco). Sai de uma fórmula da WCAG sobre a luminância das duas cores. |
| WCAG AA | O nível de acessibilidade que a web toma como mínimo. Pede **4,5:1** para texto normal e **3:1** para texto grande. |
| Texto grande | 24px ou mais, ou 18,7px em negrito. Títulos entram aqui; rótulo de 11px não. |
| Token de cor | Variável de CSS com a cor, usada em vários lugares. Mudar o token muda tudo que o usa. |
| Especificidade | O peso de um seletor de CSS. Entre duas regras que pintam o mesmo elemento, vence a de maior peso; no empate, vence a última do arquivo. |
| Luz (lightness) | O terceiro número do `hsl()`. Baixar a luz escurece a cor sem mudar o matiz. |

## O que estava errado, e por quê

**Os dois títulos invisíveis.** `.conf .palestras h2` e `.conf h2.titulo` têm a
mesma especificidade: duas classes e um elemento cada. No empate vence a última
regra do arquivo, e o `.titulo` foi escrito depois. Resultado: azul-marinho
sobre azul-marinho, **1,15:1** nas palestras e **1,25:1** em "Quem pode vir",
contra os 3:1 que o mínimo pede. As regras novas levam três classes, então
vencem por peso e não dependem de ordem nenhuma.

**A introdução das palestras**, 2,70:1, chegava ao mesmo lugar por outro
caminho: regra própria com o cinza de texto, aplicada em cima de fundo escuro.

**Os dois tokens de letra pequena.** `gold-600` dava 3,34:1 e `txt3` 3,74:1 em
fundo claro, abaixo dos 4,5:1. Os dois carregam letra de 11px: os olhos de
seção, as horas da programação, o cargo dos preletores, as notas de rodapé, a
nota de privacidade embaixo do formulário.

## Como ficou

| Onde | Antes | Depois |
|---|---|---|
| Título "O que vai ser ensinado" | 1,15:1 | 18,08:1 |
| Título "Quem pode vir" | 1,25:1 | 19,61:1 |
| Introdução das palestras | 2,70:1 | 12,28:1 |
| Olho de seção em fundo claro | 3,34:1 | 4,87:1 |
| Cargo do preletor, hora da programação | 3,43:1 | 5,01:1 |
| Link da nota de privacidade | 3,64:1 | 5,32:1 |
| Duração, mês, nota do pagamento | 3,74:1 | 4,65:1 |
| Rodapé da citação, nota de dados | 3,98:1 | 4,94:1 |
| Ponto separador do herói | 3,14:1 | 6,24:1 |

As cores mudaram só de luz: `--gold-600` de 45% para 36%, `--txt3` de 50% para
44%. Matiz e saturação são os mesmos, então é a mesma cor, mais fechada.

`--gold-600` é o dourado de texto do site inteiro, `text-gold-600`, 24 usos,
todos em rótulo pequeno sobre fundo claro. Por isso foi corrigido também em
`app/globals.css`. O único lugar onde ele é **fundo** é o hover do botão
"accent", em `components/layout/Cards.tsx`: lá o texto passou a branco, porque
o azul-marinho sobre o dourado fechado cai para 2,94:1 e o branco sobe para
5,32:1.

## O que ficou aberto, e precisa de decisão

**`text-gold-500` sobre fundo claro: 73 usos, 2,36:1.** É o dourado mais claro,
usado como realce dentro de títulos (`<em>Igreja Reformada</em>` na home, por
exemplo) e no horário dos cultos na agenda. Mesmo contando como texto grande,
2,36:1 não alcança os 3:1 do mínimo.

Não mexi porque isto não é defeito de implementação, é escolha de marca: esse
dourado claro é o realce da identidade visual em toda página. A correção
natural é trocar `text-gold-500` por `text-gold-600` **onde o fundo é claro**,
mantendo o claro onde o fundo é escuro, que é o que o próprio código já faz em
`app/campanha/venha-nos-visitar/page.tsx:127`. São 73 ocorrências e cada uma
precisa da conferência do fundo, uma por uma.

**Hover que clareia em fundo claro.** `text-gold-600 hover:text-gold-500`
aparece em `components/layout/Cards.tsx`. Em fundo claro, clarear no hover
derruba o contraste justo quando a pessoa está mirando o link. Mesma decisão de
desenho da anterior.

**`--text-tertiary: hsl(0 0% 50%)` em `app/globals.css` está defasado** em
relação ao `--txt3` da conferência, que foi para 44%. Não mexi porque nada o
usa hoje: nenhum `.tsx` e nenhum `.css` o referenciam. Se um dia for usado,
nasce com 3,98:1.

**`.conf .fotos-local .ph`, 4,50:1**, fica a um centésimo do mínimo. É CSS
morto: nenhuma marcação usa a classe `ph`, que era o lugar das fotos no mockup
antes de as fotos existirem.
