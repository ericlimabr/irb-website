"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Navigation from "@/components/layout/Navigation"

export default function NotFound() {
  return (
    <>
      <Navigation />

      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden texture-grid"
        style={{
          background: `linear-gradient(135deg, var(--navy-900), var(--navy-700) 40%, var(--navy-600))`,
        }}
      >
        {/* Gold orb glow */}
        <div
          className="absolute w-[600px] h-[600px] opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: 0.1,
            }}
            className="mono-label mb-8"
          >
            Erro 404
          </motion.p>

          {/* Large 404 number */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: 0.3,
            }}
            className="font-serif font-light text-primary-foreground/10 leading-none mb-0 select-none"
            style={{ fontSize: "clamp(8rem, 25vw, 22rem)" }}
            aria-hidden
          >
            404
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: 0.5,
            }}
            className="font-serif font-light text-primary-foreground leading-tight -mt-8 mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
          >
            Página <em className="text-gold-400">não encontrada</em>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: 0.9,
            }}
            className="gold-divider w-24 mx-auto mb-8 origin-center"
          />

          {/* Scripture quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.1 }}
            className="font-sans text-primary-foreground/55 max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: "var(--text-size-lg)" }}
          >
            O caminho que você procurou não existe. Mas há um Caminho que sempre
            conduz ao destino certo.
          </motion.p>

          {/* Scripture reference */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="mono-label mb-10"
            style={{ opacity: 0.5 }}
          >
            João 14:6
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: 1.6,
            }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-xs font-medium border border-gold-500 text-gold-400 px-8 py-4 hover:bg-gold-500 hover:text-navy-700 transition-colors duration-500"
            >
              <span className="w-6 h-px bg-current flex-shrink-0" aria-hidden />
              Voltar ao início
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  )
}
