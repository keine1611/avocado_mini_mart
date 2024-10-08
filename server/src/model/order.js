import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { getToday } from '@/utils'

export class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        orderStatus: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        shippingAddress: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        shippingMethod: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        notes: {
          type: DataTypes.STRING,
          discount: DataTypes.FLOAT,
        },
        createdAt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => getToday(),
        },
        updateAt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => getToday(),
        },
      },
      {
        sequelize,
        tableName: 'orders',
        hooks: {
          afterUpdate: async (order, options) => {
            order.updateAt = getToday()
          },
        },
      }
    )
  }
  static associate(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
    })
    Order.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account',
    })
  }
}

Order.init(sequelize)
