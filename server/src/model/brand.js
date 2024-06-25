import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { getToday } from '@/utils'

export const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  desciption: {
    type: DataTypes.STRING(500),
  },
  logo: {
    type: DataTypes.STRING(500),
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

Brand.afterUpdate(async (brand, options) => {
  brand.updateAt = getToday()
})
