import { Router } from 'express'
import { mainCategoryController } from '@/controllers'

const mainCategoryRouter = Router()

mainCategoryRouter.get('/', mainCategoryController.getAll)
mainCategoryRouter.post('/', mainCategoryController.create)
mainCategoryRouter.put('/:id', mainCategoryController.update)
mainCategoryRouter.delete('/:id', mainCategoryController.delete)

export { mainCategoryRouter }
