"use client"

import { useEffect, useRef, useState } from "react"

export interface IndexItem {
  /** Must match the `id` on the target element in the list. */
  id: string
  label: string
}

export interface IndexGroup {
  heading: string
  items: IndexItem[]
}

interface ArticleIndexProps {
  groups: IndexGroup[]
  /** Called with the item id when a row is clicked. */
  onSelect: (id: string) => void
  title?: string
}

/**
 * Sticky desktop index rail for the confession pages. Lists items grouped by
 * chapter/part, scroll-spies the item currently in view, and jumps on click.
 * Hidden below `lg`. The list it indexes must render each target with a
 * matching `id` and enough `scroll-mt-*` to clear the fixed navbar.
 */
export default function ArticleIndex({
  groups,
  onSelect,
  title = "Índice",
}: ArticleIndexProps) {
  const ids = groups.flatMap((g) => g.items.map((i) => i.id))
  const idsKey = ids.join("|")
  const [activeId, setActiveId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ids.length) return
    // Track visible targets; the active one is whichever sits nearest the top.
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            visible.set(e.target.id, e.boundingClientRect.top)
          else visible.delete(e.target.id)
        }
        let best: string | null = null
        let bestTop = Infinity
        for (const [id, top] of visible) {
          if (top < bestTop) {
            bestTop = top
            best = id
          }
        }
        if (best) setActiveId(best)
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  // Keep the active row within the rail's own scroll area, without ever moving
  // the page scroll (so following a read never fights the reader).
  useEffect(() => {
    const nav = navRef.current
    if (!activeId || !nav) return
    const el = nav.querySelector<HTMLElement>(`[data-index-id="${activeId}"]`)
    if (!el) return
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    if (elRect.top < navRect.top) {
      nav.scrollBy({ top: elRect.top - navRect.top - 8, behavior: "smooth" })
    } else if (elRect.bottom > navRect.bottom) {
      nav.scrollBy({
        top: elRect.bottom - navRect.bottom + 8,
        behavior: "smooth",
      })
    }
  }, [activeId])

  if (!ids.length) return null

  return (
    <nav
      ref={navRef}
      aria-label={title}
      className="rail-scroll hidden lg:block sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1"
    >
      <p
        className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-4"
        style={{ fontSize: "var(--text-size-xs)" }}
      >
        {title}
      </p>
      <div className="space-y-5 border-l border-border">
        {groups.map((group) => (
          <div key={group.heading}>
            <p
              className="font-serif font-semibold bg-navy-700 text-primary-foreground px-4 py-2 mb-2 leading-snug"
              style={{ fontSize: "var(--text-size-base)" }}
            >
              {group.heading}
            </p>
            <ul>
              {group.items.map((item) => {
                const active = item.id === activeId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-index-id={item.id}
                      onClick={() => onSelect(item.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full text-left pl-4 -ml-px border-l-2 py-1 font-sans transition-colors duration-300 ${
                        active
                          ? "border-gold-500 text-navy-700 font-medium"
                          : "border-transparent text-muted-foreground hover:text-navy-700"
                      }`}
                      style={{ fontSize: "var(--text-size-sm)" }}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
