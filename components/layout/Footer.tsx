import { website_config_variables } from "@/config"
import Link from "next/link"
import Logo from "@/components/ui/Logo"
import ConsentManageButton from "@/components/analytics/ConsentManageButton"
import {
  analyticsEnabled,
  consentPreviewEnabled,
} from "@/components/analytics/GoogleTagManager"

export default function Footer() {
  const footerLinks = [
    { label: "Início", href: "/", listable: true },
    { label: "Sobre", href: "/sobre", listable: true },
    { label: "Confissões", href: "/confissoes", listable: true },
    { label: "Doutrina", href: "/doutrina", listable: false },
    { label: "Contato", href: "/contato", listable: true },
    {
      label: "Perguntas Frequentes",
      href: "/perguntas-frequentes",
      listable: true,
    },
    {
      label: "Mídia",
      href: "/media",
      listable: website_config_variables.media.active,
    },
    {
      label: "Agenda",
      href: "/agenda",
      listable: website_config_variables.agenda.active,
    },
    {
      label: "Blog",
      href: "/blog",
      listable: website_config_variables.blog.active,
    },
    {
      label: "Privacidade",
      href: "/politica-de-privacidade",
      listable: true,
    },
  ]

  const footerLinkClass =
    "font-mono uppercase tracking-[0.1em] text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500 text-fs-9"

  // Só mostra "Gerenciar cookies" onde o banner pode de fato reabrir (produção,
  // ou preview de QA). Em dev normal o banner nem monta, então seria um botão morto.
  const showConsentManage = analyticsEnabled() || consentPreviewEnabled()

  return (
    <footer data-chrome-link className="bg-navy-700 border-t-4 border-gold-500">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Church name */}
        <div className="flex items-center gap-3">
          <Logo variant="mark" tone="gold" height={32} />
          <p className="font-serif italic text-primary-foreground/60 text-sm">
            Igreja Reformada de Brasília
          </p>
        </div>

        {/* Center: Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {footerLinks
            .filter((item) => item.listable)
            .map((link) => (
              <Link key={link.href} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          {showConsentManage && (
            <ConsentManageButton className={footerLinkClass} />
          )}
        </div>

        {/* Right: Soli Deo Gloria */}
        <p
          className="font-signature text-gold-500 text-5xl select-none"
          style={{ transform: "rotate(-3deg)" }}
        >
          Soli Deo Gloria
        </p>
      </div>
    </footer>
  )
}
