-- CreateEnum
CREATE TYPE "InscricaoComoSoube" AS ENUM ('IGREJA', 'CONVITE', 'INSTAGRAM', 'YOUTUBE', 'WHATSAPP', 'GOOGLE', 'OUTRO');

-- AlterTable
ALTER TABLE "inscricoes" ADD COLUMN     "comoSoube" "InscricaoComoSoube",
ADD COLUMN     "igreja" TEXT;
