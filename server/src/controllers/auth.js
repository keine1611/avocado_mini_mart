import { Op } from 'sequelize'
import { login, register } from '@/services/auth'
import { sequelize } from '@/config'
import {
  Account,
  models,
  Favorite,
  Product,
  Cart,
  Order,
  OrderItem,
} from '@/models'
import {
  createAccessToken,
  readRefreshTokens,
  setTokenCookie,
  writeRefreshTokens,
  decodeQueryFromBase64,
} from '@/utils'
import { authValidation } from '@/validation'
import { sendVerificationEmail } from '@/utils/email'
import { generateVerificationCode } from '@/utils/verificationCode'

import jwt from 'jsonwebtoken'

export const authController = {
  login: async (req, res, next) => {
    const { email, password, rememberMe } = req.body
    const { error } = authValidation.login.validate({ email, password })
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        data: {},
      })
    try {
      const { account, refreshToken, accessToken } = await login({
        email,
        password,
      })
      setTokenCookie({
        res,
        name: 'accessToken',
        data: accessToken,
        expiresIn: 10,
      })
      if (rememberMe) {
        setTokenCookie({
          res,
          name: 'refreshToken',
          data: refreshToken,
          expiresIn: 30,
        })
      } else {
        setTokenCookie({
          res,
          name: 'refreshToken',
          data: refreshToken,
          isSession: true,
        })
      }
      res.status(200).json({
        message: 'success',
        data: account,
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        data: {},
      })
    }
  },

  refresh: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    const { rememberMe } = req.body
    if (!refreshToken)
      return res.status(401).json({ message: 'Unauthorized', data: {} })
    try {
      const refreshTokens = readRefreshTokens()
      const storedToken = refreshTokens.find((token) => token.refreshToken)
      if (!storedToken)
        return res.status(403).json({ message: 'Forbidden', data: {} })
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {
          if (err)
            return res.status(403).json({ message: 'Forbidden', data: {} })
          const accessToken = createAccessToken({
            id: data.id,
            email: data.email,
          })
          const account = await Account.findOne({
            where: { id: data.id, email: data.email },
            attributes: ['id', 'email', 'avatarUrl'],
            include: [
              {
                model: models.Role,
                as: 'role',
                attributes: ['id', 'name'],
              },
              {
                model: models.Profile,
                as: 'profile',
              },
              {
                model: models.Favorite,
                as: 'favorites',
              },
              {
                model: models.Cart,
                as: 'carts',
                include: [{ model: Product, as: 'product' }],
              },
            ],
          })
          if (rememberMe) {
            setTokenCookie({
              res,
              name: 'accessToken',
              data: accessToken,
              expiresIn: 10,
            })
          } else {
            setTokenCookie({
              res,
              name: 'accessToken',
              data: accessToken,
              isSession: true,
            })
          }
          res.status(200).json({
            message: 'success',
            data: account,
          })
        }
      )
    } catch (error) {
      res.status(403).json({ message: 'Forbidden' })
    }
  },

  logout: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    let refreshTokens = readRefreshTokens()
    refreshTokens = refreshTokens.filter(
      (token) => token.refreshToken !== refreshToken
    )
    writeRefreshTokens(refreshTokens)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'success' })
  },

  verifyAndCreateAccount: async (req, res, next) => {
    const { email, verificationCode } = req.body

    if (
      !global.pendingRegistrations ||
      !global.pendingRegistrations.has(email)
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired registration attempt', data: {} })
    }

    const pendingRegistration = global.pendingRegistrations.get(email)

    if (pendingRegistration.verificationCode !== verificationCode) {
      return res
        .status(400)
        .json({ message: 'Invalid verification code', data: {} })
    }

    try {
      const account = await register({
        email,
        password: pendingRegistration.password,
      })
      global.pendingRegistrations.delete(email)
      res
        .status(200)
        .json({ message: 'Account created successfully', data: account })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
  register: async (req, res, next) => {
    const { email, password } = req.body
    const { error } = authValidation.register.validate({ email, password })
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        data: {},
      })
    try {
      const existingUser = await Account.findOne({ where: { email } })
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'Email already exists', data: null })
      }

      const verificationCode = generateVerificationCode()

      // Store the verification code temporarily (you might want to use Redis or a similar solution for production)
      // For now, we'll use a simple in-memory storage
      if (!global.pendingRegistrations) global.pendingRegistrations = new Map()
      global.pendingRegistrations.set(email, { password, verificationCode })

      // Send verification email
      await sendVerificationEmail(email, verificationCode)

      res
        .status(200)
        .json({ message: 'Verification code sent', data: { email } })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
  syncFavorites: async (req, res, next) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const favorites = req.body
      const account = req.account
      const favoriteRequestIds = favorites.map((favorite) => favorite.productId)
      const favoriteProducts = await Favorite.findAll({
        where: { accountId: account.id },
      })
      const favoriteProductsIds = favoriteProducts.map(
        (favorite) => favorite.productId
      )
      let newFavoriteProducts = favorites.filter(
        (favorite) => !favoriteProductsIds.includes(favorite.productId)
      )
      newFavoriteProducts = newFavoriteProducts.map((favorite) => ({
        ...favorite,
        accountId: account.id,
      }))
      await Favorite.bulkCreate(newFavoriteProducts, { transaction })

      const deletedFavoriteProducts = favoriteProductsIds.filter(
        (productId) => !favoriteRequestIds.includes(productId)
      )

      await Favorite.destroy({
        where: {
          productId: {
            [Op.in]: deletedFavoriteProducts,
          },
          accountId: account.id,
        },
        transaction,
      })
      await transaction.commit()
      const favoriteProductsResult = await Favorite.findAll({
        where: { accountId: account.id },
        attributes: ['productId'],
      })
      res.status(200).json({ message: 'success', data: favoriteProductsResult })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(400).json({ message: error.message, data: null })
    }
  },
  getUserFavoriteProducts: async (req, res, next) => {
    try {
      const account = req.account
      const favoriteProducts = await Favorite.findAll({
        where: { accountId: account.id },
        include: [{ model: Product, as: 'product' }],
      })
      const favoriteProductsData = favoriteProducts.map((favorite) => ({
        ...favorite.product,
      }))
      res.status(200).json({ message: 'success', data: favoriteProductsData })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
  syncCart: async (req, res, next) => {
    const cart = req.body
    const account = req.account
    let transaction
    try {
      transaction = await sequelize.transaction()
      await Cart.destroy({
        where: { accountId: account.id },
        transaction,
      })

      const cartData = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        accountId: account.id,
      }))
      await Cart.bulkCreate(cartData, { transaction })
      await transaction.commit()
      const cartResult = await Cart.findAll({
        where: { accountId: account.id },
        attributes: ['productId', 'quantity'],
        include: [{ model: Product, as: 'product' }],
      })
      res.status(200).json({ message: 'success', data: cartResult })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(400).json({ message: error.message, data: null })
    }
  },
  getUserCart: async (req, res, next) => {
    try {
      const account = req.account
      const cart = await Cart.findAll({
        where: { accountId: account.id },
        include: [{ model: Product, as: 'product' }],
      })
      res.status(200).json({ message: 'success', data: cart })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
  getListCartProductsByIds: async (req, res, next) => {
    try {
      const { param } = req.query
      const account = req.account
      const ids = await decodeQueryFromBase64({ param })
      const cart = await Cart.findAll({
        where: { productId: { [Op.in]: ids }, accountId: account.id },
        include: [{ model: Product, as: 'product' }],
      })
      res.status(200).json({ message: 'success', data: cart })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
  getUserOrders: async (req, res, next) => {
    try {
      const account = req.account
      const orders = await Order.findAll({
        where: { accountId: account.id },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [{ model: Product, as: 'product' }],
          },
        ],
      })
      res.status(200).json({ message: 'success', data: orders })
    } catch (error) {
      res.status(400).json({ message: error.message, data: null })
    }
  },
}
