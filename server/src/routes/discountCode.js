import express from 'express'
import { discountCodeController } from '@/controllers'

export const discountCodeRouter = express.Router()
discountCodeRouter.get('/', discountCodeController.getDiscountCodes)
discountCodeRouter.post('/', discountCodeController.createDiscountCode)
discountCodeRouter.put('/:id', discountCodeController.updateDiscountCode)
discountCodeRouter.delete('/:id', discountCodeController.deleteDiscountCode)
discountCodeRouter.get('/:code', discountCodeController.getDiscountCodeByCode)
