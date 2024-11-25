import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { getToday } from '@/utils'

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
        createdAt: {
          type: DataTypes.STRING(14),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'reviews',
        hooks: {
          beforeCreate: async (review, options) => {
            review.createdAt = getToday()
          },
        },
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'accountId', as: 'account' })
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' })
    this.hasMany(models.ReviewMedia, {
      foreignKey: 'reviewId',
      as: 'reviewMedia',
    })
  }
}

Review.init(sequelize)
