import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'

export const MainCategory = sequelize.define(
  'MainCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.CHAR(2),
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'main_categories',
  }
)
