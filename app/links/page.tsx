import Footer from "@/components/layout/Footer"
import InnerNav from "@/components/layout/InnerNav"
import Masthead from "@/components/layout/Masthead"
import { Youtube, Instagram, MessageCircle, Home, BookOpen } from "lucide-react"
import Link from "next/link"

const links = [
  {
    label: "Biblioteca Virtual",
    href: "https://biblioteca.irb.org.br",
    icon: BookOpen,
    description: "Acervo de obras reformadas",
  },
  {
    label: "Início",
    href: "/",
    icon: Home,
    description: "Voltar ao site principal",
  },
  {
    label: "Catecismo",
    href: "/catecismo",
    icon: BookOpen,
    description: "Catecismo de Heidelberg interativo",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/irbrasilia",
    icon: Instagram,
    description: "@irbrasilia",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@irbrasilia",
    icon: Youtube,
    description: "Sermões e conteúdo",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/556133334444",
    icon: MessageCircle,
    description: "Entrar em contato",
  },
]

export default function Linktree() {
  return (
    <>
      <section className="pb-20 bg-surface">
        <InnerNav title="Links" className="top-0" />
        <Masthead
          fullHeight={false}
          eyebrow="Igreja Reformada de Brasília"
          title={[
            "Nossos",
            <span key="gold" className="text-gold-400 italic">
              Links
            </span>,
          ]}
          subtitle="Acesso rápido a recursos, redes sociais e páginas principais."
        />
        <div className="container mx-auto px-6 pt-10">
          <div className="max-w-2xl mx-auto space-y-4">
            {links.map((link) => {
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
      </section>

      <Footer />
    </>
  )
}
