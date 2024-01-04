/*
  Warnings:

  - The values [BIOLOGIA,ARTES,GEOGRAFIA,SOCIOLOGIA] on the enum `Disciplina` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Disciplina_new" AS ENUM ('Biologia', 'Artes', 'Geografia', 'Sociologia');
ALTER TABLE "resultados" ALTER COLUMN "disciplina" TYPE "Disciplina_new" USING ("disciplina"::text::"Disciplina_new");
ALTER TYPE "Disciplina" RENAME TO "Disciplina_old";
ALTER TYPE "Disciplina_new" RENAME TO "Disciplina";
DROP TYPE "Disciplina_old";
COMMIT;
