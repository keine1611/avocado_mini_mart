import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { getToday } from '@/utils'

export const Order = sequelize.define('Order', {
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
})
Order.afterUpdate(async (order, options) => {
  order.updateAt = getToday()
})
