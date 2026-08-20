"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"

/**
 * Botão "Compartilhar" da página /links.
 *
 * Usa a Web Share API nativa (folha de compartilhamento do sistema, com preview
 * gerado pelas tags Open Graph da própria URL — as mesmas do site). Onde não há
 * Web Share (desktops), cai para copiar o link e mostra um "Copiado!" breve.
 */
export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : url

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Igreja Reformada de Brasília",
          text: "Nossos links e recursos",
          url: shareUrl,
        })
      } catch {
        // Usuário cancelou a folha de compartilhamento — silencioso.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard indisponível — nada a fazer.
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Compartilhar esta página"
      className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.1em] text-gold-400 hover:text-gold-500 transition-colors duration-500 text-fs-9"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Copiado!" : "Compartilhar"}
    </button>
  )
}
