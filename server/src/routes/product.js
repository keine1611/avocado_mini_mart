import { Router } from 'express'
import { productController } from '@/controllers'
import multer from 'multer'

const productRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

productRouter.get('/', productController.getAll)
productRouter.post('/', upload.array('images', 5), productController.create)
productRouter.put('/:id', upload.array('images', 5), productController.update)
productRouter.delete('/:id', productController.delete)

export { productRouter }
