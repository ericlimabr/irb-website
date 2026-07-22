"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import InnerNav from "@/components/layout/InnerNav"
import { PAGE_TITLES } from "@/const"

/**
 * Shows a back bar only when the visitor reached this page by clicking a link
 * inside another page's content — never when they used the navbar, the footer,
 * or the bar itself, and never on a fresh load or a pasted URL.
 *
 * Chrome is identified by the data-chrome-link attribute on the navbar, the
 * mobile drawer, the footer and this bar's own wrapper, so any anchor nested
 * inside them counts as chrome navigation. Mounted once in the site layout.
 */
export default function BackBar() {
  const pathname = usePathname()

  /** Whether the last anchor the visitor clicked belonged to the chrome. */
  const [fromChrome, setFromChrome] = useState(false)

  /**
   * The route we are on and the one to return to. Adjusted during render —
   * React's documented pattern for responding to a changed value — rather than
   * in an effect, which would cascade an extra render.
   */
  const [tracked, setTracked] = useState<{
    path: string
    backTo: string | null
  }>({ path: pathname, backTo: null })

  if (tracked.path !== pathname) {
    setTracked({
      path: pathname,
      // A fresh load starts with path === pathname, so reaching here always
      // means a real in-app navigation.
      backTo: fromChrome ? null : tracked.path,
    })
  }

  // Recorded on every anchor click, so the value never goes stale.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a")
      if (!anchor) return
      setFromChrome(Boolean(anchor.closest("[data-chrome-link]")))
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  if (!tracked.backTo || pathname === "/") return null

  return (
    // Marked as chrome so returning does not itself raise another back bar.
    <div data-chrome-link>
      <InnerNav
        title={PAGE_TITLES[pathname] ?? ""}
        backHref={tracked.backTo}
        backLabel={PAGE_TITLES[tracked.backTo] ?? "Voltar"}
        // Fixed rather than sticky: in normal flow it would sit at the top of
        // the document, hidden behind the fixed navbar until the page scrolled.
        className="fixed top-14 left-0 right-0 z-40"
      />
    </div>
  )
}
