import { website_config_variables } from "@/config"
import Link from "next/link"
import Logo from "@/components/ui/Logo"

export default function Footer() {
  const footerLinks = [
    { label: "Início", href: "/", listable: true },
    { label: "Sobre", href: "/sobre", listable: true },
    { label: "Confissões", href: "/confissoes", listable: true },
    { label: "Doutrina", href: "/doutrina", listable: true },
    { label: "Contato", href: "/contato", listable: true },
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
  ]

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
            .filter((item) =>
              !website_config_variables.blog.active
                ? item.label != "Blog"
                : item,
            )
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500"
                style={{ fontSize: "9px" }}
              >
                {link.label}
              </Link>
            ))}
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
