import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'

export class BatchDetail extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        costPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'batch_details',
      }
    )
  }
  static associate(models) {
    BatchDetail.belongsTo(models.Batch, {
      foreignKey: 'batchId',
      as: 'batch',
    })
    BatchDetail.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
  }
}

BatchDetail.init(sequelize)
