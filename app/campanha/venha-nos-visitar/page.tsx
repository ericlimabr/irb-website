import type { Metadata } from "next"
import Image from "next/image"
import Logo from "@/components/ui/Logo"
import ChurchMap from "@/components/layout/ChurchMap"
import {
  CHURCH_NAME,
  CHURCH_ADDRESS,
  CHURCH_ADDRESS_FULL,
  MORNING_LITURGY_TIME,
  AFTERNOON_LITURGY_TIME,
} from "@/const"
import { whatsappLink } from "@/utils/whatsapp"
import { mapsDirectionsUrl } from "@/utils/maps"

/**
 * Landing page da campanha de tráfego pago (Meta) — "venha nos visitar".
 *
 * Objetivo da campanha: Tráfego → visualização da página de destino. Esse
 * objetivo só fica disponível se a LP cumprir três critérios, todos atendidos
 * aqui: (1) horário do culto visível SEM ROLAR, (2) endereço com botão que abre
 * o Maps, (3) orientação sobre a primeira visita. O criativo do anúncio traz o
 * dia específico; a página mostra os cultos semanais de domingo.
 *
 * Sem nav/footer (ver app/campanha/layout.tsx): é uma página de conversão, o
 * clique pago não deve ter rota de fuga. WhatsApp é secundário — a campanha de
 * WhatsApp é separada. Página estática e leve de propósito: a métrica é a
 * visualização, que morre se o primeiro paint demorar.
 *
 * Rastreamento sai "de graça": "Como chegar" usa mapsDirectionsUrl() e o
 * WhatsApp usa whatsappLink() — as MESMAS URLs que os gatilhos de clique da GTM
 * já escutam, então disparam directions_click/FindLocation e
 * whatsapp_click/Contact sem tag nem código novo.
 *
 * noindex: é uma página de anúncio, fora do sitemap (app/sitemap.ts é manual);
 * o noindex evita concorrer com as páginas institucionais na busca orgânica.
 */

const HERO_PHOTO = "/galery/1/IMG-20260315-WA0008.jpg"

export const metadata: Metadata = {
  title: "Venha nos visitar neste domingo",
  description:
    "Cultos aos domingos, 09h e 17h, em Taguatinga · Brasília. Roupas normais, estacionamento na rua, visitantes bem-vindos. Veja como chegar.",
  alternates: { canonical: "/campanha/venha-nos-visitar" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Venha nos visitar neste domingo · Igreja Reformada de Brasília",
    description:
      "Cultos aos domingos, 09h e 17h, em Taguatinga · Brasília. Visitantes são bem-vindos.",
    images: [HERO_PHOTO],
  },
}

/** Orientação da primeira visita — responde ao constrangimento de quem nunca foi. */
const FIRST_VISIT = [
  {
    eyebrow: "À vontade",
    title: "Chegue e sente-se onde quiser",
    desc: "Você não precisa se cadastrar, avisar antes nem ser membro. Ninguém vai expor você: entre, sente-se e seja bem-vindo.",
  },
  {
    eyebrow: "Traje",
    title: "Roupas normais e decentes",
    desc: "Não há código de vestimenta. Venha com roupas comuns e decentes; o que importa é você estar aqui.",
  },
  {
    eyebrow: "Estacionamento",
    title: "Vagas na rua",
    desc: "Há estacionamento na rua, nas imediações do templo.",
  },
  {
    eyebrow: "Crianças",
    title: "Ficam com os pais",
    desc: "As crianças permanecem no culto junto dos pais e são bem-vindas.",
  },
]

/** Um par de botões reutilizado no herói e no rodapé de conversão. */
function CtaButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      <a
        href={mapsDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.1em] text-2xs px-8 py-4 bg-gold-500 text-navy-900 border border-gold-500 hover:bg-gold-400 hover:border-gold-400 transition-colors duration-500"
      >
        Como chegar →
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.1em] text-2xs px-8 py-4 bg-transparent border border-white/40 text-white hover:border-gold-400 hover:text-gold-400 transition-colors duration-500"
      >
        Falar no WhatsApp
      </a>
    </div>
  )
}

