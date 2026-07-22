"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

interface ScrollToTopProps {
  /** Scroll distance in px before the button appears. */
  threshold?: number
}

export default function ScrollToTop({ threshold = 800 }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)

    // Run once on mount so a restored scroll position shows the button.
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          // Opts out of the global square-corner rule in globals.css.
          data-round
          // Below the lightbox (z-60) so it stays behind the overlay when open.
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-navy-700 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-navy-700 hover:border-gold-500 transition-colors duration-500"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
