import { brandController } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import express from 'express'

export const brandRouter = express.Router()

brandRouter.get('/', authenticateToken, brandController.getAll)
brandRouter.post('/', brandController.create)
