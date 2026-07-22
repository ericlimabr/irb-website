import "server-only"
import fs from "node:fs"
import path from "node:path"

/** Album folders live under public/galery/<album>. */
const GALLERY_ROOT = path.join(process.cwd(), "public", "galery")

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i

export interface GalleryPhoto {
  /** Public URL, e.g. /galery/1/IMG-20260312-WA0083.jpg */
  src: string
}

/**
 * Reads an album off disk. Runs on the server at build time, so dropping files
 * into the folder is enough to publish them — there is no manifest to keep in
 * sync.
 *
 * Deliberately date-less. EXIF was stripped from these files (most arrived
 * through WhatsApp) and the date embedded in a WhatsApp filename is when the
 * file was received, not when the photograph was taken. No trustworthy capture
 * date exists, so the gallery does not claim one. Order is filename order.
 */
export function readGalleryAlbum(album: string): GalleryPhoto[] {
  const dir = path.join(GALLERY_ROOT, album)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort()
    .map((file) => ({ src: `/galery/${album}/${file}` }))
}
