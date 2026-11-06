/**
 * Gera a lista de inscritos em PDF e manda por e-mail, com aviso no WhatsApp.
 *
 * O PDF sai do MESMO gerador que o botão do painel usa, lib/inscricoes-pdf.ts.
 * Este script não desenha nada e não escolhe coluna nenhuma: ele lê o banco,
 * chama o gerador, põe no envelope e avisa. Se a folha mudar, muda nos dois
 * lugares de uma vez, porque é uma folha só.
 *
 * Como rodar, da raiz do projeto:
 *
 *   node --conditions=react-server --env-file=.env \
 *        --import ./scripts/ts.mjs \
 *        ./scripts/envia-lista-inscritos.mjs <e-mail> [arquivo-de-saida]
 *
 * O segundo argumento é opcional: com ele, uma cópia do PDF também fica
 * gravada nesse caminho.
 *
 * O que este script NÃO imprime: nome, e-mail e WhatsApp de quem se
 * inscreveu. Na tela saem contagens e o destinatário, nada mais. O dado
 * pessoal vai para dentro do PDF e para o anexo, não para o terminal nem
 * para o log.
 */

import { writeFileSync } from "node:fs"
import { prisma } from "@/lib/prisma"
import { montaPdfDeInscritos, nomeDoArquivoPdf } from "@/lib/inscricoes-pdf"
import { sendListaInscritosEmail } from "@/lib/mail"
import { avisaNoWhatsApp, whatsappConfigurado } from "@/lib/whatsapp"

const para = process.argv[2]
const saida = process.argv[3]

if (!para || !para.includes("@")) {
  console.error(
    "Falta o destinatário. Uso: envia-lista-inscritos.mjs <e-mail> [arquivo-de-saida]",
  )
  process.exit(1)
}

const quandoEscrito = (d) => {
  const [data, hora] = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(d)
    .split(", ")
  return `${data} às ${hora.replace(":", "h")}`
}

async function principal() {
  const geradoEm = new Date()

  const inscricoes = await prisma.inscricao.findMany({
    orderBy: { numero: "asc" },
    select: {
      numero: true,
      createdAt: true,
      nome: true,
      email: true,
      whatsapp: true,
      adultos: true,
      criancas: true,
      dias: true,
      vinculo: true,
      igreja: true,
    },
  })

  const pessoas = inscricoes.reduce((s, i) => s + i.adultos + i.criancas, 0)
  console.log(
    `Banco: ${inscricoes.length} inscrição(ões), ${pessoas} pessoa(s).`,
  )

  if (inscricoes.length === 0) {
    console.error("Lista vazia. Nada foi enviado.")
    await prisma.$disconnect()
    process.exit(1)
  }

  const arquivo = montaPdfDeInscritos(inscricoes, geradoEm)
  const nomeDoArquivo = nomeDoArquivoPdf(geradoEm)
  console.log(`PDF: ${nomeDoArquivo}, ${arquivo.length} bytes.`)

  if (saida) {
    writeFileSync(saida, arquivo)
    console.log(`Cópia gravada em ${saida}`)
  }

  const quando = quandoEscrito(geradoEm)
  const envio = await sendListaInscritosEmail({
    para,
    arquivo,
    nomeDoArquivo,
    inscricoes: inscricoes.length,
    pessoas,
    quando,
  })

  if (!envio.success) {
    console.error("O e-mail NÃO saiu. Veja o erro do SMTP acima.")
    await prisma.$disconnect()
    process.exit(1)
  }
  console.log(`E-mail enviado para ${para}.`)

  if (whatsappConfigurado()) {
    const quantos = await avisaNoWhatsApp(
      `Lista de inscritos enviada por e-mail. ${inscricoes.length} inscrição(ões), ${pessoas} pessoa(s). Gerada em ${quando}.`,
    )
    console.log(`Aviso no WhatsApp: ${quantos} número(s).`)
  } else {
    console.log("Aviso no WhatsApp: não configurado, nada enviado.")
  }

  await prisma.$disconnect()
}

principal().catch(async (erro) => {
  console.error("Falhou:", erro instanceof Error ? erro.message : erro)
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})
