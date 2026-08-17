import { FAQ_ITEMS } from "@/const"

/**
 * Acordeão de FAQ com <details>/<summary> nativos: sem JavaScript de cliente e
 * com o texto das respostas SEMPRE presente no DOM (apenas visualmente
 * recolhido). Isso é o ideal para SEO e para IAs, que leem o HTML renderizado.
 */
export default function FaqAccordion() {
  return (
    <div className="border-y border-border-subtle divide-y divide-border-subtle">
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 list-none [&::-webkit-details-marker]:hidden">
            <h2 className="font-serif text-navy-700 text-xl">{item.question}</h2>
            <span
              aria-hidden
              className="font-mono text-gold-500 text-2xl leading-none transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 font-sans text-muted-foreground leading-relaxed">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
