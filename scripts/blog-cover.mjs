// Gera a capa de um post do blog (1200x630, formato OG) a partir de 1 a 3
// imagens da galeria, com fusão por gradiente, tom navy/gold da marca e o logo
// dourado centralizado na base.
//
// Uso:
//   node scripts/blog-cover.mjs <slug> <img1> [img2] [img3]
//
// Exemplo (o post "O que é uma igreja reformada?"):
//   node scripts/blog-cover.mjs o-que-e-uma-igreja-reformada \
//     public/galery/1/IMG-20260309-WA0005.jpg \
//     public/galery/1/IMG-20260312-WA0073.jpg \
//     public/galery/1/IMG-20260312-WA0084.jpg
//   (com 3 imagens, a do MEIO é a dominante do centro; as outras vão às laterais)
//
// Saída: public/blog/<slug>-cover.webp
// Ver docs/blog-posts.md.

import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const W = 1200
const H = 630
const NAVY = { r: 0, g: 35, b: 71, alpha: 1 }
const LOGO = path.join(ROOT, "public/logo/logo-gold.svg")

const [slug, ...imgs] = process.argv.slice(2)
if (!slug || imgs.length < 1 || imgs.length > 3) {
  console.error("Uso: node scripts/blog-cover.mjs <slug> <img1> [img2] [img3]")
  process.exit(1)
}
const OUT = path.join(ROOT, `public/blog/${slug}-cover.webp`)
const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p))

// Máscara de gradiente linear (branco->transparente) para esfumar bordas.
function grad(w, h, stops) {
  const s = stops
    .map(([o, op]) => `<stop offset="${o}" stop-color="#fff" stop-opacity="${op}"/>`)
    .join("")
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">${s}</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  )
}

async function panel(file, w, h, mask) {
  const img = await sharp(abs(file))
    .resize(w, h, { fit: "cover", position: "attention" })
    .toBuffer()
  if (!mask) return img
  return sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer()
}

// Monta as camadas de foto conforme o número de imagens.
async function buildBase() {
  const layers = []
  if (imgs.length === 1) {
    layers.push({ input: await panel(imgs[0], W, H), left: 0, top: 0 })
  } else if (imgs.length === 2) {
    const w = 720
    const L = await panel(imgs[0], w, H, grad(w, H, [[0, 1], [0.6, 1], [1, 0]]))
    const R = await panel(imgs[1], w, H, grad(w, H, [[0, 0], [0.4, 1], [1, 1]]))
    layers.push({ input: L, left: 0, top: 0 }, { input: R, left: W - w, top: 0 })
  } else {
    // 3 imagens: [0] esquerda, [1] centro (dominante, por cima), [2] direita.
    const Lw = 720, Rw = 720, Cw = 640
    const L = await panel(imgs[0], Lw, H, grad(Lw, H, [[0, 1], [0.58, 1], [1, 0]]))
    const R = await panel(imgs[2], Rw, H, grad(Rw, H, [[0, 0], [0.28, 1], [1, 1]]))
    const C = await panel(imgs[1], Cw, H, grad(Cw, H, [[0, 0], [0.3, 1], [0.7, 1], [1, 0]]))
    layers.push(
      { input: L, left: 0, top: 0 },
      { input: R, left: W - Rw, top: 0 },
      { input: C, left: Math.round((W - Cw) / 2), top: 0 },
    )
  }
  return sharp({ create: { width: W, height: H, channels: 4, background: NAVY } })
    .composite(layers)
    .png()
    .toBuffer()
}

let merged = await buildBase()

// Unifica o tom das fotos (dessatura leve, escurece de leve).
merged = await sharp(merged).modulate({ saturation: 0.72, brightness: 0.97 }).toBuffer()

// Camadas de marca: gradiente navy + brilho dourado embaixo + vinheta.
const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nv" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#002347" stop-opacity="0.45"/>
      <stop offset="0.4" stop-color="#002347" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#000d1a" stop-opacity="0.66"/>
    </linearGradient>
    <radialGradient id="gd" cx="50%" cy="86%" r="62%">
      <stop offset="0" stop-color="#C5A059" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#C5A059" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vg" cx="50%" cy="50%" r="75%">
      <stop offset="0.58" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.34"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#nv)"/>
  <rect width="${W}" height="${H}" fill="url(#gd)"/>
  <rect width="${W}" height="${H}" fill="url(#vg)"/>
</svg>`)
merged = await sharp(merged).composite([{ input: overlay }]).png().toBuffer()

// Logo dourada centralizada na base, com halo escuro para contraste.
const logoH = 160
const logo = await sharp(LOGO, { density: 300 }).resize({ height: logoH }).png().toBuffer()
const { width: logoW } = await sharp(logo).metadata()
const logoLeft = Math.round((W - logoW) / 2)
const logoTop = H - logoH - 46
const haloW = logoW + 240
const haloH = logoH + 170
const halo = Buffer.from(`<svg width="${haloW}" height="${haloH}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="h" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000d1a" stop-opacity="0.5"/><stop offset="1" stop-color="#000d1a" stop-opacity="0"/></radialGradient></defs><rect width="${haloW}" height="${haloH}" fill="url(#h)"/></svg>`)

await sharp(merged)
  .composite([
    { input: halo, left: Math.round(logoLeft + logoW / 2 - haloW / 2), top: Math.round(logoTop + logoH / 2 - haloH / 2) },
    { input: logo, left: logoLeft, top: logoTop },
  ])
  .webp({ quality: 82 })
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`OK: ${path.relative(ROOT, OUT)} (${meta.width}x${meta.height})`)
