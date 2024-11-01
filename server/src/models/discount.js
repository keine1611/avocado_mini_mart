import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'
export class Discount extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        discountPercentage: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        endDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'discounts',
      }
    )
  }
  static associate(models) {
    Discount.hasMany(models.ProductDiscount, {
      foreignKey: 'discountId',
      as: 'productDiscounts',
    })
  }
}

Discount.init(sequelize)
