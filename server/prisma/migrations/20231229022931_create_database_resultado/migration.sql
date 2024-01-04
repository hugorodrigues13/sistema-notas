-- CreateEnum
CREATE TYPE "Bimestre" AS ENUM ('PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'QUARTO');

-- CreateEnum
CREATE TYPE "Disciplina" AS ENUM ('BIOLOGIA', 'ARTES', 'GEOGRAFIA', 'SOCIOLOGIA');

-- CreateTable
CREATE TABLE "resultados" (
    "id" TEXT NOT NULL,
    "bimestre" "Bimestre" NOT NULL,
    "disciplina" "Disciplina" NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resultados_pkey" PRIMARY KEY ("id")
);
