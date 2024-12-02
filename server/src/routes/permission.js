import { Router } from 'express'
import { permissionController } from '@/controllers'
const permissionRouter = Router()

permissionRouter.get('/', permissionController.getAll)
export { permissionRouter }
