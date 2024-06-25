import { authController } from '@/controllers'
import express from 'express'

export const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/refresh', authController.refresh)
authRouter.get('/logout', authController.logout)
