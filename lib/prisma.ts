import "server-only"
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error(
      "CRITICAL ERROR: DATABASE_URL was not found in process.env!",
    )
  }

  return new PrismaClient({
    datasources: { db: { url: dbUrl } },
  })
}

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined
} & typeof global

// Instantiate lazily so that *importing* this module never throws when
// DATABASE_URL is absent. The error is deferred to the first real query, where
// callers already guard (try/catch in the dashboard's safeCount, a getUser()
// check in the contact actions). This lets the admin shell render before the
// database is configured, instead of 500-ing the whole route on import.
//
// O CLIENTE É GUARDADO SEMPRE, inclusive em produção. Até 02/11/2026 a linha
// abaixo era `if (NODE_ENV !== "production")`, copiada do padrão que existe
// para sobreviver ao hot reload do desenvolvimento. Só que aqui o acesso é por
// Proxy, e `getClient()` roda a CADA propriedade lida: sem guardar, em
// produção `prisma.inscricao` e `prisma.logErro` na mesma função criavam DOIS
// PrismaClient, cada um com o próprio pool de conexões. Uma tela que lê quinze
// tabelas abria quinze pools contra o pooler do Supabase, que recusa a partir
// de certo ponto. As consultas recusadas caíam no catch de quem chamou e
// viravam ZERO na tela: foi assim que a visão geral mostrou "0 falhas sem
// baixa" existindo duas.
function getClient(): PrismaClient {
  const existing = globalThis.prismaGlobal
  if (existing) return existing

  const client = prismaClientSingleton()
  globalThis.prismaGlobal = client
  return client
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient()
    const value = client[prop as keyof PrismaClient]
    return typeof value === "function" ? value.bind(client) : value
  },
})

export { prisma }
