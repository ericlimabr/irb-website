"use client"

import { useRef, useState, useTransition } from "react"
import { submitInscricao, type InscricaoResult } from "@/app/actions/inscricao"
import {
  CONFERENCE_DAY_CHOICES,
  CONFERENCE_MAX_ADULTS,
  CONFERENCE_MAX_CHILDREN,
  CONFERENCE_PRICE_LABEL,
  CONFERENCE_TIE_CHOICES,
} from "@/const"
import { brl, inscricaoTotalCents, pessoasLabel } from "@/utils/inscricao"
import {
  arrumaNome,
  mascaraEmail,
  mascaraNome,
  telefoneDigitado,
} from "@/utils/mascaras"

/**
 * O formulário do mockup, agora ligado no servidor.
 *
 * A marcação e as classes são as do mockup (`.campo`, `.dois`, `.escolhas`,
 * `.conta-total`, `#recibo`), e o CSS é o de app/conferencia/conferencia.css.
 * O que mudou é só o que não dava para o mockup ter: o envio de verdade, o
 * erro na tela e o botão que trava depois de enviar, para ninguém se inscrever
 * duas vezes no mesmo clique duplo.
 *
 * Os 7 centavos já entram no total desde o começo, porque são fixos. O texto
 * NÃO diz que eles identificam a pessoa: quem identifica no extrato é o nome
 * de quem paga.
 *
 * Os quatro campos de texto se formatam enquanto a pessoa digita: o telefone
 * ganha parêntese e traço, o nome ganha as iniciais em maiúscula e o e-mail
 * desce para minúscula. As regras estão em utils/mascaras.ts, e nenhuma delas
 * recusa o que foi digitado: formatar não é validar, e quem valida é o
 * servidor.
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
  const [pagador, setPagador] = useState("")
  const [adultos, setAdultos] = useState(1)
  const [criancas, setCriancas] = useState(0)
  const [dias, setDias] = useState<string>(CONFERENCE_DAY_CHOICES[0].value)
  const [proprio, setProprio] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [recibo, setRecibo] = useState<Extract<
    InscricaoResult,
    { success: true }
  > | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [enviando, iniciar] = useTransition()
  const caixaRecibo = useRef<HTMLDivElement>(null)

  const total = inscricaoTotalCents(adultos)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set("dias", dias)
    setErro(null)
    iniciar(async () => {
      const r = await submitInscricao(formData)
      if (r.success) {
        setRecibo(r)
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
      }
    })
  }

  async function copiar() {
    if (!recibo) return
    try {
      await navigator.clipboard.writeText(recibo.brCode)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setErro("Não deu para copiar daqui. Selecione o código acima.")
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Isca de robô: fora da vista e fora da ordem de tabulação. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="isca"
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
          <label htmlFor="adultos">
            Adultos, 12 anos ou mais, {CONFERENCE_PRICE_LABEL} cada
          </label>
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
          <label htmlFor="criancas">Crianças, até 11 anos, não pagam</label>
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
        <select id="vinculo" name="vinculo">
          {CONFERENCE_TIE_CHOICES.map((o) => (
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

      <div className="campo">
        <label>O Pix vai sair da sua própria conta</label>
        <Escolhas
          opcoes={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não, de outra pessoa" },
          ]}
          valor={proprio ? "sim" : "nao"}
          onEscolher={(v) => setProprio(v === "sim")}
        />
      </div>

      {!proprio && (
        <div className="campo">
          <label htmlFor="pagador">Nome de quem vai fazer o Pix</label>
          <input
            id="pagador"
            name="pagador"
            autoComplete="name"
            placeholder="É por esse nome que encontramos o pagamento no extrato"
            value={pagador}
            onChange={(e) => setPagador(mascaraNome(e.target.value))}
            onBlur={() => setPagador((n) => arrumaNome(n))}
          />
        </div>
      )}

      <div className="conta-total">
        <div>
          <p className="rot">Total da inscrição</p>
          <p className="det">{pessoasLabel(adultos, criancas)}</p>
          <p className="det" style={{ marginTop: 2 }}>
            Mais os 7 centavos da conferência, somados uma vez só
          </p>
        </div>
        <p className="val">{brl(total)}</p>
      </div>

      <button
        className="bt"
        type="submit"
        disabled={enviando || recibo !== null}
        style={{ width: "100%", padding: 19 }}
      >
        {recibo
          ? "Inscrição enviada"
          : enviando
            ? "Enviando…"
            : "Confirmar e ver o Pix"}
      </button>

      {erro && (
        <p className="erro" role="alert">
          {erro}
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
            <p className="olho">Falta só o pagamento</p>
            <h3 className="pg-valor">{brl(recibo.valor)}</h3>
            <p className="pg-txt">
              O valor termina em <b>{recibo.centavos} centavos</b>, que marcam
              que este Pix é da conferência. Eles entram uma vez só, não por
              adulto, e por isso o total nunca é redondo. Pague o valor exato.
            </p>
            {/* O QR vem do servidor como data URL já pronto: nada de
                biblioteca de QR no navegador nem requisição de imagem. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- o QR é
                um data URL gerado no servidor; o <Image> do Next não tem o que
                otimizar nele e ainda tentaria buscá-lo por URL. */}
            <img className="pg-qr" src={recibo.qr} alt="QR Code do Pix" />
            <p className="olho" style={{ marginTop: 22 }}>
              Ou copie e cole no seu banco
            </p>
            <p className="pg-copia">{recibo.brCode}</p>
            <button type="button" className="bt vazio-escuro" onClick={copiar}>
              {copiado ? "Código copiado" : "Copiar o código"}
            </button>
            <p className="pg-nota">
              {recibo.emailEnviado
                ? "Mandamos este mesmo código para o seu e-mail."
                : "Não conseguimos enviar o e-mail agora, então guarde este código."}{" "}
              Não precisa enviar comprovante: conferimos pelo nome de quem paga
              e pelo valor. Inscrição nº {recibo.numero}, {recibo.pessoas},{" "}
              {recibo.dias.toLowerCase()}.
            </p>
          </>
        )}
      </div>
    </form>
  )
}
