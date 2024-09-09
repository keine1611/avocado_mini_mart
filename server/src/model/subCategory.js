import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { createSlug } from '@/utils'

export const SubCategory = sequelize.define(
  'SubCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    tableName: 'sub_categories',
    hooks: {
      beforeCreate: async (subCategory, options) => {
        if (!subCategory.slug) {
          subCategory.slug = await createSlug({ name: subCategory.name })
        }
      },
    },
  }
)
