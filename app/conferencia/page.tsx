/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import InscricaoForm from "@/components/pages/conferencia/InscricaoForm"
import BarraInscricao from "@/components/pages/conferencia/BarraInscricao"
import DeslizaAteAncora from "@/components/pages/conferencia/DeslizaAteAncora"
import { website_config_variables } from "@/config"
import {
  CHURCH_ADDRESS,
  CHURCH_EMAIL,
  CHURCH_NAME,
  CONFERENCE_AUDIENCE,
  CONFERENCE_DATES_LABEL,
  CONFERENCE_EDITION,
  CONFERENCE_LECTURES,
  CONFERENCE_PATH,
  CONFERENCE_PRICE_LABEL,
  CONFERENCE_SCHEDULE,
  CONFERENCE_SPEAKERS,
  CONFERENCE_SUBTITLE,
  CONFERENCE_THEME,
  CONFERENCE_TITLE,
} from "@/const"
import "./conferencia.css"

/**
 * 2ª Conferência Reformada — a página do evento, com inscrição e Pix.
 *
 * É a PORTA do mockup ~/Documentos/igreja/conferencia/MOCKUP-CONFERENCIA.html,
 * não uma releitura: o desenho, a marcação e os nomes de classe são os dele, e
 * o CSS está em ./conferencia.css, preso ao embrulho `.conf`. Quem comparar os
 * dois lado a lado tem que ver a mesma página.
 *
 * O texto vem de const/conferencia.ts, e a inscrição de
 * components/pages/conferencia/InscricaoForm.tsx (cliente) mais
 * app/actions/inscricao.ts (servidor). O resto é estático.
 *
 * As imagens são <img> cruas, como no mockup: o CSS posiciona a marca de fundo,
 * a moldura dourada atrás da foto do preletor e as fotos do local contando com
 * um <img> direto, e o <Image> do Next embrulharia tudo em outra caixa.
 *
 * O que NÃO veio do mockup: a tarja de "mockup não publicado" com a lista do
 * que falta confirmar, que é conversa interna. Essa lista está em
 * docs/conferencia-inscricoes.md.
 */

const CAPA = "/conferencia/capa.jpg"
const MAPA_PINO = "-15.8343651,-48.0508161"

const DESCRICAO =
  `${CONFERENCE_DATES_LABEL}, em ${CHURCH_ADDRESS.district}. Duas palestras no sábado ` +
  `e a pregação do culto de domingo, sobre a doutrina da criação. Inscrição por ` +
  `${CONFERENCE_PRICE_LABEL} por adulto, de 12 anos em diante.`

export const metadata: Metadata = {
  title: `${CONFERENCE_EDITION} · ${CONFERENCE_TITLE}`,
  description: DESCRICAO,
  alternates: { canonical: CONFERENCE_PATH },
  // Enquanto a bandeira estiver desligada a página existe, abre por link e
  // pode ser conferida, mas não pede indexação e fica fora do sitemap.
  robots: {
    index: website_config_variables.conferencia.active,
    follow: true,
  },
  openGraph: {
    title: `${CONFERENCE_EDITION} · ${CONFERENCE_TITLE}`,
    description: DESCRICAO,
    url: CONFERENCE_PATH,
    type: "website",
    images: [
      {
        url: CAPA,
        width: 1200,
        height: 628,
        alt: `${CONFERENCE_TITLE}, ${CONFERENCE_EDITION}, ${CONFERENCE_DATES_LABEL}`,
      },
    ],
  },
}

