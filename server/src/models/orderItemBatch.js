import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'

export class OrderItemBatch extends Model {
  static init(sequelize) {
    super.init(
      {
        orderItemId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        batchId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'order_item_batches',
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.OrderItem, {
      foreignKey: 'orderItemId',
      as: 'orderItem',
    })
    this.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' })
  }
}

OrderItemBatch.init(sequelize)
