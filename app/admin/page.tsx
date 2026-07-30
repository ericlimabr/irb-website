import { Mail, MessageCircle, ListChecks, FileText } from "lucide-react"
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

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActionsCard />
        <RecentActivityCard />
      </div>
    </div>
  )
}
