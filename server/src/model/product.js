import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { SubCategory } from './subCategory'
import { getToday } from '@/utils'

export const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    standardPrice: {
      type: DataTypes.INTEGER,
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
  },
  {
    hooks: async (product, options) => {
      const subCategory = await SubCategory.findByPk(product.sub_category_id)
      if (subCategory) {
        product.code = `${subCategory.code}${product.id}`
      } else {
        throw new Error('SubCategory not found')
      }
    },
  },
)
Product.afterUpdate(async (product, options) => {
  product.updateAt = getToday()
})
