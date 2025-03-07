import { Profile, Account, models } from '@/models'

import {
  createAccessToken,
  createRefreshToken,
  readRefreshTokens,
  writeRefreshTokens,
} from '@/utils'
import bcrypt from 'bcrypt'
import { cartService } from './cart'
import { ACCOUNT_STATUS } from '@/enum'

export const register = async ({ email, password }) => {
  const account = await Account.create({
    email,
    password,
    roleId: 2,
  })
  return account
}

export const login = async ({ email, password }) => {
  const account = await Account.findOne({
    where: { email },
    attributes: [
      'id',
      'email',
      'avatarUrl',
      'password',
      'status',
      'restrictedUntil',
    ],
    include: [
      {
        model: models.Profile,
        as: 'profile',
      },
      {
        model: models.Role,
        as: 'role',
        attributes: ['id', 'name'],
      },
      {
        model: models.Favorite,
        as: 'favorites',
        attributes: ['productId'],
      },
      {
        model: models.OrderInfo,
        as: 'orderInfos',
      },
    ],
  })

  if (!account) {
    throw new Error('User not found')
  }
  if (account.status == ACCOUNT_STATUS.BANNED) {
    throw new Error('Account is banned')
  }
  const isMatch = await bcrypt.compare(password, account.password)
  if (!isMatch) throw new Error('Password incorect')

  const accessToken = createAccessToken({ email, id: account.id })
  const refreshToken = createRefreshToken({ id: account.id, email })
  const refreshTokens = readRefreshTokens()
  const isExist = refreshTokens.find(
    (token) => token.email === email && token.id === account.id
  )
  if (isExist) {
    refreshTokens.splice(refreshTokens.indexOf(isExist), 1)
  }
  refreshTokens.push({ email, id: account.id, refreshToken })
  writeRefreshTokens(refreshTokens)

  const carts = await cartService.getCart({ accountId: account.id })
  const accountWithoutPassword = {
    id: account.id,
    email: account.email,
    avatarUrl: account.avatarUrl,
    profile: account.profile,
    role: account.role,
    status: account.status,
    restrictedUntil: account.restrictedUntil,
    carts,
    favorites: account.favorites,
    orderInfos: account.orderInfos,
  }

  return {
    account: accountWithoutPassword,
    refreshToken,
    accessToken,
  }
}
