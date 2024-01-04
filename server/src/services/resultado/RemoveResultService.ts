import prismaClient from "../../../prisma";

interface ResultRequest {
    result_id: string;
}

class RemoveResultService{
    async execute({result_id}: ResultRequest){

        const result = await prismaClient.resultado.delete({
            where:{
                id: result_id,
            }
        })

        return result;
    }
}

export {RemoveResultService}