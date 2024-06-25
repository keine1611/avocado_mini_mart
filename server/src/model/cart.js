import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'

export const Cart = sequelize.define('Cart', {
  quantity: {
    type: DataTypes.STRING(320),
    allowNull: false,
    unique: true,
  },
})
