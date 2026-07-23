import type { Metadata } from "next"
import {
  Cormorant_Garamond,
  Raleway,
  JetBrains_Mono,
  Tangerine,
} from "next/font/google"
import "./globals.css"
import { CHURCH_SITE_URL } from "@/const"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
})

export const metadata: Metadata = {
  // OG/Twitter image URLs are absolute, resolved against this base, so it must
  // be a domain that actually serves the site or WhatsApp/etc. get a 404 and
  // show no preview. Order: explicit override, then Vercel's live production
  // domain (the *.vercel.app today, and our custom domain once it's connected),
  // then the custom domain as a static default.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : CHURCH_SITE_URL),
  ),
  title: {
    default: "Igreja Reformada de Brasília",
    // Pages that set their own title get it suffixed with the church name.
    template: "%s · Igreja Reformada de Brasília",
  },
  description:
    "Uma congregação fundada na Palavra, formada pela confissão histórica e comprometida com a adoração bíblica em Brasília.",
  openGraph: {
    siteName: "Igreja Reformada de Brasília",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${cormorantGaramond.variable} ${raleway.variable} ${jetBrainsMono.variable} ${tangerine.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
