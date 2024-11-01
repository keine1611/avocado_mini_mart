import { Router } from 'express'
import { productController } from '@/controllers'
import multer from 'multer'

const productRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

productRouter.get('/', productController.getAll)
productRouter.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.create
)
productRouter.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.update
)
productRouter.delete('/:id', productController.delete)
productRouter.get('/:slug', productController.getDetail)
productRouter.get('/ids', productController.getListProductByIds)

export { productRouter }
