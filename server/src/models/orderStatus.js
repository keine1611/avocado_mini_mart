import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'
import { ORDER_STATUS } from '@/enum'
import { getToday } from '@/utils'

export class OrderStatus extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        status: {
          type: DataTypes.ENUM,
          values: Object.values(ORDER_STATUS),
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.STRING(14),
        },
      },
      {
        sequelize,
        tableName: 'order_status',
        hooks: {
          beforeCreate: (orderStatus) => (orderStatus.updatedAt = getToday()),
        },
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' })
  }
}

OrderStatus.init(sequelize)
