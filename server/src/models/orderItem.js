import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'

export class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        discount: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        isReviewed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'order_item',
      }
    )
  }
  static associate(models) {
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    })
  }
}

OrderItem.init(sequelize)
