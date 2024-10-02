import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { Profile } from './profile'
import { getToday } from '@/utils'
import { Role, StatusAccount } from '@/enum'

export const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(320),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email is not valid',
      },
      isUnique: async (value, next) => {
        const account = await Account.findOne({ where: { email: value } })
        if (account) {
          return next('Email already exists')
        }
        next()
      },
      notEmpty: {
        msg: 'Email is required',
      },
    },
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: Object.values(Role),
    defaultValue: Role.USER,
  },
  avatarUrl: {
    type: DataTypes.STRING(100),
  },
  status: {
    type: DataTypes.ENUM,
    values: Object.values(StatusAccount),
    defaultValue: StatusAccount.ACTIVE,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => getToday(),
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => getToday(),
  },
})

Account.afterCreate(async (account, options) => {
  await Profile.create({ accountId: account.id })
})

Account.afterUpdate(async (account, options) => {
  account.updatedAt = getToday()
})
