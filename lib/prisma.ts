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
function getClient(): PrismaClient {
  const existing = globalThis.prismaGlobal
  if (existing) return existing

  const client = prismaClientSingleton()
  if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = client
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
