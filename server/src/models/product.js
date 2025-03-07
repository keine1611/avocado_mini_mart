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
          type: DataTypes.STRING(100),
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
          type: DataTypes.STRING(200),
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
          type: DataTypes.STRING(1000),
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

          afterBulkCreate: async (products, options) => {
            for (const product of products) {
              await models.PriceHistory.create({
                productId: product.id,
                oldPrice: product.standardPrice,
                newPrice: product.standardPrice,
                changedAt: getToday(),
                changedBy: 'Created',
              })
            }
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
      onDelete: 'CASCADE',
    })
    Product.hasMany(models.PriceHistory, {
      foreignKey: 'productId',
      as: 'priceHistories',
    })
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
      onDelete: 'RESTRICT',
    })
    Product.belongsTo(models.SubCategory, {
      foreignKey: 'subCategoryId',
      as: 'subCategory',
    })
    Product.hasMany(models.Cart, {
      foreignKey: 'productId',
      as: 'carts',
      onDelete: 'CASCADE',
    })
    Product.hasMany(models.ProductDiscount, {
      foreignKey: 'productId',
      as: 'productDiscounts',
      onDelete: 'RESTRICT',
    })
    Product.hasMany(models.Favorite, {
      foreignKey: 'productId',
      as: 'favorites',
      onDelete: 'CASCADE',
    })
    Product.hasMany(models.BatchProduct, {
      foreignKey: 'productId',
      as: 'batchProducts',
      onDelete: 'RESTRICT',
    })
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      as: 'reviews',
      onDelete: 'CASCADE',
    })
  }
}

Product.init(sequelize)
