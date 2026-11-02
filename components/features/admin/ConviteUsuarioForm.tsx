"use client"

import { useActionState } from "react"
import { UserPlus } from "lucide-react"
import { convidaUsuario } from "@/app/actions/usuarios"

const campo =
  "w-full border border-border bg-background px-4 py-3 font-sans text-sm text-foreground focus:border-primary focus:outline-none"

const rotulo =
  "mb-2 block font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground"

/** O formulário que convida alguém. O e-mail sai na hora em que ele é enviado. */
export default function ConviteUsuarioForm() {
  const [state, formAction, pending] = useActionState(convidaUsuario, null)

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={rotulo}>
            E-mail de quem vai ter acesso
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="nome@exemplo.com"
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="nome" className={rotulo}>
            Nome (opcional)
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="off"
            placeholder="Como chamar a pessoa no convite"
            className={campo}
          />
        </div>
      </div>

      {state?.erro && (
        <p className="font-sans text-sm text-destructive" role="alert">
          {state.erro}
        </p>
      )}
      {state?.ok && (
        <p className="font-sans text-sm text-primary" role="status">
          {state.ok}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-2xs uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary disabled:opacity-60"
      >
        <UserPlus className="h-4 w-4" />
        {pending ? "Enviando convite..." : "Enviar convite"}
      </button>
    </form>
  )
}
