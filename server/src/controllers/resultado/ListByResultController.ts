import {Request, Response} from 'express'
import { ListByResultService } from '../../services/resultado/ListByResultService'

class ListByResultController{
    async handle(req: Request, res: Response){
        const listResultService = new ListByResultService()

        const resultado = await listResultService.execute()

        return res.json(resultado)
    }
}

export {ListByResultController}