import { authController } from '@/controllers'
import express from 'express'

export const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/verify', authController.verifyAndCreateAccount)
authRouter.post('/login', authController.login)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authController.logout)
