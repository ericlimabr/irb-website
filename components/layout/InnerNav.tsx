import { cn } from "@/lib/utils/styling"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface InnerNavProps {
  title: string
  links?: { label: string; href: string }[]
  className?: string
}

export default function InnerNav({ title, links, className }: InnerNavProps) {
  return (
    <div
      className={cn(
        `bg-navy-900 border-b border-gold-500/10 sticky top-14 z-30`,
        className,
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-10">
        {/* Left: Back */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono uppercase tracking-[0.1em] text-gold-400 hover:text-gold-500 transition-colors duration-500"
          style={{ fontSize: "9px" }}
        >
          <ArrowLeft size={12} />
          Início
        </Link>

        {/* Center: Anchor links */}
        {links && links.length > 0 && (
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/65 hover:text-gold-400 transition-colors duration-500"
                style={{ fontSize: "9px" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Right: Page title */}
        <span className="font-serif italic text-primary-foreground/65 text-sm">
          {title}
        </span>
      </div>
    </div>
  )
}
