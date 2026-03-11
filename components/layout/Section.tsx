"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface SectionProps {
  children: ReactNode
  className?: string
  bg?: "surface" | "surface-alt" | "inverse" | "page"
  texture?: "linen" | "hatch" | "grid" | "none"
  id?: string
}

const bgMap = {
  surface: "bg-surface",
  "surface-alt": "bg-surface-alt",
  inverse: "bg-navy-800",
  page: "bg-background",
}

const textureMap = {
  linen: "texture-linen",
  hatch: "texture-hatch",
  grid: "texture-grid",
  none: "",
}

export default function Section({
  children,
  className = "",
  bg = "surface",
  texture = "none",
  id,
}: SectionProps) {
  const isInverse = bg === "inverse"

  return (
    <section
      id={id}
      className={`py-24 md:py-32 ${bgMap[bg]} ${textureMap[texture]} ${isInverse ? "text-primary-foreground" : ""} ${className}`}
    >
      <div className="container mx-auto px-6">{children}</div>
    </section>
  )
}

// Animated wrapper for section content
export const AnimatedContent = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)
