import { CHURCH_WHATSAPP, CHURCH_WHATSAPP_GREETING } from "@/const"

/**
 * Builds a wa.me link to the church's number, optionally prefilling the first
 * message so whoever answers knows what the contact is about.
 */
export function whatsappLink(message: string = CHURCH_WHATSAPP_GREETING) {
  return `https://wa.me/${CHURCH_WHATSAPP}?text=${encodeURIComponent(message)}`
}
