"use client"

import { useRef, useState, useTransition } from "react"
import { submitInscricao, type InscricaoResult } from "@/app/actions/inscricao"
import {
  CONFERENCE_CHURCH_MAX,
  CONFERENCE_DAY_CHOICES,
  CONFERENCE_MAX_ADULTS,
  CONFERENCE_MAX_CHILDREN,
  CONFERENCE_SOURCE_CHOICES,
  CONFERENCE_TIE_ASKS_CHURCH,
  CONFERENCE_TIE_CHOICES,
  ISCA_ATRIBUTOS,
  ISCA_CAMPO,
} from "@/const"
import { pessoasContagem } from "@/utils/inscricao"
import {
  arrumaNome,
  mascaraEmail,
  mascaraNome,
  telefoneDigitado,
} from "@/utils/mascaras"
import { trackEvent } from "@/utils/analytics"
import { whatsappLink } from "@/utils/whatsapp"

/**
 * O formulário do mockup, agora ligado no servidor.
 *
 * A marcação e as classes são as do mockup (`.campo`, `.dois`, `.escolhas`,
 * `.conta-total`, `#recibo`), e o CSS é o de app/conferencia/conferencia.css.
 * O que mudou é só o que não dava para o mockup ter: o envio de verdade, o
 * erro na tela e o botão que trava depois de enviar, para ninguém se inscrever
 * duas vezes no mesmo clique duplo.
 *
 * Desde 05/11/2026, por decisão dele, este formulário não fala de valor, de
 * taxa nem de Pix: saíram o total na tela, a pergunta sobre de quem sai o Pix,
 * o nome do pagador e o QR do fim. O que entrou no lugar do Pix é a
 * confirmação com o número da inscrição.
 *
 * O servidor NÃO mudou: ele continua calculando o valor, gerando o código e
 * mandando o e-mail de confirmação com ele. As classes `.conta-total`,
 * `.pg-valor`, `.pg-qr` e `.pg-copia` ficaram no CSS, e `.pg-valor` passou a
 * vestir o número da inscrição, que é o que a caixa mostra agora.
 *
 * Os campos de texto se formatam enquanto a pessoa digita: o telefone ganha
 * parêntese e traço, o e-mail desce para minúscula e os três nomes (o da
 * pessoa, o de quem paga e o da igreja) ganham as iniciais em maiúscula. As
 * regras estão em utils/mascaras.ts, e nenhuma delas recusa o que foi
 * digitado: formatar não é validar, e quem valida é o servidor.
 */

