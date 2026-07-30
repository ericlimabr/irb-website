import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import {
  getMessageAndMarkAsRead,
  markMessageAsUnread,
  deleteContactMessage,
} from "@/app/actions/contact"

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
})

export default async function MensagemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const message = await getMessageAndMarkAsRead(id)
  if (!message) notFound()

  // wa.me needs digits only, international. Assume Brazil (55) when absent.
  const waDigits = message.whatsapp.replace(/\D/g, "")
  const waIntl = waDigits.startsWith("55") ? waDigits : `55${waDigits}`

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/mensagens"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar às mensagens
      </Link>

      <div className="space-y-4 border border-border bg-card p-6">
        <div>
          <p className="text-2xs font-mono uppercase tracking-[0.1em] text-gold-500">
            {dateFmt.format(message.createdAt)}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-foreground">
            {message.subject}
          </h1>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Nome</dt>
          <dd className="text-foreground">{message.name}</dd>

          <dt className="text-muted-foreground">E-mail</dt>
          <dd>
            <a
              href={`mailto:${message.email}`}
              className="text-gold-600 hover:underline"
            >
              {message.email}
            </a>
          </dd>

          <dt className="text-muted-foreground">WhatsApp</dt>
          <dd>
            <a
              href={`https://wa.me/${waIntl}`}
              target="_blank"
              rel="noreferrer"
              className="text-gold-600 hover:underline"
            >
              {message.whatsapp}
            </a>
          </dd>
        </dl>

        <div className="border-t border-border pt-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {message.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <form action={markMessageAsUnread.bind(null, message.id)}>
          <button
            type="submit"
            className="border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Marcar como não lida
          </button>
        </form>
        <form action={deleteContactMessage.bind(null, message.id)}>
          <button
            type="submit"
            className="border border-destructive/40 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            Excluir
          </button>
        </form>
      </div>
    </div>
  )
}
