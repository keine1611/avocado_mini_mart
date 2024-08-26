import { verifyAccessToken } from '@/utils'

export const authenticateToken =
  ({ requiredRole } = {}) =>
  async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    try {
      const account = await verifyAccessToken({ accessToken })
      if (!account) throw new Error()
      if (!requiredRole) {
        req.account = account
        return next()
      } else {
        if (!requiredRole.includes(account.role.code)) return next()
        else return res.status(403).json({ message: 'Access forbidden' })
      }
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' })
    }
  }
