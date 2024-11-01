import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'

export class Cart extends Model {
  static init(sequelize) {
    super.init(
      {
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'carts',
      }
    )
  }
  static associate(models) {
    Cart.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
    Cart.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account',
    })
  }
}

Cart.init(sequelize)
