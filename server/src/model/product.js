import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { SubCategory } from './subCategory'
import { getToday, createSlug } from '@/utils'
import { statusProduct } from '@/enum'

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
    barcode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: '',
    },
    standardPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(statusProduct),
      defaultValue: statusProduct.INACTIVE,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
  },
  {
    hooks: {
      afterUpdate: async (product, options) => {
        product.updatedAt = getToday()
      },
      beforeCreate: async (product, options) => {
        if (!product.slug) {
          product.slug = await createSlug({ name: product.name })
        }
      },
    },
  }
)
