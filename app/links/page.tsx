import type { Metadata } from "next"
import QRCode from "qrcode"
import Analytics from "@/components/analytics/Analytics"
import Logo from "@/components/ui/Logo"
import ShareButton from "@/components/features/links/ShareButton"
import {
  Youtube,
  Instagram,
  MessageCircle,
  Home,
  BookOpen,
  MapPin,
  PlayCircle,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { CHURCH_WHATSAPP, CHURCH_DOMAIN, CHURCH_SITE_URL } from "@/const"

const LINKS_URL = `${CHURCH_SITE_URL}/links`

export const metadata: Metadata = {
  title: "Links",
  description:
    "Acesso rápido aos nossos recursos, redes sociais e páginas principais.",
  alternates: { canonical: "/links" },
  // Preview de compartilhamento igual ao do site: herda a imagem OG da raiz
  // (app/opengraph-image.png) e o siteName/locale do layout raiz.
  openGraph: {
    title: "Igreja Reformada de Brasília",
    description:
      "Acesso rápido aos nossos recursos, redes sociais e páginas principais.",
    url: "/links",
    type: "website",
  },
}

type LinkItem = {
  label: string
  href: string
  icon: LucideIcon
  description: string
  /** Mantido no código, mas não renderizado nesta tela. */
  hidden?: boolean
}

// Ordem = ordem de exibição. Itens `hidden` ficam guardados para reativar depois.
const links: LinkItem[] = [
  {
    label: "Nosso endereço",
    href: "https://maps.app.goo.gl/KFsQSHx49nczJ4Ry8",
    icon: MapPin,
    description: "Como chegar até a igreja",
  },
  {
    label: "Estudo Bíblico: A Interpretação da Bíblia",
    href: "https://www.youtube.com/live/7se6LP___-o",
    icon: PlayCircle,
    description: "Como Ler a Bíblia",
  },
  {
    label: "Canal do Youtube",
    href: "https://www.youtube.com/@IgrejaReformadadeBras%C3%ADliaIRB/streams",
    icon: Youtube,
    description: "Sermões e transmissões ao vivo",
  },
  {
    label: "Nosso site",
    href: "/",
    icon: Home,
    description: "Página principal da igreja",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/irbrasilia",
    icon: Instagram,
    description: "@irbrasilia",
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${CHURCH_WHATSAPP}`,
    icon: MessageCircle,
    description: "Entrar em contato",
  },
  // Ocultos nesta tela (mantidos para reativar depois):
  {
    label: "Biblioteca Virtual",
    href: `https://biblioteca.${CHURCH_DOMAIN}`,
    icon: BookOpen,
    description: "Acervo de obras reformadas",
    hidden: true,
  },
  {
    label: "Catecismo",
    href: "/catecismo",
    icon: BookOpen,
    description: "Catecismo de Heidelberg interativo",
    hidden: true,
  },
]

export default async function Linktree() {
  const year = new Date().getFullYear()

  // QR do próprio /links, gerado no servidor (SVG inline, sem JS no cliente).
  // Navy sobre branco — no idioma visual da marca.
  const qrSvg = await QRCode.toString(LINKS_URL, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#002347", light: "#ffffff" },
  })

  return (
    <>
      <Analytics />

      {/* QR do /links — fixo na lateral direita, só no desktop */}
      <div className="hidden md:flex fixed right-6 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-3 bg-surface border border-border-subtle p-4 shadow-lg">
        <p className="font-mono uppercase tracking-[0.2em] text-navy-700/50 text-2xs">
          Abrir no celular
        </p>
        <div
          aria-label="QR code para abrir esta página no celular"
          role="img"
          className="bg-white p-2 w-36 h-36 [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
      </div>

      <div className="flex min-h-screen flex-col">
        {/* Header compacto — brasão + nome, sem o hero gigante do site */}
        <header
          className="relative text-center"
          style={{
            background: `linear-gradient(135deg, var(--navy-900), var(--navy-700) 40%, var(--navy-600))`,
          }}
        >
          {/* Compartilhar — ao lado da logo, canto do header */}
          <div className="absolute top-4 right-4 md:top-5 md:right-6">
            <ShareButton url={LINKS_URL} />
          </div>

          <div className="container mx-auto px-6 py-12">
            <Logo
              variant="full"
              tone="gold"
              height={80}
              alt="Brasão da Igreja Reformada de Brasília"
              priority
              className="mx-auto h-16 w-auto md:h-20"
            />
            <h1 className="font-serif text-primary-foreground text-2xl md:text-3xl mt-4">
              Igreja Reformada de Brasília
            </h1>
            <p className="font-mono uppercase tracking-[0.2em] text-gold-400 text-2xs mt-3">
              Links & Recursos
            </p>
          </div>
        </header>

        {/* Cartões de link */}
        <main className="flex-grow bg-surface pt-10 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {links
                .filter((link) => !link.hidden)
                .map((link) => {
                  const Icon = link.icon
                  const isInternal = link.href.startsWith("/")
                  const Component = isInternal ? Link : "a"

                  return (
                    <Component
                      key={link.href}
                      href={link.href}
                      target={!isInternal ? "_blank" : undefined}
                      rel={!isInternal ? "noopener noreferrer" : undefined}
                      className="block p-6 border border-border-subtle hover:shadow-lg transition-shadow duration-500 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <Icon className="w-8 h-8 text-gold-500 group-hover:text-gold-400 transition-colors" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-serif text-xl text-navy-700 group-hover:text-gold-500 transition-colors">
                            {link.label}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {link.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-gold-500/40 group-hover:text-gold-500 transition-colors">
                          →
                        </div>
                      </div>
                    </Component>
                  )
                })}
            </div>
          </div>
        </main>

        {/* Rodapé enxuto — mesma estética do site, só o essencial */}
        <footer className="bg-navy-700 border-t-4 border-gold-500">
          <div className="container mx-auto px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500 text-fs-9"
              >
                Nosso site
              </Link>
              <Link
                href="/politica-de-privacidade"
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500 text-fs-9"
              >
                Privacidade
              </Link>
            </div>

            <p
              className="font-signature text-gold-500 text-5xl select-none"
              style={{ transform: "rotate(-3deg)" }}
            >
              Soli Deo Gloria
            </p>

            <p className="font-mono uppercase tracking-[0.1em] text-primary-foreground/35 text-2xs">
              © {year} Igreja Reformada de Brasília
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
