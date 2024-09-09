import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'

export const OrderItem = sequelize.define(
  'OrderItem',
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
        return this.getDataValue('quantity') * this.getDataValue('unit_price')
      },
      set(value) {},
    },
  },
  {
    tableName: 'order_item',
  }
)
