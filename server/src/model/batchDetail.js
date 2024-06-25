import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'

export const BatchDetail = sequelize.define(
  'BatchDetail',
  {
    quantity: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    costPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  },
  {
    tableName: 'batch_details',
  },
)
