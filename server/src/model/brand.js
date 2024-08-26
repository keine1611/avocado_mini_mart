import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { createSlug, getToday } from '@/utils'
import { options } from 'joi'

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
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      defaultValue: '',
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
  },
  {
    hooks: {
      beforeCreate: async (brand, options) => {
        if (!brand.slug) brand.slug = await createSlug({ name: brand.name })
      },
      afterUpdate: async (brand, options) => {
        brand.updateAt = getToday()
        await brand.save()
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
