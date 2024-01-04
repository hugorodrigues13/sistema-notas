import { Bimestre, Disciplina } from "@prisma/client";
import prismaClient from "../../../prisma";

interface ResultRequest {
    bimestre: Bimestre;
    disciplina: Disciplina;
    nota: number;
  }
  
  class CreateResultService {
    async execute({ bimestre, disciplina, nota }: ResultRequest) {
      // Verificar se a nota está no intervalo de 0 a 10
      if (nota < 0 || nota > 10) {
        throw new Error('A nota deve estar no intervalo de 0 a 10.');
      }
  
      // Verificar se já existe um resultado para a disciplina no mesmo bimestre
      const resultadoExistente = await prismaClient.resultado.findFirst({
        where: {
          bimestre: { equals: bimestre },
          disciplina: { equals: disciplina },
        },
      });
  
      if (resultadoExistente) {
        throw new Error('Já existe um resultado registrado para essa disciplina neste bimestre.');
      }
  
      const result = await prismaClient.resultado.create({
        data: {
          bimestre,
          disciplina,
          nota,
        },
      });

      console.log('Resultado criado:', result);
  
      return result;
    }
  }
  
  export { CreateResultService };