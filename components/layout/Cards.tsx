import { ReactNode } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

/* ===== Vertical Card ===== */
interface VerticalCardProps {
  eyebrow?: string
  title: string
  description?: string
  href?: string
  linkText?: string
  meta?: string
  featured?: boolean
  /** 16:9 image for the media area. Falls back to the gradient when absent. */
  image?: string
  /** Left empty by default: the card title already names the content. */
  imageAlt?: string
}

export const VerticalCard = ({
  eyebrow,
  title,
  description,
  href,
  linkText = "Saiba Mais →",
  meta,
  featured = false,
  image,
  imageAlt = "",
}: VerticalCardProps) => {
  const base = featured
    ? "bg-navy-700 texture-hatch border border-primary-foreground/10"
    : "bg-surface border border-border"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`${base} transition-shadow duration-700 hover:shadow-lg group flex flex-col`}
      style={{ boxShadow: featured ? "none" : "var(--shadow-sm)" }}
    >
      {/* Media — the gradient stays as the backdrop, so it covers the image
          while it loads and remains the fallback when none is supplied. */}
      <div
        className="relative aspect-video w-full overflow-hidden"
        style={{
          background: featured
            ? "linear-gradient(135deg, var(--navy-800), var(--navy-600))"
            : "linear-gradient(135deg, var(--navy-50), var(--bg-surface-alt))",
        }}
      >
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            fill
            // Three columns from md up, single column below.
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {eyebrow && (
          <p
            className={`mono-label-sm mb-3 ${featured ? "text-gold-400" : "text-gold-500"}`}
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            {eyebrow}
          </p>
        )}

        <h3
          className={`font-serif font-semibold mb-3 ${featured ? "text-primary-foreground" : "text-navy-700"}`}
          style={{ fontSize: "var(--text-size-xl)" }}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`font-sans leading-relaxed mb-4 flex-1 ${
              featured ? "text-primary-foreground/65" : "text-muted-foreground"
            }`}
            style={{ fontSize: "var(--text-size-sm)" }}
          >
            {description}
          </p>
        )}

        <div
          className={`border-t pt-4 mt-auto flex items-center justify-between ${featured ? "border-primary-foreground/10" : "border-border"}`}
        >
          {meta && (
            <span
              className="font-mono uppercase tracking-[0.1em] text-muted-foreground"
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              {meta}
            </span>
          )}
          {href && (
            <Link
              href={href}
              className={`font-mono uppercase tracking-[0.1em] transition-colors duration-500 ${
                featured
                  ? "text-gold-400 hover:text-gold-500"
                  : "text-gold-600 hover:text-gold-500"
              }`}
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ===== Horizontal Compact Card ===== */
interface HorizontalCardProps {
  dateDay?: string
  dateMonth?: string
  eyebrow: string
  title: string
  meta?: string
  href?: string
  linkText?: string
}

export const HorizontalCard = ({
  dateDay,
  dateMonth,
  eyebrow,
  title,
  meta,
  href,
  linkText = "Saiba Mais →",
}: HorizontalCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className="bg-surface border border-border border-l-[3px] border-l-gold-500 flex items-stretch transition-shadow duration-700 hover:shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.02]"
    style={{ boxShadow: "var(--shadow-sm)" }}
  >
    {dateDay && (
      <div className="flex flex-col items-center justify-center px-6 py-4 border-r border-border min-w-[80px]">
        <span className="font-serif text-gold-500 text-2xl font-semibold leading-none">
          {dateDay}
        </span>
        <span
          className="font-mono uppercase tracking-[0.1em] text-muted-foreground mt-1"
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          {dateMonth}
        </span>
      </div>
    )}
    <div className="flex-1 p-4 flex flex-col justify-center">
      <p
        className="mono-label-sm text-gold-500 mb-1"
        style={{ fontSize: "var(--text-size-xs)" }}
      >
        {eyebrow}
      </p>
      <h4
        className="font-serif text-navy-700 font-semibold"
        style={{ fontSize: "var(--text-size-lg)" }}
      >
        {title}
      </h4>
      {meta && (
        <p
          className="font-sans text-muted-foreground mt-1"
          style={{ fontSize: "var(--text-size-sm)" }}
        >
          {meta}
        </p>
      )}
    </div>
    {href && (
      <div className="flex items-center px-4">
        <Link
          href={href}
          className="font-mono uppercase tracking-[0.1em] text-gold-600 hover:text-gold-500 transition-colors duration-500 whitespace-nowrap"
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          {linkText}
        </Link>
      </div>
    )}
  </motion.div>
)

/* ===== Testimonial Card ===== */
interface TestimonialProps {
  quote: string
  name: string
  role: string
  dark?: boolean
}

export const TestimonialCard = ({
  quote,
  name,
  role,
  dark = false,
}: TestimonialProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className={`relative p-8 border ${
      dark
        ? "bg-navy-700 border-primary-foreground/10"
        : "bg-surface border-border"
    }`}
    style={{ boxShadow: "var(--shadow-sm)" }}
  >
    {/* Decorative quote */}
    <span
      className={`absolute top-4 left-6 font-serif leading-none select-none pointer-events-none ${
        dark ? "text-gold-500/15" : "text-gold-200"
      }`}
      style={{ fontSize: "120px" }}
    >
      &ldquo;
    </span>

    <blockquote className="relative z-10 pt-12">
      <p
        className={`font-serif italic leading-relaxed mb-6 ${
          dark ? "text-primary-foreground/80" : "text-navy-700"
        }`}
        style={{ fontSize: "var(--text-size-lg)" }}
      >
        {quote}
      </p>
      <footer className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy-700 border-2 border-gold-500 flex items-center justify-center">
          <span className="font-mono text-primary-foreground text-xs font-bold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p
            className={`font-sans font-semibold text-sm ${dark ? "text-primary-foreground" : "text-navy-700"}`}
          >
            {name}
          </p>
          <p
            className={`font-mono uppercase tracking-[0.1em] ${dark ? "text-primary-foreground/50" : "text-muted-foreground"}`}
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            {role}
          </p>
        </div>
      </footer>
    </blockquote>
  </motion.div>
)

/* ===== Button ===== */
interface ButtonProps {
  variant?: "primary" | "secondary" | "inverse" | "accent"
  children: ReactNode
  href?: string
  className?: string
  onClick?: () => void
}

const variantStyles = {
  primary:
    "bg-navy-700 text-primary-foreground hover:bg-gold-500 hover:text-navy-700",
  secondary:
    "bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-700",
  inverse:
    "bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-gold-500 hover:text-navy-700 hover:border-gold-500",
  accent: "bg-gold-500 text-navy-700 hover:bg-gold-600",
}

export const IRBButton = ({
  variant = "primary",
  children,
  href,
  className = "",
  onClick,
}: ButtonProps) => {
  const styles = `inline-block font-mono uppercase tracking-[0.1em] px-6 py-3 transition-all duration-700 ${variantStyles[variant]} ${className}`

  // Off-site targets (WhatsApp, the virtual library) open in a new tab and skip
  // the router, which has nothing to prefetch for them.
  if (href?.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
        style={{ fontSize: "var(--text-size-xs)" }}
      >
        {children}
      </a>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        className={styles}
        style={{ fontSize: "var(--text-size-xs)" }}
      >
        {children}
      </Link>
    )
  }
  return (
    <button
      onClick={onClick}
      className={styles}
      style={{ fontSize: "var(--text-size-xs)" }}
    >
      {children}
    </button>
  )
}
