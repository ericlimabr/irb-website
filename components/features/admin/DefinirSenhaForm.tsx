"use client"

import { useActionState } from "react"
import { defineSenha } from "@/app/actions/auth"

const fieldStyles =
  "w-full bg-surface border border-border-subtle px-4 py-3 font-sans text-navy-700 focus:outline-none focus:border-gold-500 transition-colors duration-300"

const labelStyles =
  "block font-mono uppercase tracking-[0.1em] text-navy-700/50 mb-2 text-2xs"

/**
 * O formulário de criar senha. Mesma silhueta da tela de entrada, de propósito:
 * quem chega aqui vem de um e-mail e precisa reconhecer que está no site certo.
 */
export default function DefinirSenhaForm({
  nomeAtual,
}: {
  nomeAtual: string | null
}) {
  const [state, formAction, pending] = useActionState(defineSenha, null)

  return (
    <form action={formAction} className="space-y-6">
      {!nomeAtual && (
        <div>
          <label htmlFor="nome" className={labelStyles}>
            Seu nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            className={fieldStyles}
          />
        </div>
      )}

      <div>
        <label htmlFor="password" className={labelStyles}>
          Nova senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={fieldStyles}
        />
        <p className="mt-2 font-sans text-xs text-navy-700/60">
          Pelo menos 8 caracteres.
        </p>
      </div>

      <div>
        <label htmlFor="confirm" className={labelStyles}>
          Repita a senha
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={fieldStyles}
        />
      </div>

      {state?.error && (
        <p
          className="font-mono uppercase tracking-[0.1em] text-destructive text-center text-2xs"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full font-mono uppercase tracking-[0.1em] px-6 py-3 bg-navy-700 text-primary-foreground hover:bg-gold-500 hover:text-navy-700 disabled:opacity-60 transition-all duration-700 text-2xs"
      >
        {pending ? "Salvando..." : "Salvar e entrar →"}
      </button>
    </form>
  )
}
