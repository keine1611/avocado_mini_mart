import { Router } from 'express'
import { productController } from '@/controllers'
import multer from 'multer'

const productRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

productRouter.get('/', productController.getAll)
productRouter.get('/all', productController.getAllProductWithoutPagination)
productRouter.get('/nearly-expired', productController.getNearlyExpiredProduct)
productRouter.get('/low-stock', productController.getLowStockProduct)
productRouter.get('/expired', productController.getExpiredProduct)
productRouter.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.create
)
productRouter.get('/home-data', productController.getHomeData)
productRouter.get('/ids', productController.getListProductByIds)
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
productRouter.get('/:id/batch-product', productController.getBatchProduct)
productRouter.put('/:id/price', productController.updateProductPrice)
export { productRouter }
