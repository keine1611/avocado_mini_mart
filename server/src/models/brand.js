import { DataTypes, Model, Op } from 'sequelize'
import { sequelize } from '@/config'
import { createSlug, getToday } from '@/utils'

class Brand extends Model {
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
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          defaultValue: '',
          validate: {
            isUnique: async function (value) {
              const brand = await Brand.findOne({
                where: { code: value, id: { [Op.ne]: this.id } },
              })
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
            isUnique: async function (value) {
              const brand = await Brand.findOne({
                where: { slug: value, id: { [Op.ne]: this.id } },
              })
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
        sequelize,
        tableName: 'brands',
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
  }
  static associate(models) {
    Brand.hasMany(models.Product, {
      foreignKey: 'brandId',
      as: 'products',
      onDelete: 'RESTRICT',
    })
  }
}

Brand.init(sequelize)

export { Brand }
