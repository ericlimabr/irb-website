# Agendar a visita · "adicionar o próximo domingo à agenda"

Especificação de uma melhoria da landing page da campanha
(`app/campanha/venha-nos-visitar/page.tsx`). **Ainda não implementada** · este
documento registra o desenho acordado para quando for construir.

## O que é

Um botão **"Agendar minha visita"** que adiciona o culto **na agenda da própria
pessoa** (Google Agenda / Apple / Outlook), sempre marcado para o **próximo
domingo**, com o endereço embutido no evento.

Num toque, a pessoa fica *agendada*, *com lembrete* e *com a localização* (o
app de calendário transforma o endereço num link de mapa). Não é um RSVP: a
igreja **não** recebe nada, não há formulário, backend nem dado pessoal
coletado (portanto sem implicação de LGPD).

## Por que faz sentido

O maior vazamento numa visita de tráfego frio não é falta de informação, é a
intenção morna ("quis ir e esqueci / amarelei"). Um lembrete no domingo de
manhã ataca justamente isso · é um micro-compromisso de custo zero. Fica como
CTA **secundário**, ao lado de "Como chegar", sem substituí-lo.

## Como funciona

### 1. Calcular "o próximo domingo" no navegador

A LP é estática (gerada no build). Calcular a data no servidor a **congelaria**
na data do deploy. Então o botão precisa ser um **componente client**
(`"use client"`) que calcula na hora, no navegador:

- Dias até o próximo domingo: `(7 - hoje.getDay()) % 7`.
- Horário: **09h** (Culto Matutino, `MORNING_LITURGY_TIME`), o mais forte da
  janela da campanha.
- **Fuso:** horário de Brasília é **UTC−3 fixo** (o Brasil extinguiu o horário
  de verão em 2019), então 09h local = 12h UTC. Não precisa de `VTIMEZONE`.
- **Caso de borda a decidir:** se hoje já é domingo, "próximo domingo" é hoje ou
  daqui a 7 dias? Regra sugerida: se ainda não passou das 09h, é hoje; senão,
  +7.

### 2. Dois destinos de calendário

Não existe botão único universal · cada ecossistema tem seu formato. O padrão é
oferecer os dois:

- **Google Agenda** · um **link** pré-preenchido, sem arquivo:
  ```
  https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=Culto · Igreja Reformada de Brasília
    &dates=AAAAMMDDT120000Z/AAAAMMDDT140000Z
    &location=<endereço>
    &details=<boas-vindas + link>
  ```
  Abre o app/web já preenchido; a pessoa toca em salvar. Cobre Android e
  desktop.

- **Apple / Outlook** · um arquivo **`.ics`** (formato iCalendar). No iPhone,
  tocar no `.ics` abre o Calendário para adicionar. Cobre iOS.

### 3. Conteúdo do evento (`VEVENT`)

| Campo | Valor |
|---|---|
| `SUMMARY` | `Culto · Igreja Reformada de Brasília` |
| `DTSTART` / `DTEND` | próximo domingo, 09h → 11h (duração a definir) |
| `LOCATION` | `CHURCH_ADDRESS_FULL` · **é isto que entrega a localização** (vira link de mapa no app) |
| `DESCRIPTION` | linha de boas-vindas + link do site / WhatsApp |
| `UID`, `DTSTAMP` | exigidos pelo formato |

### 4. A entrega do `.ics` (única parte com pegadinha)

- **A) Gerar no navegador** · o componente monta o texto e entrega como
  `Blob` / `data:text/calendar`. Zero backend. Bom em Android/desktop; **no iOS
  Safari o download de `data:` às vezes falha**.
- **B) Rota `.ics` dinâmica** (ex.: `app/campanha/culto.ics/route.ts`) que
  devolve o arquivo com o próximo domingo calculado **por requisição**. Mais
  robusto no iPhone (arquivo servido de verdade) e a data fica sempre certa.
  Custo: endpoint dinâmico, sem cache.

**Recomendação:** link do Google Agenda (maioria) **+** `.ics` pela rota B (para
o iOS não falhar).

## Medição (opcional, independente)

No clique, empurrar `schedule_visit` no dataLayer → a GTM dispara o evento
**`Schedule`** do Meta (o item "futuro" já previsto em
[`analytics-stack.md`](./analytics-stack.md)). Vira sinal de alta intenção e
público de remarketing. Opcional: o calendário funciona sem isso.

## Decisões em aberto

- Entrega do `.ics` no iOS: gerar no navegador (A) vs. rota servida (B).
- Caso de borda "hoje é domingo".
- Duração do evento no calendário (09h → 11h? só início?).
- Disparar ou não o `Schedule` do Meta já na primeira versão.

## Fora de escopo (deliberadamente)

RSVP em que a **igreja recebe** o agendamento · exigiria formulário + backend +
acompanhamento + LGPD, e adicionaria atrito que derruba conversão em campanha de
tráfego frio. Se um dia for desejado, é outro desenho.
