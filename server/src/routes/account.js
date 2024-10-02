import express from 'express'
import { accountController } from '@/controllers'

export const accountRouter = express.Router()

accountRouter.get('/', accountController.getAccounts)
accountRouter.get('/:id', accountController.getAccount)
accountRouter.post('/', accountController.createAccount)
accountRouter.put('/:id', accountController.updateAccount)
accountRouter.delete('/:id', accountController.deleteAccount)
