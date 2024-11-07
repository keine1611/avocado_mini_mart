import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'

export class BatchProduct extends Model {
  static init(sequelize) {
    return super.init(
      {
        batchId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        initialQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        expiredDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'batch_products',
        hooks: {
          beforeCreate: async (batchProduct, options) => {
            if (batchProduct.initialQuantity) {
              batchProduct.quantity = batchProduct.initialQuantity
            }
          },
        },
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Batch, { foreignKey: 'batchId' })
    this.belongsTo(models.Product, { foreignKey: 'productId' })
  }
}

BatchProduct.init(sequelize)
