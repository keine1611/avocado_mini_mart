import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'

export class PriceHistory extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        oldPrice: {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        newPrice: {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        changeDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'price_histories',
      }
    )
  }
  static associate(models) {
    PriceHistory.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
  }
}

PriceHistory.init(sequelize)
