import Section from "@/components/layout/Section"
import { IRBButton } from "@/components/layout/Cards"

type ConfessionKey = "belga" | "heidelberg" | "dort"

const CONFESSIONS: Record<ConfessionKey, { path: string; label: string }> = {
  belga: { path: "/confissao-belga", label: "Confissão Belga" },
  heidelberg: { path: "/catecismo", label: "Catecismo de Heidelberg" },
  dort: { path: "/canones-de-dort", label: "Cânones de Dort" },
}

/**
 * Bloco de links entre as três confissões (topical clustering): cada página de
 * confissão deixa de ser um beco sem saída e aponta para as irmãs e para o hub
 * /confissoes. Ajuda o crawler a distribuir link equity e o leitor a navegar.
 */
export default function RelatedConfessions({
  current,
}: {
  current: ConfessionKey
}) {
  const others = (Object.keys(CONFESSIONS) as ConfessionKey[]).filter(
    (key) => key !== current,
  )

  return (
    <Section bg="surface-alt">
      <div className="text-center max-w-2xl mx-auto">
        <p className="mono-label mb-4">Continue explorando</p>
        <h2
          className="font-serif text-navy-700 mb-8"
          style={{ fontSize: "var(--text-size-3xl)" }}
        >
          As Três Formas de Unidade
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {others.map((key) => (
            <IRBButton key={key} href={CONFESSIONS[key].path} variant="secondary">
              {CONFESSIONS[key].label}
            </IRBButton>
          ))}
          <IRBButton href="/confissoes" variant="primary">
            Ver todas as confissões
          </IRBButton>
        </div>
      </div>
    </Section>
  )
}
