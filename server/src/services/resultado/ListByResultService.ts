import prismaClient from "../../../prisma";

class ListByResultService {
    async execute(){
        const resultado = await prismaClient.resultado.findMany({
            select: {
                id: true,
                bimestre: true,
                disciplina: true,
                nota: true,
                criadoEm: true,
                atualizadoEm: true,
              },
        })

        return resultado
    }
}

export {ListByResultService}