import { brandController } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import multer from 'multer'
import express from 'express'

export const brandRouter = express.Router()
const upload = multer({ dest: 'uploads/' })
brandRouter.get('/', authenticateToken([]), brandController.getAll)
brandRouter.post('/', upload.single('logo'), brandController.create)
brandRouter.post(
  '/import-excel',
  upload.single('file'),
  brandController.importExcel
)
