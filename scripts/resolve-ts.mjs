/**
 * Deixa o Node rodar os módulos TypeScript deste projeto sem o Next.
 *
 * Existe por um motivo só: o envio da lista por e-mail tem de usar o MESMO
 * gerador que o botão do admin usa (lib/inscricoes-pdf.ts). Copiar o código
 * para dentro de um script criaria duas folhas parecidas que um dia iam
 * divergir.
 *
 * O Node 24 já tira os tipos do .ts sozinho. O que falta, e é o que este
 * arquivo resolve, são duas coisas que o TypeScript permite e o Node não:
 *
 *   1. o apelido `@/` da raiz do projeto, declarado no tsconfig.json;
 *   2. importar sem escrever a extensão, como em `from "./pdf-metricas"`.
 *
 * Como usar:
 *
 *   node --conditions=react-server --env-file=.env \
 *        --import ./scripts/ts.mjs ./scripts/<script>.mjs
 *
 * Quem liga o gancho é scripts/ts.mjs. São dois arquivos porque o gancho roda
 * em outra linha de execução e importa este módulo de novo: se o registro
 * morasse aqui, ele se registraria em si mesmo.
 *
 * A condição `react-server` é necessária porque o pacote `server-only`, que
 * marca os módulos de servidor, lança erro de propósito em qualquer outro
 * ambiente. Com ela, o pacote resolve para um arquivo vazio, que é o que o
 * Next também faz do lado do servidor.
 */

import { existsSync, statSync } from "node:fs"
import { dirname, resolve as resolveCaminho } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const RAIZ = resolveCaminho(dirname(fileURLToPath(import.meta.url)), "..")

/** As tentativas, na ordem, para um caminho escrito sem extensão. */
const TENTATIVAS = [".ts", ".tsx", ".mjs", ".js", "/index.ts", "/index.tsx"]

function arquivo(caminho) {
  return existsSync(caminho) && statSync(caminho).isFile()
}

function achaArquivo(base) {
  if (arquivo(base)) return base
  for (const sufixo of TENTATIVAS) {
    if (arquivo(base + sufixo)) return base + sufixo
  }
  return null
}

export async function resolve(especificador, contexto, proximo) {
  if (especificador.startsWith("@/")) {
    const achado = achaArquivo(resolveCaminho(RAIZ, especificador.slice(2)))
    if (achado) {
      return { url: pathToFileURL(achado).href, shortCircuit: true }
    }
  }

  // Import relativo sem extensão, e só dentro do projeto: pacote de
  // node_modules continua passando pelo resolvedor do Node, intacto.
  if (
    especificador.startsWith(".") &&
    contexto.parentURL?.startsWith("file:")
  ) {
    const pai = dirname(fileURLToPath(contexto.parentURL))
    if (pai.startsWith(RAIZ) && !pai.includes("node_modules")) {
      const achado = achaArquivo(resolveCaminho(pai, especificador))
      if (achado) {
        return { url: pathToFileURL(achado).href, shortCircuit: true }
      }
    }
  }

  return proximo(especificador, contexto)
}
