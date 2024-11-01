import express from 'express'
import { cartController } from '@/controllers'
const cartRouter = express.Router()

cartRouter.get('/', cartController.getUserCart)

export { cartRouter }
