"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { website_config_variables } from "@/config"
import Logo from "@/components/ui/Logo"

const navLinks = [
  { label: "Início", href: "/", listable: true },
  { label: "Sobre", href: "/sobre", listable: true },
  { label: "Confissões", href: "/confissoes", listable: true },
  { label: "Galeria", href: "/galeria", listable: true },
  { label: "Contato", href: "/contato", listable: true },
  //{ label: "Doutrina", href: "/doutrina", listable: false }, // Remove
  {
    label: "Mídia",
    href: "/media",
    listable: website_config_variables.media.active,
  },
  {
    label: "Agenda",
    href: "/agenda",
    listable: website_config_variables.agenda.active,
  }, // Remove
  //{ label: "Ministérios", href: "/ministerios", listable: false }, // Remove
  {
    label: "Blog",
    href: "/blog",
    listable: website_config_variables.blog.active,
  }, // Remove
  {
    label: "Biblioteca",
    href: "/biblioteca",
    listable: website_config_variables.library.active,
  }, // Remove
  { label: "Catecismo", href: "/catecismo", listable: false },
  //{ label: "Links", href: "/links", listable: false }, // Remove
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav
        data-chrome-link
        className="fixed top-0 left-0 right-0 z-50 bg-navy-950 border-b border-gold-500/10"
      >
        <div className="container mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-serif italic text-primary-foreground"
            aria-label="Igreja Reformada de Brasília — Início"
          >
            <Logo variant="mark" tone="gold" height={32} priority />
            <span
              className="text-gold-400 leading-none"
              style={{ fontSize: "var(--text-size-xl)" }}
            >
              IRB
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks
              .filter((item) => item.listable)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono uppercase tracking-[0.2em] transition-colors duration-500 ${
                    pathname === link.href
                      ? "text-gold-500"
                      : "text-primary-foreground/65 hover:text-gold-400"
                  }`}
                  style={{ fontSize: "var(--text-size-sm)" }}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-primary-foreground/60 hover:text-gold-400 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            data-chrome-link
            className="fixed inset-0 z-40 bg-navy-900 pt-14 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks
                .filter((item) => item.listable)
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-mono uppercase tracking-[0.2em] text-sm transition-colors duration-500 ${
                      pathname === link.href
                        ? "text-gold-500"
                        : "text-primary-foreground/65 hover:text-gold-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
