import { sequelize } from '@/config'
import { DataTypes, Model, Op } from 'sequelize'
import { createSlug } from '@/utils'

export class SubCategory extends Model {
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
            isUnique: async function (value) {
              const subCategory = await SubCategory.findOne({
                where: { name: value, id: { [Op.ne]: this.id } },
              })
              if (subCategory) {
                throw new Error('Name must be unique')
              }
            },
          },
        },
        slug: {
          type: DataTypes.STRING(100),
          unique: true,
          allowNull: false,
          defaultValue: '',
          validate: {
            isUnique: async function (value) {
              const subCategory = await SubCategory.findOne({
                where: { slug: value, id: { [Op.ne]: this.id } },
              })
              if (subCategory) {
                throw new Error('Slug must be unique')
              }
            },
          },
        },
      },
      {
        sequelize,
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
  }
  static associate(models) {
    SubCategory.belongsTo(models.MainCategory, {
      foreignKey: 'mainCategoryId',
      as: 'mainCategory',
    })
    SubCategory.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
  }
}

SubCategory.init(sequelize)
