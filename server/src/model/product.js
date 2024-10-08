import { DataTypes, Model } from 'sequelize'
import { getToday, createSlug } from '@/utils'
import { statusProduct } from '@/enum'
import { sequelize } from '@/config'

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
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          defaultValue: '',
        },
        standardPrice: {
          type: DataTypes.FLOAT,
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
          afterUpdate: async (product, options) => {
            product.updatedAt = getToday()
          },
          beforeCreate: async (product, options) => {
            if (!product.slug) {
              product.slug = await createSlug({ name: product.name })
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
    Product.hasMany(models.BatchDetail, {
      foreignKey: 'productId',
      as: 'batchDetails',
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
    Product.hasMany(models.Inventory, {
      foreignKey: 'productId',
      as: 'inventories',
    })
    Product.hasMany(models.SubCategory, {
      foreignKey: 'productId',
      as: 'subCategories',
    })
    Product.hasMany(models.Cart, {
      foreignKey: 'productId',
      as: 'carts',
    })
  }
}

Product.init(sequelize)
