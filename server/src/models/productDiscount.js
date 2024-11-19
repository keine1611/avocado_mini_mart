import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export class ProductDiscount extends Model {
  static init(sequelize) {
    super.init(
      {
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        discountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        discountPercentage: {
          type: DataTypes.INTEGER,
          min: 0,
          max: 100,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'product_discounts',
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onDelete: 'CASCADE',
    })
    this.belongsTo(models.Discount, {
      foreignKey: 'discountId',
      as: 'discount',
      onDelete: 'CASCADE',
    })
  }
}

ProductDiscount.init(sequelize)
