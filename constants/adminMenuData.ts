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
  ClipboardList,
  AlertTriangle,
  PowerOff,
} from "lucide-react"

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  isAvailable: boolean
  /**
   * Item que só existe para a conta da igreja (utils/dono.ts). Para as outras
   * contas ele nao aparece no menu, e a propria tela responde 404: esconder o
   * botao nao protege nada por si.
   */
  apenasDono?: boolean
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
    isAvailable: false,
  },
  {
    icon: FileText,
    label: "Publicações",
    href: "/admin/publicacoes",
    isAvailable: false,
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
    isAvailable: false,
  },
  {
    icon: MessageCircle,
    label: "Mensagens",
    href: "/admin/mensagens",
    isAvailable: true,
  },
  {
    icon: ClipboardList,
    label: "Inscrições",
    href: "/admin/inscricoes",
    isAvailable: true,
  },
  {
    icon: AlertTriangle,
    label: "Falhas do site",
    href: "/admin/erros",
    isAvailable: true,
  },
]

const systemNavItems: NavItem[] = [
  {
    icon: Users,
    label: "Usuários",
    href: "/admin/usuarios",
    isAvailable: true,
    apenasDono: true,
  },
  {
    // Tira o site do ar e devolve. Só a conta da igreja, e a tela responde 404
    // para as outras: ver app/admin/manutencao/page.tsx.
    icon: PowerOff,
    label: "Manutenção",
    href: "/admin/manutencao",
    isAvailable: true,
    apenasDono: true,
  },
  {
    icon: ListChecks,
    label: "FAQ",
    href: "/admin/faq",
    isAvailable: false,
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "/admin/configuracoes",
    isAvailable: false,
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
