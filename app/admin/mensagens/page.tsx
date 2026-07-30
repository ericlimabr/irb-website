import Link from "next/link"
import { getContactMessages } from "@/app/actions/contact"

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

export default async function MensagensPage() {
  const messages = await getContactMessages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Mensagens
        </h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} mensagem(ns) recebida(s).
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {messages.map((m) => (
            <Link
              key={m.id}
              href={`/admin/mensagens/${m.id}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 rounded-full ${
                  m.read ? "bg-transparent" : "bg-gold-500"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`truncate text-sm ${
                      m.read
                        ? "text-muted-foreground"
                        : "font-semibold text-foreground"
                    }`}
                  >
                    {m.name}
                  </p>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {dateFmt.format(m.createdAt)}
                  </time>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {m.subject}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
