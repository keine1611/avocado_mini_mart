import express from 'express'
import { roleController } from '@/controllers'

const roleRouter = express.Router()

roleRouter.get('/', roleController.getAll)

export { roleRouter }
