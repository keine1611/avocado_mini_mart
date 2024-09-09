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
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      defaultValue: '',
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
        if (!brand.slug) brand.slug = await createSlug({ name: brand.name })
      },
      afterUpdate: async (brand, options) => {
        brand.updatedAt = getToday()
      },
    },
  }
)

// const originalBulkCreate = Brand.bulkCreate

// Brand.bulkCreate(async (brands, options) => {
//   const brandsWithSlug = brands.map((brand) => ({
//     ...brand,
//     slug: brand.slug || createSlug(brand.name),
//   }))
//   return originalBulkCreate.call(Brand, brandsWithSlug, options)
// })
