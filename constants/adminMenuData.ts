import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Video,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  Tag,
  ImageIcon,
  MessageCircle,
  ListChecks,
} from "lucide-react"

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  isAvailable: boolean
}

const quickActions: NavItem[] = [
  {
    icon: FileText,
    label: "Nova Publicação",
    href: "/admin/publicacoes/novo",
    isAvailable: true,
  },
  {
    icon: Video,
    label: "Novo Sermão",
    href: "/admin/publicacoes/novo",
    isAvailable: false,
  },
  {
    icon: BookOpen,
    label: "Novo Estudo",
    href: "/admin/publicacoes/novo",
    isAvailable: false,
  },
  {
    icon: Calendar,
    label: "Novo Evento",
    href: "/admin/agenda/novo",
    isAvailable: false,
  },
]

const mainNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    isAvailable: true,
  },
  {
    icon: Tag,
    label: "Categorias",
    href: "/admin/categorias",
    isAvailable: true,
  },
  {
    icon: FileText,
    label: "Publicações",
    href: "/admin/publicacoes",
    isAvailable: true,
  },
  {
    icon: Video,
    label: "Sermões",
    href: "/admin/sermoes",
    isAvailable: false,
  },
  {
    icon: ImageIcon,
    label: "Mídia",
    href: "/admin/media",
    isAvailable: true,
  },
  {
    icon: MessageCircle,
    label: "Mensagens",
    href: "/admin/mensagens",
    isAvailable: true,
  },
]

const systemNavItems: NavItem[] = [
  {
    icon: Users,
    label: "Usuários",
    href: "/admin/usuarios",
    isAvailable: false,
  },
  {
    icon: ListChecks,
    label: "FAQ",
    href: "/admin/faq",
    isAvailable: true,
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "/admin/configuracoes",
    isAvailable: true,
  },
  {
    icon: HelpCircle,
    label: "Ajuda",
    href: "/admin/ajuda",
    isAvailable: false,
  },
]

export const adminMenuData = {
  quickActions,
  mainNavItems,
  systemNavItems,
}
