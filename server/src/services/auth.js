import { Profile, Account } from '@/model'

import {
  createAccessToken,
  createRefreshToken,
  readRefreshTokens,
  writeRefreshTokens,
} from '@/utils'
import bcrypt from 'bcrypt'

export const register = async ({ email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const account = await Account.create({ email, password: hashedPassword })
  return account
}

export const login = async ({ email, password }) => {
  const account = await Account.findOne({
    where: { email },
    include: [
      {
        model: Profile,
        as: 'profile',
      },
    ],
  })
  if (!account) {
    throw new Error('User not found')
  }
  const isMatch = await bcrypt.compare(password, account.password)
  if (!isMatch) throw new Error('Password incorect')

  const accessToken = createAccessToken({ email, id: account.id })
  const refreshToken = createRefreshToken({ id: account.id, email })

  const refreshTokens = readRefreshTokens()
  refreshTokens.push({ email, id: account.id, refreshToken })
  writeRefreshTokens(refreshTokens)

  return {
    email: account.email,
    avatarUrl: account.avatarUrl,
    profile: account.profile,
    refreshToken,
    accessToken,
  }
}
