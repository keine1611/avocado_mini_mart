import express from 'express'
import { accountController } from '@/controllers'
import multer from 'multer'

export const accountRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

accountRouter.get('/', accountController.getAccounts)
accountRouter.get('/:id', accountController.getAccount)
accountRouter.post(
  '/',
  upload.single('avatar'),
  accountController.createAccount
)
accountRouter.put(
  '/:id',
  upload.single('avatar'),
  accountController.updateAccount
)
accountRouter.delete('/:id', accountController.deleteAccount)
