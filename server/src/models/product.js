import { DataTypes, Model, Op } from 'sequelize'
import { getToday, createSlug } from '@/utils'
import { statusProduct } from '@/enum'
import { sequelize } from '@/config'
import { models } from '@/models'

export class Product extends Model {
  static init(sequelize) {
    super.init(
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
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          validate: {
            isUnique: async function (value) {
              const product = await Product.findOne({
                where: { barcode: value, id: { [Op.ne]: this.id } },
              })
              if (product) {
                throw new Error('Barcode must be unique')
              }
            },
          },
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          defaultValue: '',
          validate: {
            isUnique: async function (value) {
              const product = await Product.findOne({
                where: { slug: value, id: { [Op.ne]: this.id } },
              })
              if (product) {
                throw new Error('Slug must be unique')
              }
            },
          },
        },
        standardPrice: {
          type: DataTypes.FLOAT(10, 2),
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
        mainImage: {
          type: DataTypes.STRING(500),
          allowNull: false,
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
        sequelize,
        tableName: 'products',
        hooks: {
          beforeCreate: async (product, options) => {
            if (!product.slug) {
              product.slug = await createSlug({ name: product.name })
            }
          },
          beforeUpdate: async (product, options) => {
            product.updatedAt = getToday()
          },
        },
      }
    )
  }
  static associate(models) {
    Product.belongsTo(models.Brand, {
      foreignKey: 'brandId',
      as: 'brand',
    })
    Product.hasMany(models.ProductImage, {
      foreignKey: 'productId',
      as: 'productImages',
    })
    Product.hasMany(models.PriceHistory, {
      foreignKey: 'productId',
      as: 'priceHistories',
    })
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
    })
    Product.belongsTo(models.SubCategory, {
      foreignKey: 'subCategoryId',
      as: 'subCategory',
    })
    Product.hasMany(models.Cart, {
      foreignKey: 'productId',
      as: 'carts',
    })
    Product.hasMany(models.ProductDiscount, {
      foreignKey: 'productId',
      as: 'productDiscounts',
    })
    Product.hasMany(models.Favorite, {
      foreignKey: 'productId',
      as: 'favorites',
    })
    Product.hasMany(models.BatchProduct, {
      foreignKey: 'productId',
      as: 'batchProducts',
    })
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      as: 'reviews',
    })
  }
}

Product.init(sequelize)
