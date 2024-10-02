import { Router } from 'express'
import { subCategoryController } from '@/controllers'

const subCategoryRouter = Router()

subCategoryRouter.get('/', subCategoryController.getAll)
subCategoryRouter.get('/:id', subCategoryController.getById)
subCategoryRouter.post('/', subCategoryController.create)
subCategoryRouter.put('/:id', subCategoryController.update)
subCategoryRouter.delete('/:id', subCategoryController.delete)
subCategoryRouter.get('/:id', subCategoryController.getById)

export { subCategoryRouter }
