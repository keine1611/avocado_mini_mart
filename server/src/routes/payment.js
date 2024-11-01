import express from 'express'
import { paymentController } from '@/controllers'

const paymentRouter = express.Router()

paymentRouter.post('/paypal/create-order', paymentController.paypalCreateOrder)
paymentRouter.post('/paypal/verify-order', paymentController.paypalVerifyOrder)

export { paymentRouter }
