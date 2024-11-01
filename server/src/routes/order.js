import express from 'express'
import { orderController } from '@/controllers'

export const orderRouter = express.Router()

orderRouter.get('/', orderController.getOrders)
// orderRouter.post('/', orderController.createOrder)
// orderRouter.get('/:id', orderController.getOrderById)
// orderRouter.put('/:id', orderController.updateOrder)
// orderRouter.delete('/:id', orderController.deleteOrder)

export default orderRouter
