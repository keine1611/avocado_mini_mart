import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { getToday } from '@/utils'
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '@/enum'
import { checkProductQuantity } from '@/services'
import { Batch } from '@/models'
import { Sequelize } from 'sequelize'

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
        fullName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        provinceCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        districtCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        wardCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        orderStatus: {
          type: DataTypes.ENUM,
          values: Object.values(ORDER_STATUS),
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },

        paymentMethod: {
          type: DataTypes.ENUM,
          values: Object.values(PAYMENT_METHOD),
          allowNull: false,
        },
        paymentStatus: {
          type: DataTypes.ENUM,
          values: Object.values(PAYMENT_STATUS),
          allowNull: false,
        },
        paymentId: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        shippingMethod: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        shippingFee: {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        discount: {
          type: DataTypes.FLOAT(10, 2),
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
    Order.hasMany(models.OrderLog, {
      foreignKey: 'orderId',
      as: 'orderLogs',
    })
  }
}

Order.init(sequelize)
