import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export class Review extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { sequelize, tableName: 'reviews' }
    )
  }
  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'accountId' })
    this.belongsTo(models.Product, { foreignKey: 'productId' })
    this.hasMany(models.ReviewMedia, { foreignKey: 'reviewId' })
  }
}

Review.init(sequelize)
