"use client"

import { useRef, useState, useTransition } from "react"
import { submitContactForm } from "@/app/actions/contact"

type Status =
  | { kind: "idle" }
  | { kind: "sent" }
  | { kind: "error"; message: string }

const fieldStyles =
  "w-full bg-surface border border-border-subtle px-4 py-3 font-sans text-navy-700 focus:outline-none focus:border-gold-500 transition-colors duration-300"

const labelStyles =
  "block font-mono uppercase tracking-[0.1em] text-navy-700/50 mb-2"

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [pending, startTransition] = useTransition()

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitContactForm(formData)

      if (result.success) {
        formRef.current?.reset()
        setStatus({ kind: "sent" })
        return
      }

      setStatus({
        kind: "error",
        message:
          "error" in result && result.error
            ? result.error
            : "Não foi possível enviar sua mensagem.",
      })
    })
  }

  if (status.kind === "sent") {
    return (
      <div className="border border-gold-500 border-l-[3px] bg-surface p-8 text-center">
        <p
          className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-4"
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          Mensagem enviada
        </p>
        <p className="font-serif text-navy-700 text-2xl mb-4">
          Recebemos o seu contato.
        </p>
        <p className="font-sans text-text-secondary mb-6">
          Responderemos assim que possível. Se preferir uma resposta imediata,
          fale conosco pelo WhatsApp.
        </p>
        <button
          onClick={() => setStatus({ kind: "idle" })}
          className="font-mono uppercase tracking-[0.1em] text-gold-500 hover:text-navy-700 transition-colors duration-500"
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          Enviar outra mensagem →
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-6">
      {/* Bot trap: the action discards any submission that fills this in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className={labelStyles}
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={fieldStyles}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className={labelStyles}
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldStyles}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className={labelStyles}
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          Assunto
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className={fieldStyles}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className={labelStyles}
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          className={`${fieldStyles} resize-y`}
        />
      </div>

      {status.kind === "error" && (
        <p
          className="font-mono uppercase tracking-[0.1em] text-destructive"
          style={{ fontSize: "var(--text-size-xs)" }}
          role="alert"
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-block font-mono uppercase tracking-[0.1em] px-6 py-3 bg-navy-700 text-primary-foreground hover:bg-gold-500 hover:text-navy-700 disabled:opacity-50 transition-all duration-700"
        style={{ fontSize: "var(--text-size-xs)" }}
      >
        {pending ? "Enviando..." : "Enviar Mensagem →"}
      </button>
    </form>
  )
}
