import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { getToday } from '@/utils'

export const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  arrivalDate: {
    type: DataTypes.STRING(14),
    allowNull: false,
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

Batch.afterUpdate(async (batch, options) => {
  batch.updateAt = getToday()
})
