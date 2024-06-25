import { login, register } from '@/services/auth'
import {
  createAccessToken,
  readRefreshTokens,
  setTokenCookie,
  writeRefreshTokens,
} from '@/utils'
import { registerValidation } from '@/validation'
import jwt from 'jsonwebtoken'

export const authController = {
  register: async (req, res, next) => {
    const { email, password } = req.body
    const { error } = registerValidation({ email, password })
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        data: {},
      })
    try {
      const account = await register({ email, password })
      res.status(200).json({ message: 'success', data: account })
    } catch (error) {
      res.status(400).json({ message: error.message, data: {} })
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body
    const { error } = registerValidation({ email, password })
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        data: {},
      })
    try {
      const account = await login({ email, password })
      setTokenCookie({ res, name: 'accessToken', data: account.accessToken })
      setTokenCookie({ res, name: 'refreshToken', data: account.refreshToken })
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
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' })
    try {
      const refreshTokens = readRefreshTokens()
      const storedToken = refreshTokens.find((token) => token.refreshToken)
      if (!storedToken) return res.status(403).json({ message: 'Forbidden' })
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, data) => {
          if (err) return res.status(403).json({ message: 'Forbidden' })
          const accessToken = createAccessToken({
            id: data.id,
            email: data.email,
          })

          setTokenCookie({ res, name: 'accessToken', data: accessToken })
          res.status(200).json({ message: 'success' })
        },
      )
    } catch (error) {
      res.status(403).json({ message: 'Forbidden' })
    }
  },

  logout: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    let refreshTokens = readRefreshTokens()
    refreshTokens = refreshTokens.filter(
      (token) => token.refreshToken !== refreshToken,
    )
    writeRefreshTokens(refreshTokens)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'success' })
  },
}
