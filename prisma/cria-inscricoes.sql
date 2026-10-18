-- CreateEnum
CREATE TYPE "InscricaoStatus" AS ENUM ('AGUARDANDO', 'PAGA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "InscricaoDias" AS ENUM ('AMBOS', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "InscricaoVinculo" AS ENUM ('MEMBRO', 'OUTRA_IGREJA', 'CONVIDADO', 'SEM_IGREJA');

-- CreateTable
CREATE TABLE "inscricoes" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "adultos" INTEGER NOT NULL DEFAULT 1,
    "criancas" INTEGER NOT NULL DEFAULT 0,
    "dias" "InscricaoDias" NOT NULL DEFAULT 'AMBOS',
    "vinculo" "InscricaoVinculo" NOT NULL DEFAULT 'MEMBRO',
    "pagador" TEXT,
    "centavos" INTEGER NOT NULL DEFAULT 0,
    "valor" INTEGER NOT NULL DEFAULT 0,
    "txid" TEXT,
    "status" "InscricaoStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "pagoEm" TIMESTAMP(3),
    "lembreteEm" TIMESTAMP(3),

    CONSTRAINT "inscricoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_numero_key" ON "inscricoes"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_txid_key" ON "inscricoes"("txid");

-- CreateIndex
CREATE INDEX "inscricoes_status_idx" ON "inscricoes"("status");

-- CreateIndex
CREATE INDEX "inscricoes_valor_idx" ON "inscricoes"("valor");

