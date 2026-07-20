import Image from "next/image"

type LogoVariant = "mark" | "full"
type LogoTone = "gold" | "goldBright" | "navy" | "black"

/**
 * Intrinsic aspect ratios of the source SVGs, used to derive width from height
 * so callers only ever pick a height.
 */
const RATIO: Record<LogoVariant, number> = {
  mark: 384.2 / 460.0,
  full: 842.469565 / 729.0,
}

const SRC: Record<LogoTone, Record<LogoVariant, string>> = {
  gold: {
    mark: "/logo/logo-gold-no-branches.svg",
    full: "/logo/logo-gold.svg",
  },
  goldBright: {
    mark: "/logo/logo-gold-bright-no-branches.svg",
    full: "/logo/logo-gold-bright.svg",
  },
  navy: {
    mark: "/logo/logo-navy-no-branches.svg",
    full: "/logo/logo-navy.svg",
  },
  black: {
    mark: "/logo/logo-no-branches.svg",
    full: "/logo/logo.svg",
  },
}

interface LogoProps {
  /** "mark" is the Chi-Rho monogram alone; "full" includes the olive branches. */
  variant?: LogoVariant
  tone?: LogoTone
  /** Rendered height in px. Width follows the source aspect ratio. */
  height?: number
  className?: string
  /** Empty by default: the logo is usually decorative beside a text label. */
  alt?: string
  priority?: boolean
}

export default function Logo({
  variant = "mark",
  tone = "gold",
  height = 28,
  className,
  alt = "",
  priority = false,
}: LogoProps) {
  const width = Math.round(height * RATIO[variant])

  return (
    <Image
      src={SRC[tone][variant]}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      // Next's optimiser refuses SVG unless dangerouslyAllowSVG is set; these
      // are our own trusted assets, so serve them as-is instead.
      unoptimized
      className={className}
      aria-hidden={alt === "" || undefined}
    />
  )
}
