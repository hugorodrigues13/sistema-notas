import {Router, Request, Response} from 'express'
import { CreateResultController } from './controllers/resultado/CreateResultController';
import { ListByResultController } from './controllers/resultado/ListByResultController';
import { RemoveResultController } from './controllers/resultado/RemoveResultController';

const router = Router();

// ROTAS RESULTADO
router.post('/result/create', new CreateResultController().handle)
router.get('/results', new ListByResultController().handle)
router.delete('/result/remove', new RemoveResultController().handle)

export {router}