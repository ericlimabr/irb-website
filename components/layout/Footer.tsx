import Link from "next/link"

export default function Footer() {
  const footerLinks = [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Confissões", href: "/confissoes" },
    { label: "Doutrina", href: "/doutrina" },
    { label: "Mídia", href: "/media" },
    { label: "Agenda", href: "/agenda" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <footer className="bg-navy-700 border-t-4 border-gold-500">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Church name */}
        <p className="font-serif italic text-primary-foreground/60 text-sm">
          Igreja Reformada de Brasília
        </p>

        {/* Center: Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {footerLinks.map((link) => (
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
