import {
  Mail,
  MessageCircle,
  ListChecks,
  FileText,
  Cookie,
  Percent,
  Smartphone,
} from "lucide-react"
import StatCard from "@/components/features/admin/StatCard"
import QuickActionsCard from "@/components/features/admin/QuickActionsCard"
import RecentActivityCard from "@/components/features/admin/RecentActivityCard"
import { prisma } from "@/lib/prisma"

async function safeCount(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn()
  } catch {
    return 0
  }
}

export default async function AdminDashboardPage() {
  const [unread, totalMessages, faqs, posts] = await Promise.all([
    safeCount(() => prisma.contactMessage.count({ where: { read: false } })),
    safeCount(() => prisma.contactMessage.count()),
    safeCount(() => prisma.faq.count()),
    safeCount(() => prisma.post.count()),
  ])

  // Consentimento (LGPD): sinal do tráfego que NÃO aceita cookies — a única
  // janela sobre quem chega pela campanha e some antes de GA4/Clarity/pixel
  // poderem medir. Segmenta campanha vs orgânico e mede a fatia que vê o site
  // pelo navegador in-app do FB/IG (a causa provável de gravações vazias).
  const [
    cShown,
    cAccept,
    cCampShown,
    cCampAccept,
    cCampInApp,
  ] = await Promise.all([
    safeCount(() => prisma.consentEvent.count({ where: { type: "shown" } })),
    safeCount(() => prisma.consentEvent.count({ where: { type: "accept" } })),
    safeCount(() =>
      prisma.consentEvent.count({ where: { type: "shown", source: "campaign" } }),
    ),
    safeCount(() =>
      prisma.consentEvent.count({ where: { type: "accept", source: "campaign" } }),
    ),
    safeCount(() =>
      prisma.consentEvent.count({
        where: { type: "shown", source: "campaign", inApp: true },
      }),
    ),
  ])
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Visão Geral
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo do painel administrativo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Mail} label="Mensagens não lidas" value={unread} />
        <StatCard
          icon={MessageCircle}
          label="Total de mensagens"
          value={totalMessages}
        />
        <StatCard icon={ListChecks} label="FAQs" value={faqs} />
        <StatCard icon={FileText} label="Publicações" value={posts} />
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          Consentimento (LGPD)
        </h2>
        <p className="text-sm text-muted-foreground">
          Interação com o banner de cookies. Mede também quem chega pela campanha
          e não aceita — o único sinal desse público, já que Analytics e Clarity
          só rodam após o aceite.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Cookie} label="Banner exibido" value={cShown} />
        <StatCard
          icon={Percent}
          label="Taxa de aceite (%)"
          value={pct(cAccept, cShown)}
        />
        <StatCard
          icon={Percent}
          label="Aceite na campanha (%)"
          value={pct(cCampAccept, cCampShown)}
        />
        <StatCard
          icon={Smartphone}
          label="Campanha via app IG/FB (%)"
          value={pct(cCampInApp, cCampShown)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActionsCard />
        <RecentActivityCard />
      </div>
    </div>
  )
}
