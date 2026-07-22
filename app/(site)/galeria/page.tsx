import type { Metadata } from "next"
import Masthead from "@/components/layout/Masthead"
import Section from "@/components/layout/Section"
import GalleryGrid from "@/components/features/gallery/GalleryGrid"
import ScrollToTop from "@/components/ui/ScrollToTop"
import { readGalleryAlbum } from "@/utils/gallery"

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Registros fotográficos da vida da Igreja Reformada de Brasília — cultos, estudos e comunhão.",
}

export default function GaleriaPage() {
  const photos = readGalleryAlbum("1")

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Galeria"
        title={
          <>
            Vida da
            <br />
            <em className="text-gold-400">Congregação.</em>
          </>
        }
        subtitle="Registros da vida comum da igreja — o culto, o estudo das Escrituras e a comunhão dos santos."
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {[`${photos.length} Fotografias`, "Brasília, DF"].map((s) => (
            <span
              key={s}
              className="font-mono uppercase tracking-[0.1em] text-gold-400/60"
              style={{ fontSize: "9px" }}
            >
              {s}
            </span>
          ))}
        </div>
      </Masthead>

      <Section bg="surface">
        <GalleryGrid photos={photos} />
      </Section>

      <ScrollToTop />
    </div>
  )
}
