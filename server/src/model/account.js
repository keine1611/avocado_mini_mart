import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { Profile } from './profile'
import { getToday } from '@/utils'

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
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING(100),
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => getToday(),
  },
  updateAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => getToday(),
  },
})

Account.afterCreate(async (account, options) => {
  await Profile.create({ accountId: account.id })
})

Account.afterUpdate(async (account, options) => {
  account.updateAt = getToday()
})
