"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryPhoto } from "@/utils/gallery"

interface GalleryGridProps {
  photos: GalleryPhoto[]
}

const ALT = "Fotografia da Igreja Reformada de Brasília"

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isOpen = openIndex !== null

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) => {
        if (current === null) return current
        return (current + delta + photos.length) % photos.length
      }),
    [photos.length],
  )

  // Keyboard control, and a scroll lock so the page behind stays put.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, close, step])

  if (photos.length === 0) {
    return (
      <p className="font-sans text-muted-foreground text-center py-12">
        Nenhuma fotografia disponível.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpenIndex(i)}
            aria-label={`Abrir fotografia ${i + 1} de ${photos.length}`}
            className="relative aspect-square overflow-hidden bg-navy-800 group"
          >
            <Image
              src={photo.src}
              alt={ALT}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Visualizador de fotografias"
            className="fixed inset-0 z-[60] bg-navy-950/95 flex items-center justify-center"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Fechar"
              className="absolute top-6 right-6 z-10 text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500"
            >
              <X size={24} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  aria-label="Anterior"
                  className="absolute left-4 md:left-8 z-10 text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  aria-label="Próxima"
                  className="absolute right-4 md:right-8 z-10 text-primary-foreground/60 hover:text-gold-400 transition-colors duration-500"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div
              className="relative w-[92vw] h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[openIndex].src}
                alt={ALT}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>

            <p
              className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono uppercase tracking-[0.2em] text-primary-foreground/40"
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              {openIndex + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
