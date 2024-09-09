import { brandController } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import multer from 'multer'
import express from 'express'

export const brandRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

brandRouter.get('/', brandController.getAll)
brandRouter.post('/', upload.single('logo'), brandController.create)
brandRouter.put('/:id', upload.single('logo'), brandController.update)
brandRouter.post(
  '/import-excel',
  upload.single('file'),
  brandController.importExcel
)
brandRouter.delete('/:id', brandController.delete)
