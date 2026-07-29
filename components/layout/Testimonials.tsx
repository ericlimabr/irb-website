"use client"

import { useEffect, useState } from "react"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { TestimonialCard } from "@/components/layout/Cards"
import { TESTIMONIALS } from "@/const"

/** Fisher–Yates shuffle, returns a new array. */
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Testemunhos section. Renders the real member citations in a random order.
 * The order is shuffled on the client after mount (the server render keeps the
 * source order, so hydration stays deterministic). All citations show at once;
 * on wide screens (lg) they sit side by side, otherwise they stack.
 */
export default function Testimonials() {
  const [items, setItems] = useState(TESTIMONIALS)

  useEffect(() => {
    setItems(shuffle(TESTIMONIALS))
  }, [])

  return (
    <Section bg="surface-alt" texture="linen">
      <AnimatedContent>
        <p className="section-tag mb-12">Testemunhos</p>
      </AnimatedContent>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {items.map((t, i) => (
          <TestimonialCard
            key={t.name}
            quote={t.quote}
            name={t.name}
            dark={i === 1}
          />
        ))}
      </div>
    </Section>
  )
}