function Escolhas({
  opcoes,
  valor,
  onEscolher,
}: {
  opcoes: readonly { value: string; label: string }[]
  valor: string
  onEscolher: (v: string) => void
}) {
  return (
    <div className="escolhas">
      {opcoes.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={valor === o.value}
          className={valor === o.value ? "on" : undefined}
          onClick={() => onEscolher(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function InscricaoForm() {
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [adultos, setAdultos] = useState(1)
  const [criancas, setCriancas] = useState(0)
  const [dias, setDias] = useState<string>(CONFERENCE_DAY_CHOICES[0].value)
  const [vinculo, setVinculo] = useState<string>(
    CONFERENCE_TIE_CHOICES[0].value,
  )
  const [igreja, setIgreja] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  // Quando o servidor recusa por motivo que não é culpa de quem preencheu, a
  // mensagem vem acompanhada do caminho de saída: o WhatsApp da igreja.
  const [saidaNoWhatsapp, setSaidaNoWhatsapp] = useState(false)
  const [recibo, setRecibo] = useState<Extract<
    InscricaoResult,
    { success: true }
  > | null>(null)
  const [enviando, iniciar] = useTransition()
  const caixaRecibo = useRef<HTMLDivElement>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set("dias", dias)
    setErro(null)
    setSaidaNoWhatsapp(false)
    iniciar(async () => {
      const r = await submitInscricao(formData)
      if (r.success) {
        setRecibo(r)
        // Só depois do aceite do servidor: o trigger nativo de envio da GTM
        // conta também a tentativa que o servidor recusou.
        trackEvent({
          event: "conferencia_inscricao",
          // O valor vem do servidor, que é quem ainda faz essa conta. A tela
          // não o mostra em lugar nenhum; o contrato da GTM continua o mesmo.
          valor: r.valor / 100,
          // Mesmo identificador que o servidor usou no envio dele ao Meta: é
          // o que junta os dois num evento só.
          event_id: r.eventId,
        })
        setTimeout(
          () =>
            caixaRecibo.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            }),
          60,
        )
      } else {
        setErro(r.error)
        setSaidaNoWhatsapp(!!r.falarComAIgreja)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} aria-busy={enviando}>
      {/*
        Isca de robô: caixa de marcar escondida com `display: none`. Ser caixa
        e não ser desenhada são as duas razões independentes para nenhum
        preenchimento automático encostar nela. Ela não recusa nada, só deixa
        aviso no log. const/isca.ts conta por que ficou assim.
      */}
      <input
        type="checkbox"
        name={ISCA_CAMPO}
        className="isca"
        {...ISCA_ATRIBUTOS}
      />

      <div className="campo">
        <label htmlFor="nome">Seu nome completo</label>
        <input
          id="nome"
          name="nome"
          required
          autoComplete="name"
          placeholder="Como você quer ser chamado no crachá"
          value={nome}
          onChange={(e) => setNome(mascaraNome(e.target.value))}
          onBlur={() => setNome((n) => arrumaNome(n))}
        />
      </div>

      <div className="dois">
        <div className="campo">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            name="whatsapp"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="(61) 9 0000-0000"
            value={whatsapp}
            onChange={(e) => {
              const campo = e.currentTarget
              const { valor, cursor } = telefoneDigitado(
                whatsapp,
                campo.value,
                campo.selectionStart ?? campo.value.length,
              )
              setWhatsapp(valor)
              // O React repinta depois deste evento, e é só aí que o cursor
              // pode ser recolocado: antes disso o campo ainda tem o texto
              // velho na tela.
              requestAnimationFrame(() =>
                campo.setSelectionRange(cursor, cursor),
              )
            }}
          />
        </div>
        <div className="campo">
          <label htmlFor="email">E-mail, onde chega a confirmação</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="seunome@email.com"
            value={email}
            onChange={(e) => {
              const campo = e.currentTarget
              // Em <input type="email"> o navegador não dá nem deixa mexer no
              // cursor: selectionStart vem nulo e setSelectionRange lança erro.
              const caret = campo.selectionStart
              const valor = mascaraEmail(campo.value)
              const encurtou = valor.length - campo.value.length
              setEmail(valor)
              // Só precisa de conserto quando um espaço saiu do meio: aí o
              // texto encurta e o cursor tem que andar junto.
              if (caret !== null && encurtou !== 0) {
                const novo = caret + encurtou
                requestAnimationFrame(() => campo.setSelectionRange(novo, novo))
              }
            }}
          />
        </div>
      </div>

      <div className="dois">
        <div className="campo">
          <label htmlFor="adultos">Adultos, 12 anos ou mais</label>
          <select
            id="adultos"
            name="adultos"
            value={adultos}
            onChange={(e) => setAdultos(Number(e.target.value))}
          >
            {Array.from({ length: CONFERENCE_MAX_ADULTS }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n} {n > 1 ? "adultos" : "adulto"}
                </option>
              ),
            )}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="criancas">Crianças, até 11 anos</label>
          <select
            id="criancas"
            name="criancas"
            value={criancas}
            onChange={(e) => setCriancas(Number(e.target.value))}
          >
            <option value={0}>Nenhuma</option>
            {Array.from(
              { length: CONFERENCE_MAX_CHILDREN },
              (_, i) => i + 1,
            ).map((n) => (
              <option key={n} value={n}>
                {n === CONFERENCE_MAX_CHILDREN
                  ? `${n} ou mais`
                  : `${n} ${n > 1 ? "crianças" : "criança"}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="campo">
        <label htmlFor="vinculo">Você é</label>
        <select
          id="vinculo"
          name="vinculo"
          value={vinculo}
          onChange={(e) => setVinculo(e.target.value)}
        >
          {CONFERENCE_TIE_CHOICES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {vinculo === CONFERENCE_TIE_ASKS_CHURCH && (
        <div className="campo">
          <label htmlFor="igreja">Qual é a sua igreja</label>
          <input
            id="igreja"
            name="igreja"
            required
            maxLength={CONFERENCE_CHURCH_MAX}
            placeholder="O nome da igreja, e a cidade se não for em Brasília"
            value={igreja}
            onChange={(e) => setIgreja(mascaraNome(e.target.value))}
            onBlur={() => setIgreja((n) => arrumaNome(n))}
          />
        </div>
      )}

      <div className="campo">
        <label htmlFor="comoSoube">
          Como você ficou sabendo da conferência
        </label>
        <select id="comoSoube" name="comoSoube" defaultValue="">
          {/* Abre vazio de propósito: a pergunta é opcional, e uma primeira
              opção já escolhida contaria como divulgação o que ninguém disse. */}
          <option value="">Escolha uma opção, se quiser</option>
          {CONFERENCE_SOURCE_CHOICES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label>Em quais dias você pretende vir</label>
        <Escolhas
          opcoes={CONFERENCE_DAY_CHOICES}
          valor={dias}
          onEscolher={setDias}
        />
      </div>

      <button
        className="bt"
        type="submit"
        disabled={enviando || recibo !== null}
        style={{ width: "100%", padding: 19 }}
      >
        {enviando && <span className="girando" data-round aria-hidden="true" />}
        {recibo
          ? "Inscrição enviada"
          : enviando
            ? "Enviando a sua inscrição…"
            : "Confirmar a minha inscrição"}
      </button>

      {/*
        O aviso de espera. Fica sempre no documento, e só ganha texto durante o
        envio: região de aviso que nasce na hora costuma não ser lida em voz
        alta, e vazia ela não ocupa espaço nenhum (.aguarde:empty).
      */}
      <p className="aguarde" role="status" aria-live="polite">
        {enviando
          ? "Isso leva alguns segundos. Estamos gravando a sua inscrição e enviando a confirmação para o seu e-mail. Não feche a página nem clique de novo."
          : null}
      </p>

      {erro && (
        <p className="erro" role="alert">
          {erro}
          {saidaNoWhatsapp && (
            <>
              {" "}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com a igreja no WhatsApp
              </a>
              .
            </>
          )}
        </p>
      )}

      <p className="nota-dado">
        Seus dados são usados só para falar com você sobre esta conferência, e
        não são passados a ninguém.{" "}
        <a href="/politica-de-privacidade">Política de privacidade</a>.
      </p>

      <div id="recibo" className={recibo ? "on" : undefined} ref={caixaRecibo}>
        {recibo && (
          <>
            <p className="olho">Inscrição confirmada</p>
            <h3 className="pg-valor">nº {recibo.numero}</h3>
            <p className="pg-txt">
              {pessoasContagem(adultos, criancas)}, {recibo.dias.toLowerCase()}.
              O seu lugar está guardado.
            </p>
            <p className="pg-nota">
              {recibo.emailEnviado
                ? "Mandamos a confirmação para o seu e-mail."
                : "Não conseguimos enviar o e-mail agora, então guarde o número desta inscrição."}{" "}
              Na chegada, diga o seu nome no credenciamento.
            </p>
          </>
        )}
      </div>
    </form>
  )
}
