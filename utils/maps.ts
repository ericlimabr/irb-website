import { CHURCH_ADDRESS_QUERY, CHURCH_COORDS } from "@/const"

/** Coordinates pin exactly; the address is only a fallback while they're unset. */
const target = () => CHURCH_COORDS || CHURCH_ADDRESS_QUERY

/**
 * Embeddable map for the church. The `output=embed` form needs no API key, so
 * there is no billing account to keep alive and nothing to rotate.
 */
export function mapsEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(target())}&output=embed`
}

/** Opens turn-by-turn directions in whichever maps app the visitor uses. */
export function mapsDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target())}`
}
