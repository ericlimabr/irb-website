"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Logo from "@/components/ui/Logo"

const fieldStyles =
  "w-full bg-surface border border-border-subtle px-4 py-3 font-sans text-navy-700 focus:outline-none focus:border-gold-500 transition-colors duration-300"

const labelStyles =
  "block font-mono uppercase tracking-[0.1em] text-navy-700/50 mb-2"

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden texture-grid px-6 py-16"
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
          right: "5%",
        }}
      />

      {/* Crest watermark — decorative background layer, sits under the content */}
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

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="relative z-10 w-full max-w-md bg-surface border border-border-subtle border-t-4 border-t-gold-500 p-8 sm:p-10"
      >
        <div className="flex justify-center mb-8">
          <Logo
            variant="full"
            tone="navy"
            height={88}
            alt="Brasão da Igreja Reformada de Brasília"
            priority
          />
        </div>

        <p
          className="font-mono uppercase tracking-[0.2em] text-gold-500 text-center mb-3"
          style={{ fontSize: "var(--text-size-xs)" }}
        >
          Área Restrita
        </p>
        <h1
          className="font-serif font-light text-navy-700 text-center mb-8"
          style={{ fontSize: "var(--text-size-3xl)" }}
        >
          Acesso <em className="text-gold-500">Administrativo</em>
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={labelStyles}
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldStyles}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={labelStyles}
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={fieldStyles}
            />
          </div>

          <button
            type="submit"
            className="w-full font-mono uppercase tracking-[0.1em] px-6 py-3 bg-navy-700 text-primary-foreground hover:bg-gold-500 hover:text-navy-700 transition-all duration-700"
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            Entrar →
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-mono uppercase tracking-[0.1em] text-navy-700/50 hover:text-gold-500 transition-colors duration-500"
            style={{ fontSize: "var(--text-size-xs)" }}
          >
            ← Voltar ao site
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
