import express from 'express'
import { batchController } from '@/controllers'

const batchRouter = express.Router()

batchRouter.get('/', batchController.getAllBatch)
batchRouter.post('/', batchController.createBatch)
batchRouter.put('/:id', batchController.updateBatch)
batchRouter.delete('/:id', batchController.deleteBatch)

export { batchRouter }
