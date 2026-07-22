import type { Metadata } from "next"
import {
  Cormorant_Garamond,
  Raleway,
  JetBrains_Mono,
  Tangerine,
} from "next/font/google"
import "./globals.css"

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
  // Without this, OG and Twitter image URLs resolve against localhost and no
  // preview renders when a link is shared.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://irb.org.br",
  ),
  title: {
    default: "Igreja Reformada de Brasília",
    // Pages that set their own title get it suffixed with the church name.
    template: "%s · Igreja Reformada de Brasília",
  },
  description:
    "Uma congregação fundada na Palavra, formada pela confissão histórica e comprometida com a adoração regulada em Brasília.",
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
