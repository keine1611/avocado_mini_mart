import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'

export class Cart extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: {
          type: DataTypes.STRING(320),
          allowNull: false,
          unique: true,
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
