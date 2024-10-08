import { models } from '@/model'
import { verifyAccessToken } from '@/utils'

export const authenticateToken = () => async (req, res, next) => {
  const publicPermissions = await models.Permission.findAll({
    where: {
      isPublic: true,
    },
  })

  const path = req.path
  const method = req.method

  if (publicPermissions.some((p) => p.path === path && p.method === method)) {
    return next()
  }

  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const account = await verifyAccessToken({ accessToken })
    if (!account) throw new Error()
    const permissions = account.role.rolePermissions.map((p) => p.permission)
    const permission = permissions.find(
      (p) => p.path === path && p.method === method
    )
    if (!permission)
      return res.status(403).json({ message: 'Access forbidden' })
    req.account = account
    return next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
