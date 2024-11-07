import { authController } from '@/controllers'
import express from 'express'

export const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/verify', authController.verifyAndCreateAccount)
authRouter.post('/login', authController.login)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authController.logout)
authRouter.post('/sync-favorites', authController.syncFavorites)
authRouter.get('/user-favorites', authController.getUserFavoriteProducts)
authRouter.post('/sync-cart', authController.syncCart)
authRouter.get('/user-cart', authController.getUserCart)
authRouter.get(
  '/user-cart/products/product-ids',
  authController.getListCartProductsByIds
)
authRouter.get('/user-orders', authController.getUserOrders)
