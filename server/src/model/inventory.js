import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export const Inventory = sequelize.define(
  'inventory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    manufactureDate: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
  },
  {
    tableName: 'inventories',
  }
)
