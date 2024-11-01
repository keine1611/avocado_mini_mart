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
        unitPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.VIRTUAL,
          get() {
            return (
              this.getDataValue('quantity') * this.getDataValue('unit_price')
            )
          },
          set(value) {},
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
