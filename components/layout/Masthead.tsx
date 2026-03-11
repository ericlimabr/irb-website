"use client"

import { useRef, ReactNode } from "react"
import { motion } from "framer-motion"

interface MastheadProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  children?: ReactNode
  fullHeight?: boolean
}

export default function Masthead({
  eyebrow,
  title,
  subtitle,
  children,
  fullHeight = true,
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

      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
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
