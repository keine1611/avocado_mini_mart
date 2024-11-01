import { DataTypes, Model } from 'sequelize'
import { Account, Product } from '@/models'
import { sequelize } from '@/config'

export class Favorite extends Model {
  static init(sequelize) {
    super.init(
      {
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      { sequelize, tableName: 'favorites' }
    )
  }
  static associate(models) {
    this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' })
    this.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
  }
}

Favorite.init(sequelize)