/** Faixa dos horários — o item que precisa estar visível sem rolar. */
function ServiceTimes({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const wrap =
    tone === "dark"
      ? "border-gold-500/40 bg-navy-900/60"
      : "border-border-subtle bg-surface"
  const label = tone === "dark" ? "text-white/60" : "text-text-secondary"
  const time = tone === "dark" ? "text-gold-400" : "text-gold-600"
  const title = tone === "dark" ? "text-white" : "text-navy-700"
  return (
    <div className={`inline-flex flex-wrap justify-center gap-x-10 gap-y-4 border px-8 py-5 ${wrap}`}>
      <div className="text-center">
        <p className={`font-mono uppercase tracking-[0.15em] text-3xs ${label}`}>
          Domingo · manhã
        </p>
        <p className={`font-serif text-3xl ${title}`}>
          Culto Matutino
        </p>
        <p className={`font-mono text-2xl ${time}`}>{MORNING_LITURGY_TIME}</p>
      </div>
      <div aria-hidden className="w-px self-stretch bg-current opacity-10" />
      <div className="text-center">
        <p className={`font-mono uppercase tracking-[0.15em] text-3xs ${label}`}>
          Domingo · tarde
        </p>
        <p className={`font-serif text-3xl ${title}`}>
          Culto Vespertino
        </p>
        <p className={`font-mono text-2xl ${time}`}>{AFTERNOON_LITURGY_TIME}</p>
      </div>
    </div>
  )
}

export default function VenhaNosVisitarPage() {
  return (
    <main className="bg-surface">
      {/* HERO — tudo o essencial (horário, endereço, CTA) acima da dobra */}
      <section
        className="relative flex min-h-[80dvh] items-center justify-center overflow-hidden px-6 py-16"
        style={{
          background: `linear-gradient(135deg, var(--navy-900), var(--navy-700) 40%, var(--navy-600))`,
        }}
      >
        {/* Foto da congregação como presença ambiente (fantasma), idioma dos
            heróis do site. object-bottom corta o teto vazio no topo e mantém as
            pessoas (e as crianças na base). A mesma foto aparece com clareza
            total na seção logo abaixo. */}
        <div aria-hidden className="absolute inset-0">
          <Image
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
            style={{ opacity: 0.28 }}
          />
          {/* Scrim navy: garante contraste do texto sobre a foto */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, color-mix(in srgb, var(--navy-900) 55%, transparent) 0%, color-mix(in srgb, var(--navy-900) 30%, transparent) 40%, color-mix(in srgb, var(--navy-900) 80%, transparent) 100%)`,
            }}
          />
        </div>

        {/* Textura de grade */}
        <div className="texture-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <Logo variant="mark" tone="gold" height={56} priority className="mb-6" />
          <p className="font-mono uppercase tracking-[0.2em] text-3xs text-gold-400 mb-5">
            {CHURCH_NAME} · Taguatinga
          </p>
          <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-8">
            Venha adorar conosco
            <br />
            <em className="text-gold-400 not-italic sm:italic">neste domingo</em>
          </h1>

          <ServiceTimes tone="dark" />

          <p className="font-sans text-white/70 text-sm mt-6 max-w-md">
            {CHURCH_ADDRESS.street} · {CHURCH_ADDRESS.district},{" "}
            {CHURCH_ADDRESS.city} · {CHURCH_ADDRESS.state}
          </p>

          <CtaButtons className="mt-8 w-full sm:w-auto justify-center" />

          <p className="font-sans text-white/50 text-xs mt-6">
            Visitantes são bem-vindos. Não é preciso avisar nem ser membro.
          </p>
        </div>
      </section>

      {/* PRIMEIRA VISITA — desarma o constrangimento de quem nunca foi */}
      <section className="bg-surface px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="section-tag mb-6">Primeira vez?</p>
          <h2
            className="font-serif text-navy-700 mb-4"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Fique tranquilo. Você não vai se sentir deslocado.
          </h2>
          <p className="font-sans text-text-secondary max-w-2xl mb-14">
            Sabemos que entrar pela primeira vez numa igreja pode intimidar: não
            saber onde sentar, como se vestir, se alguém vai abordar você. Aqui
            nada disso acontece. Veja como é.
          </p>

          <div className="grid gap-px bg-border-subtle sm:grid-cols-2">
            {FIRST_VISIT.map((item) => (
              <div key={item.eyebrow} className="bg-surface p-8">
                <p className="font-mono uppercase tracking-[0.15em] text-3xs text-gold-600 mb-3">
                  {item.eyebrow}
                </p>
                <h3 className="font-serif text-navy-700 text-2xl mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-text-secondary text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOTO REAL — a congregação mostrada com clareza, sem scrim */}
      <section className="bg-surface px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl">
          {/* aspect-[16/9] + object-bottom: corta o teto vazio no topo e
              mantém as pessoas (e as crianças na base) inteiras. */}
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-gold-500/50 shadow-lg">
            <Image
              src={HERO_PHOTO}
              alt="Congregação da Igreja Reformada de Brasília reunida, com famílias e crianças, após o culto de domingo."
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover object-bottom"
            />
          </div>
          <p className="mt-4 text-center font-mono uppercase tracking-[0.15em] text-3xs text-text-secondary">
            Nossa congregação · um domingo em {CHURCH_ADDRESS.city}
          </p>
        </div>
      </section>

      {/* ONDE ESTAMOS — endereço + rota */}
      <section className="texture-linen bg-surface-alt px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-tag mb-6">Onde estamos</p>
          <h2
            className="font-serif text-navy-700 mb-4"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Como chegar
          </h2>
          <p className="font-sans text-text-secondary mb-8">{CHURCH_ADDRESS_FULL}</p>

          <ChurchMap className="mb-8" heightClassName="h-[320px] md:h-[420px]" />

          <a
            href={mapsDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.1em] text-2xs px-8 py-4 bg-navy-700 text-white border border-navy-700 hover:bg-gold-500 hover:border-gold-500 hover:text-navy-900 transition-colors duration-500"
          >
            Abrir rota no Maps →
          </a>
        </div>
      </section>

      {/* CONVERSÃO FINAL */}
      <section
        className="texture-hatch relative overflow-hidden px-6 py-20 md:py-28"
        style={{ background: `var(--navy-700)` }}
      >
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="font-mono uppercase tracking-[0.2em] text-3xs text-gold-400 mb-6">
            Esperamos por você
          </p>
          <h2 className="font-serif text-white text-3xl md:text-5xl leading-tight mb-10">
            Domingo é dia de adorar.
            <br />
            <em className="text-gold-400 not-italic md:italic">Venha nos visitar.</em>
          </h2>
          <ServiceTimes tone="dark" />
          <CtaButtons className="mt-10 w-full sm:w-auto justify-center" />
        </div>
      </section>

      {/* Rodapé mínimo — sem navegação, para não abrir rota de fuga */}
      <footer className="bg-navy-900 px-6 py-8 text-center">
        <p className="font-mono uppercase tracking-[0.15em] text-3xs text-white/50">
          {CHURCH_NAME} · {CHURCH_ADDRESS.district}, {CHURCH_ADDRESS.city}
        </p>
      </footer>
    </main>
  )
}
