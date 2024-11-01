import { models } from '@/models'
import { verifyAccessToken, checkPath } from '@/utils'

export const authenticateToken = () => async (req, res, next) => {
  const path = req.path
  const method = req.method

  const publicPermissions = await models.Permission.findAll({
    where: {
      isPublic: true,
    },
  })

  if (
    publicPermissions.some(
      (p) => checkPath(p.path, path) && p.method === method
    )
  ) {
    return next()
  }

  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({ message: 'Not authorized', data: null })
  }

  try {
    const account = await verifyAccessToken({ accessToken })
    if (!account) throw new Error()
    const permissions = account.role.rolePermissions.map((p) => p.permission)
    const permission = permissions.find(
      (p) => checkPath(p.path, path) && p.method === method
    )
    if (!permission)
      return res.status(403).json({ message: 'Access forbidden', data: null })
    req.account = account
    return next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', data: null })
  }
}
