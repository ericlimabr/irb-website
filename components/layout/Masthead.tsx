"use client"

import { useRef, ReactNode } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Logo from "@/components/ui/Logo"

interface MastheadProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  children?: ReactNode
  fullHeight?: boolean
  /** Shows the full crest (monogram + olive branches) above the eyebrow. */
  logo?: boolean
  /** Ghosts the full crest across the background as a watermark. On by default. */
  watermark?: boolean
  /**
   * Photograph ghosted into the background. It sits over the navy gradient and
   * under the grid, orb and crest, so every existing layer is preserved — the
   * photo only tints what is already there.
   */
  backgroundImage?: string
  /** How strongly the photograph reads through. Keep low: the title needs contrast. */
  backgroundImageOpacity?: number
}

export default function Masthead({
  eyebrow,
  title,
  subtitle,
  children,
  fullHeight = true,
  logo = false,
  watermark = true,
  backgroundImage,
  backgroundImageOpacity = 0.28,
}: MastheadProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={ref}
      className={`relative ${fullHeight ? "min-h-screen" : "min-h-[60vh]"} flex items-center justify-center overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, var(--navy-900), var(--navy-700) 40%, var(--navy-600))`,
      }}
    >
      {/* Photograph — first layer above the gradient, so the navy tints it */}
      {backgroundImage && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ opacity: backgroundImageOpacity }}
          />
          {/* Darkens the lower edge, where the subtitle and scroll hint sit. */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--navy-900) 65%, transparent))`,
            }}
          />
        </div>
      )}

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: fullHeight
            ? `repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(197,160,89,0.04) 48px, rgba(197,160,89,0.04) 49px),
               repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(197,160,89,0.04) 48px, rgba(197,160,89,0.04) 49px)`
            : `repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(197,160,89,0.07) 23px, rgba(197,160,89,0.07) 24px),
               repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(197,160,89,0.07) 23px, rgba(197,160,89,0.07) 24px)`,
        }}
      />

      {/* Gold orb glow */}
      <div
        className="absolute w-[600px] h-[600px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)",
          top: "20%",
          right: "10%",
        }}
      />

      {/* Crest watermark — decorative background layer, sits under the content */}
      {watermark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="aspect-[842/729] opacity-[0.07] w-[min(86vw,640px)]"
            style={{
              backgroundImage: "url(/logo/logo-gold.svg)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        {logo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <Logo
              variant="full"
              tone="gold"
              height={132}
              alt="Brasão da Igreja Reformada de Brasília"
              priority
              className="h-[104px] w-auto md:h-[132px]"
            />
          </motion.div>
        )}

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mono-label mb-6"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-serif font-light text-primary-foreground leading-[0.95] mb-8"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.96rem)" }}
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="gold-divider w-24 mx-auto mb-8 origin-center"
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.0 }}
            className="font-sans text-primary-foreground/55 max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: "var(--text-size-lg)" }}
          >
            {subtitle}
          </motion.p>
        )}

        {children}
      </div>

      {/* Scroll hint */}
      {fullHeight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gold-500/30 mx-auto mb-2" />
          <p
            className="font-mono uppercase tracking-[0.2em] text-primary-foreground/30"
            style={{ fontSize: "8px" }}
          >
            Scroll
          </p>
        </motion.div>
      )}
    </section>
  )
}
