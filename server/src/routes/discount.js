import { Router } from 'express'
import { discountController } from '@/controllers'

const discountRouter = Router()

discountRouter.get('/', discountController.getDiscount)
discountRouter.post('/', discountController.createDiscount)
discountRouter.put('/:id', discountController.updateDiscount)
discountRouter.delete('/:id', discountController.deleteDiscount)

export { discountRouter }
