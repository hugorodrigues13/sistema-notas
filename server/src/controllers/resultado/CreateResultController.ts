import {Request, Response} from 'express'
import { CreateResultService } from '../../services/resultado/CreateResultService';

class CreateResultController{
    async handle(req: Request, res: Response){
        const {bimestre, disciplina, nota} = req.body;

        const createUserService = new CreateResultService()

        const user = await createUserService.execute({
            bimestre,
            disciplina,
            nota
        })

        return res.json(user)
    }
}

export {CreateResultController}