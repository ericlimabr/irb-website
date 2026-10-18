"use client"

import { useEffect } from "react"

/**
 * Faz os botões de "#inscricao" deslizarem até a seção, em vez de saltarem.
 *
 * Dois incômodos resolvidos de uma vez. O salto: o navegador pula a página de
 * um quadro para o outro e a pessoa perde a noção de para onde foi. E a
 * marcação na barra de endereço: o `#inscricao` ficava colado na URL, aparecia
 * no link copiado e sujava o histórico, um passo do "voltar" por clique.
 *
 * É um ouvinte só, no documento, e vale para todo link de âncora da página,
 * inclusive os que vierem depois. Sem JavaScript, o `href` continua levando
 * até a seção do jeito antigo: nada depende daqui para funcionar.
 */
export default function DeslizaAteAncora() {
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      // Clique do meio, Ctrl e Cmd abrem em outra aba: não é nossa conta.
      if (
        evento.defaultPrevented ||
        evento.button !== 0 ||
        evento.metaKey ||
        evento.ctrlKey ||
        evento.shiftKey ||
        evento.altKey
      ) {
        return
      }

      const alvo = evento.target
      if (!(alvo instanceof Element)) return
      const link = alvo.closest("a")
      if (!link) return

      // Só âncora desta mesma página.
      const href = link.getAttribute("href") ?? ""
      if (!href.startsWith("#") || href === "#") return

      const destino = document.getElementById(href.slice(1))
      if (!destino) return

      evento.preventDefault()

      const semAnimacao = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      destino.scrollIntoView({
        behavior: semAnimacao ? "auto" : "smooth",
        block: "start",
      })

      // Quem navega por teclado precisa do foco junto, senão o próximo Tab
      // continua lá no topo. `preventScroll` para não atropelar o deslize.
      if (!destino.hasAttribute("tabindex")) destino.tabIndex = -1
      destino.focus({ preventScroll: true })
    }

    document.addEventListener("click", aoClicar)
    return () => document.removeEventListener("click", aoClicar)
  }, [])

  return null
}
