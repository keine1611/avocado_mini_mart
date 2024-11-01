import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export class ProductDiscount extends Model {
  static init(sequelize) {
    super.init(
      {
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        discountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'product_discounts',
      }
    )
  }
  static associate(models) {
    ProductDiscount.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
    ProductDiscount.belongsTo(models.Discount, {
      foreignKey: 'discountId',
      as: 'discount',
    })
  }
}

ProductDiscount.init(sequelize)
