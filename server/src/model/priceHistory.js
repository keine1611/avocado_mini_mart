import { DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export const PriceHistory = sequelize.define(
  'PriceHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    oldPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    newPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    changeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'price_histories',
  }
)
