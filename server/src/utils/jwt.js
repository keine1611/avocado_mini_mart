import { Account } from '@/model/account'
import jwt from 'jsonwebtoken'
import fs from 'fs'

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

export const setTokenCookie = ({ res, name, data }) => {
  res.cookie(name, data, {
    path: '/',
    httpOnly: false,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: 'development',
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
          })
          if (account) {
            return resolve(account)
          } else {
            return reject(new Error('Account not found'))
          }
        } catch (error) {
          return reject(error)
        }
      },
    )
  })
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
    JSON.stringify(tokens, null, 2),
  )
}
