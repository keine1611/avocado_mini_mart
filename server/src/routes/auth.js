import { authController } from '@/controllers'
import express from 'express'
import multer from 'multer'

export const authRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
authRouter.post('/add-order-info', authController.addOrderInfo)
authRouter.put('/update-order-info/:id', authController.updateOrderInfo)
authRouter.delete('/delete-order-info/:id', authController.deleteOrderInfo)
authRouter.put(
  '/update-profile/',
  upload.single('avatar'),
  authController.updateProfile
)
authRouter.post(
  '/change-password-request',
  authController.changePasswordRequest
)
authRouter.post('/change-password', authController.changePassword)
authRouter.post(
  '/resend-change-password-code',
  authController.resendChangePasswordCode
)
