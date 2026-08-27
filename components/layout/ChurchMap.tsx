import { mapsEmbedUrl } from "@/utils/maps"
import { CHURCH_NAME, CHURCH_ADDRESS_FULL } from "@/const"

interface ChurchMapProps {
  /** Extra classes on the bordered wrapper — spacing, etc. */
  className?: string
  /** Height utility classes for the iframe. */
  heightClassName?: string
}

/**
 * Mapa embutido do templo — fonte única do markup.
 *
 * A localização vem de `mapsEmbedUrl()` (utils/maps.ts → CHURCH_ADDRESS_QUERY /
 * CHURCH_COORDS), então o pino se auto-corrige quando o Google atualiza, sem
 * mexer aqui. `output=embed` dispensa chave de API (nada de billing a manter).
 * `loading="lazy"` evita competir com o primeiro paint.
 *
 * Usado no /contato e na landing page da campanha. Só a altura muda entre eles,
 * via `heightClassName`.
 */
export default function ChurchMap({
  className = "",
  heightClassName = "h-[380px] md:h-[460px]",
}: ChurchMapProps) {
  return (
    <div className={`border border-border-subtle ${className}`}>
      <iframe
        src={mapsEmbedUrl()}
        title={`Mapa · ${CHURCH_NAME}, ${CHURCH_ADDRESS_FULL}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={`block w-full ${heightClassName}`}
      />
    </div>
  )
}
