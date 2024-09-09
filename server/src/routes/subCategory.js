import { Router } from 'express'
import { subCategoryController } from '@/controllers'

const subCategoryRouter = Router()

subCategoryRouter.get('/', subCategoryController.getAll)

export { subCategoryRouter }
