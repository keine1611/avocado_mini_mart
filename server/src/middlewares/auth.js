import { verifyAccessToken } from '@/utils'

export const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const account = await verifyAccessToken({ accessToken })
    if (!account) throw new Error()
    req.account = account
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
