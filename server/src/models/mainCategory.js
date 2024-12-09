import { sequelize } from '@/config'
import { DataTypes, Model, Op } from 'sequelize'
import { createSlug } from '@/utils'

export class MainCategory extends Model {
  static init(sequelize) {
    super.init(
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
            isUnique: async function (value) {
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
            isUnique: async function (value) {
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
        sequelize,
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
  }
  static associate(models) {
    MainCategory.hasMany(models.SubCategory, {
      foreignKey: 'mainCategoryId',
      as: 'subCategories',
      onDelete: 'CASCADE',
    })
  }
}

MainCategory.init(sequelize)
