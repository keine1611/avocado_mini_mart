import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { createSlug } from '@/utils'
import { Op } from 'sequelize'
export const MainCategory = sequelize.define(
  'MainCategory',
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
      validate: {
        notEmpty: {
          msg: 'Name is required',
        },
        notNull: {
          msg: 'Name is required',
        },
        len: {
          args: [3, 50],
          msg: 'Name must be between 3 and 50 characters',
        },
        isUnique: async (value) => {
          const mainCategory = await MainCategory.findOne({
            where: { name: value, id: { [Op.ne]: this.id } },
          })
          if (mainCategory) {
            throw new Error('Name must be unique')
          }
        },
      },
    },
    slug: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      defaultValue: '',
      validate: {
        isUnique: async (value) => {
          const mainCategory = await MainCategory.findOne({
            where: { slug: value, id: { [Op.ne]: this.id } },
          })
          if (mainCategory) {
            throw new Error('Slug must be unique')
          }
        },
      },
    },
  },
  {
    tableName: 'main_categories',
    hooks: {
      beforeCreate: async (mainCategory, options) => {
        if (!mainCategory.slug) {
          mainCategory.slug = await createSlug({ name: mainCategory.name })
        }
      },
    },
  }
)
