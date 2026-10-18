"use client"

import { useEffect, useState } from "react"
import { CONFERENCE_DATES_SHORT, CONFERENCE_PRICE_LABEL } from "@/const"

/**
 * A barra presa no pé da tela, do mockup. Só aparece depois que o herói sai de
 * vista, senão repetiria o botão que já está na primeira tela.
 *
 * Observa o #heroi por IntersectionObserver, que não custa evento de rolagem.
 * Sem o elemento, a barra simplesmente não sobe.
 */
export default function BarraInscricao() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const heroi = document.getElementById("heroi")
    if (!heroi) return
    const obs = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(heroi)
    return () => obs.disconnect()
  }, [])

  return (
    <div className={visivel ? "presa on" : "presa"} aria-hidden={!visivel}>
      <div className="txt">
        <b>{CONFERENCE_DATES_SHORT}</b> · {CONFERENCE_PRICE_LABEL} por adulto
      </div>
      <a className="bt" href="#inscricao" tabIndex={visivel ? 0 : -1}>
        Inscrever-me
      </a>
    </div>
  )
}
