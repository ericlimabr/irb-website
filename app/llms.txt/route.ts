import { SITE_URL } from "@/utils/siteUrl"
import {
  CHURCH_NAME,
  CHURCH_ADDRESS_FULL,
  CHURCH_WHATSAPP,
  MORNING_LITURGY_TIME,
  AFTERNOON_LITURGY_TIME,
  WEEKLY_STUDY_TIME,
  FAQ_ITEMS,
} from "@/const"

// Gerado no build — conteúdo estático, sem custo em runtime.
export const dynamic = "force-static"

/**
 * /llms.txt — padrão emergente que entrega a motores de IA (ChatGPT, Perplexity,
 * Claude, Gemini) um mapa curado, em markdown, do conteúdo-chave do site. Os
 * fatos vêm dos consts (fonte única), então ficam coerentes com o resto do site.
 */
export function GET() {
  const faqList = FAQ_ITEMS.map((item) => `- ${item.question}`).join("\n")

  const body = `# ${CHURCH_NAME}

> Igreja cristã reformada continental e confessional em Brasília (Taguatinga, DF), fundada na Palavra e nas Três Formas de Unidade: a Confissão Belga, o Catecismo de Heidelberg e os Cânones de Dort.

## Informações principais

- Endereço: ${CHURCH_ADDRESS_FULL}
- Cultos: domingos às ${MORNING_LITURGY_TIME} (matutino) e ${AFTERNOON_LITURGY_TIME} (vespertino); Escola Dominical às 10h20; Estudo Bíblico às quintas, ${WEEKLY_STUDY_TIME}.
- Tradição: reformada continental / confessional (Três Formas de Unidade) — distinta da presbiteriana, que adota os Símbolos de Westminster.
- Contato: WhatsApp +${CHURCH_WHATSAPP} · ${SITE_URL}/contato

## Páginas principais

- [Sobre a Igreja](${SITE_URL}/sobre): o que é uma igreja reformada e a identidade da congregação.
- [Confissões — Três Formas de Unidade](${SITE_URL}/confissoes): os padrões confessionais que unem a igreja reformada.
- [Confissão Belga (1561)](${SITE_URL}/confissao-belga): 37 artigos que expõem a fé, escritos por Guido de Brès.
- [Catecismo de Heidelberg (1563)](${SITE_URL}/catecismo): o único consolo na vida e na morte, em 129 perguntas e respostas.
- [Cânones de Dort (1619)](${SITE_URL}/canones-de-dort): os cinco pontos da graça soberana, definidos pelo Sínodo de Dordrecht.
- [Doutrina](${SITE_URL}/doutrina): as doutrinas da graça fundamentadas nas confissões históricas.
- [Perguntas Frequentes](${SITE_URL}/perguntas-frequentes): dúvidas comuns sobre a fé reformada, os cultos e como visitar.
- [Galeria](${SITE_URL}/galeria): registros fotográficos da vida da igreja.
- [Contato](${SITE_URL}/contato): WhatsApp, formulário e como chegar.

## Perguntas frequentes

${faqList}

Respostas completas em ${SITE_URL}/perguntas-frequentes
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
