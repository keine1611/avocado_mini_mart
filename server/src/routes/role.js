import express from 'express'
import { roleController } from '@/controllers'

const roleRouter = express.Router()

roleRouter.get('/', roleController.getAll)
// roleRouter.post('/', roleController.create)
roleRouter.put('/:id', roleController.update)
// roleRouter.delete('/:id', roleController.delete)

export { roleRouter }
