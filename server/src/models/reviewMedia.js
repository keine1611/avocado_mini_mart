import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { getToday } from '@/utils'

export class ReviewMedia extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        reviewId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        mediaType: {
          type: DataTypes.ENUM('image', 'video'),
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.STRING(14),
          allowNull: true,
          defaultValue: getToday(),
        },
      },
      {
        sequelize,
        tableName: 'review_medias',
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Review, { foreignKey: 'reviewId' })
  }
}

ReviewMedia.init(sequelize)
