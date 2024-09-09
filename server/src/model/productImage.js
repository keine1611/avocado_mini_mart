import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { getToday } from '@/utils'

export const ProductImage = sequelize.define(
  'ProductImage',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    hooks: {
      afterUpdate: async (productImage, options) => {
        productImage.updateAt = getToday()
      },
    },
    tableName: 'product_images',
  }
)
