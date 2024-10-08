import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'
import { getToday } from '@/utils'

export class ProductImage extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        url: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
      },
      {
        sequelize,
        hooks: {
          afterUpdate: async (productImage, options) => {
            productImage.updateAt = getToday()
          },
        },
        tableName: 'product_images',
      }
    )
  }
  static associate(models) {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
  }
}

ProductImage.init(sequelize)
