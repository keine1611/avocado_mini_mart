import { Account } from '@/models/account'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { Role } from '@/models/role'
import { models } from '@/models'
import dotenv from 'dotenv'

dotenv.config()

export const createAccessToken = ({ id, email }) => {
  const token = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })
  return token
}
export const createRefreshToken = ({ id, email }) => {
  const token = jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET)
  return token
}

export const setTokenCookie = ({
  res,
  name,
  data,
  expiresIn,
  isSession = false,
}) => {
  res.cookie(name, data, {
    path: '/',
    httpOnly: false,
    sameSite: process.env.PRODUCTION == 'true' ? 'none' : 'lax',
    maxAge: isSession
      ? null
      : expiresIn
      ? expiresIn * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000,
    secure: false,
    domain: process.env.COOKIE_DOMAIN,
  })
}

export const verifyAccessToken = ({ accessToken }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log('Token verification error: ' + err.message)
          return reject(err)
        }
        try {
          const account = await Account.findOne({
            where: { id: decoded.id, email: decoded.email },
            include: [
              {
                model: models.Role,
                as: 'role',
                include: [
                  {
                    model: models.RolePermission,
                    as: 'rolePermissions',
                    include: [
                      {
                        model: models.Permission,
                        as: 'permission',
                      },
                    ],
                  },
                ],
              },
            ],
          })

          if (account) {
            return resolve(account)
          } else {
            return reject(new Error('Account not found'))
          }
        } catch (error) {
          return reject(error)
        }
      }
    )
  })
}

export const deleteRefreshToken = ({ email }) => {
  const tokens = readRefreshTokens()
  const newTokens = tokens.filter((token) => token.email !== email)
  writeRefreshTokens(newTokens)
}

export const readRefreshTokens = () => {
  if (!fs.existsSync(process.env.REFRESH_TOKENS_FILE)) {
    fs.writeFileSync(process.env.REFRESH_TOKENS_FILE, JSON.stringify([]))
  }
  return JSON.parse(fs.readFileSync(process.env.REFRESH_TOKENS_FILE))
}
export const writeRefreshTokens = (tokens) => {
  fs.writeFileSync(
    process.env.REFRESH_TOKENS_FILE,
    JSON.stringify(tokens, null, 2)
  )
}
