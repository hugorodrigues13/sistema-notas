import { Request, Response } from "express";
import { RemoveResultService } from "../../services/resultado/RemoveResultService";

class RemoveResultController {
    async handle(req: Request, res: Response){
        const result_id = req.query.result_id as string

        const removeResult = new RemoveResultService();

        const result = await removeResult.execute({
            result_id
        })

        return res.json(result)
    }
}

export {RemoveResultController}