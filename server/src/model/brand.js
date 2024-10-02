import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { createSlug, getToday } from '@/utils'

export const Brand = sequelize.define(
  'Brand',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isUnique: async (value) => {
          const brand = await Brand.findOne({ where: { code: value } })
          if (brand) {
            throw new Error('Code already exists')
          }
        },
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      defaultValue: '',
      validate: {
        isUnique: async (value) => {
          const brand = await Brand.findOne({ where: { slug: value } })
          if (brand) {
            throw new Error('Slug already exists')
          }
        },
      },
    },
    description: {
      type: DataTypes.STRING(500),
    },
    logo: {
      type: DataTypes.STRING(500),
    },
    createdAt: {
      type: DataTypes.STRING(14),
      allowNull: false,
      defaultValue: () => getToday(),
    },
    updatedAt: {
      type: DataTypes.STRING(14),
      allowNull: false,
      defaultValue: () => getToday(),
    },
  },
  {
    hooks: {
      beforeCreate: async (brand, options) => {
        if (!brand.slug || brand.slug == '')
          brand.slug = await createSlug({ name: brand.name })
      },
      afterUpdate: async (brand, options) => {
        brand.updatedAt = getToday()
      },
    },
  }
)
