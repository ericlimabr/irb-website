"use client"

import { useActionState } from "react"
import { reenviaConvite } from "@/app/actions/usuarios"

/**
 * Manda outro link para quem foi convidado e ainda não entrou. Existe porque
 * e-mail se perde: sem este botão, o único caminho seria apagar a conta no
 * painel do Supabase e convidar de novo.
 */
export default function ReenviarConvite({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(reenviaConvite, null)

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        className="border border-border px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Reenviar convite"}
      </button>
      {(state?.ok || state?.erro) && (
        <span
          className={`font-sans text-xs ${state.erro ? "text-destructive" : "text-primary"}`}
        >
          {state.erro ?? state.ok}
        </span>
      )}
    </form>
  )
}