export default function ConferenciaPage() {
  return (
    <div className="conf">
      <header className="heroi" id="heroi">
        <img className="marca-fundo" src="/logo/logo-gold.svg" alt="" />
        <div className="wrap">
          <img className="selo" src="/logo/logo-gold.svg" alt={CHURCH_NAME} />
          <div className="lugar-data">
            <span>
              {CHURCH_ADDRESS.district}, {CHURCH_ADDRESS.city}
            </span>
            <b>·</b>
            <span>{CONFERENCE_DATES_LABEL}</span>
            <b>·</b>
            <span>
              {CONFERENCE_PRICE_LABEL} por adulto, a partir de 12 anos
            </span>
          </div>
          <p className="nome-evento">{CONFERENCE_EDITION}</p>
          <h1>
            O Livro <em>da Criação</em>
          </h1>
          <p className="sub-tema">{CONFERENCE_SUBTITLE}</p>
          <p className="publico">
            Duas palestras no sábado e a pregação do culto de domingo, sobre a
            doutrina da criação. Abertas a membros, visitantes e a quem tem
            dúvidas sobre a fé. A inscrição é de {CONFERENCE_PRICE_LABEL} por
            adulto, a partir de 12 anos, e crianças de até 11 anos não pagam.
          </p>
          <div className="botoes">
            <a className="bt" href="#inscricao">
              Quero me inscrever
            </a>
            <a className="bt vazio" href={`${CONFERENCE_PATH}/agenda`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="5" width="18" height="16" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>{" "}
              Adicionar à minha agenda
            </a>
          </div>
        </div>
      </header>

      <section className="secao tema">
        <div className="wrap">
          <p className="olho">O tema</p>
          <h2 className="titulo">{CONFERENCE_THEME.heading}</h2>
          <p className="intro">{CONFERENCE_THEME.intro}</p>
          <blockquote className="citacao">
            <p>{CONFERENCE_THEME.quote}</p>
            <footer>{CONFERENCE_THEME.quoteSource}</footer>
          </blockquote>
          <div className="tres-passos">
            {CONFERENCE_THEME.steps.map((passo) => (
              <div className="passo" key={passo.term}>
                <b>{passo.term}</b>
                <span>{passo.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao palestras">
        <div className="wrap">
          <p className="olho claro">As três palestras</p>
          <h2 className="titulo">O que vai ser ensinado</h2>
          <p className="intro">
            As duas primeiras acontecem no sábado, na conferência. A terceira é
            a pregação do culto matutino de domingo, às 09h00.
          </p>

          {CONFERENCE_LECTURES.map((p) => (
            <article className="cartao" key={p.number}>
              <div className="num">{p.number}</div>
              <div>
                <h3>{p.title}</h3>
                <p className="diz">{p.says}</p>
                <p className="tese">{p.thesis}</p>
                <div className="pe">
                  <span>{p.when}</span>
                  <span>{p.speaker}</span>
                  {p.tag && <span className="etiqueta">{p.tag}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="secao preletores">
        <div className="wrap">
          <p className="olho">Quem ensina</p>
          <h2 className="titulo">
            Dois preletores, duas palestras e uma pregação
          </h2>
          <div className="dupla">
            {CONFERENCE_SPEAKERS.map((pessoa) => (
              <article className="pessoa" key={pessoa.name}>
                <div className="moldura">
                  <div
                    className="foto"
                    role="img"
                    aria-label={pessoa.name}
                    style={{ backgroundImage: `url(${pessoa.photo})` }}
                  />
                </div>
                <h3>{pessoa.name}</h3>
                <p className="cargo">{pessoa.role}</p>
                <p className="igreja">{pessoa.church}</p>
                <p className="bio">{pessoa.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="secao grade-dia">
        <div className="wrap">
          <p className="olho">Programação</p>
          <h2 className="titulo">Como são os dois dias</h2>
          <p className="intro">
            Horário de Brasília. O intervalo e a mesa redonda são os blocos que
            absorvem eventuais atrasos, então as palestras começam na hora.
          </p>

          {CONFERENCE_SCHEDULE.map((dia) => (
            <div key={dia.day}>
              <div className="dia-rotulo">
                <span className="d">{dia.day}</span>
                <span className="m">{dia.dayLabel}</span>
              </div>
              {dia.blocks.map((bloco) => (
                <div
                  className={bloco.highlight ? "bloco destaque" : "bloco"}
                  key={`${dia.day}-${bloco.time}`}
                >
                  <div className="hora">{bloco.time}</div>
                  <div>
                    <b>{bloco.title}</b>
                    {bloco.detail && <small>{bloco.detail}</small>}
                  </div>
                  <div className="dur">{bloco.length}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="secao quem">
        <div
          className="fundo"
          style={{ backgroundImage: "url(/conferencia/congregacao.jpg)" }}
        />
        <div className="wrap">
          <p className="olho claro">Para quem é</p>
          <h2 className="titulo">Quem pode vir</h2>
          <div className="lista-quem">
            {CONFERENCE_AUDIENCE.map((item) => (
              <div key={item.term}>
                <b>{item.term}</b>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao inscricao" id="inscricao">
        <div className="wrap">
          <p className="olho">Inscrição</p>
          <h2 className="pergunta">Preciso me inscrever para assistir?</h2>
          <p className="resposta">
            Sim, e leva menos de um minuto. A inscrição custa{" "}
            <b>{CONFERENCE_PRICE_LABEL} por adulto, a partir de 12 anos</b>, um
            valor simbólico que ajuda no café, no material e na estrutura dos
            dois dias. Crianças de até 11 anos não pagam nada. Assim que você
            enviar, o Pix aparece aqui na tela com o valor já calculado, e o
            mesmo código chega no seu e-mail.
          </p>
          <InscricaoForm />
        </div>
      </section>

      <section className="secao local">
        <div className="wrap">
          <p className="olho">Onde é</p>
          <h2 className="titulo">{CHURCH_NAME}</h2>
          <div className="caixa">
            <div>
              <p className="end">
                {CHURCH_ADDRESS.street}
                <br />
                {CHURCH_ADDRESS.district}, {CHURCH_ADDRESS.city},{" "}
                {CHURCH_ADDRESS.state}
              </p>
              <p className="det">
                CEP {CHURCH_ADDRESS.zip}. Há estacionamento na rua, ali em
                volta. Não existe código de vestimenta: venha com roupas comuns.
              </p>
              <p className="det">
                A terceira mensagem acontece dentro do culto matutino de
                domingo, às 09h00, e não em horário à parte. A igreja também se
                reúne às 17h00, e a Escola Dominical é às 10h20.
              </p>
              <a
                className="bt escuro"
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAPA_PINO}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Como chegar
              </a>
            </div>
            <div className="mapa">
              {/* A coordenada fixa o pino: nesta coluna estreita o embed por
                  nome abre o cartão da ficha e empurra o marcador para fora. */}
              <iframe
                src={`https://www.google.com/maps?q=${MAPA_PINO}&z=17&output=embed`}
                title={`Mapa · ${CHURCH_NAME}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="det" style={{ marginTop: 10 }}>
                O pino marca o local da igreja.{" "}
                <a
                  href="https://maps.app.goo.gl/CCnYsFmzYK7Y4mC49"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--gold-600)" }}
                >
                  Ver o perfil da igreja no Google Maps
                </a>
                .
              </p>
            </div>
          </div>

          <p className="olho" style={{ marginTop: 64 }}>
            Para reconhecer na chegada
          </p>
          <h3
            className="titulo"
            style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)" }}
          >
            Como é o lugar por fora
          </h3>
          <div className="fotos-local">
            <figure>
              <img
                src="/conferencia/entrada-hotel.jpg"
                alt="Entrada do Comfort Hotel, prédio onde a igreja se reúne"
              />
              <figcaption>
                A entrada do hotel, que é a referência da rua
              </figcaption>
            </figure>
            <figure>
              <img
                src="/conferencia/placa-hotel.jpg"
                alt="Placa do Comfort Hotel na entrada"
              />
              <figcaption>
                A placa do Comfort Hotel, para você não passar direto
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <footer className="rodape">
        <img src="/logo/logo-navy.svg" alt="" />
        <b>{CHURCH_NAME}</b>
        <p>
          {CONFERENCE_EDITION} · {CONFERENCE_DATES_LABEL}
        </p>
        <p>{CHURCH_EMAIL}</p>
      </footer>

      <BarraInscricao />
      <DeslizaAteAncora />
    </div>
  )
}
