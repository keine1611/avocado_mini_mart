import express from 'express'
import { orderController } from '@/controllers'

export const orderRouter = express.Router()

orderRouter.get('/:orderCode', orderController.getOrderById)
orderRouter.get('/', orderController.getOrders)
// orderRouter.post('/', orderController.createOrder)
// orderRouter.put('/:id', orderController.updateOrder)
// orderRouter.delete('/:id', orderController.deleteOrder)
orderRouter.put('/update-status/:orderCode', orderController.updateOrderStatus)
export default orderRouter
