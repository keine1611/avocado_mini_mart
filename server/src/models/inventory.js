import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'

export class Inventory extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        manufactureDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        expiryDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'inventories',
      }
    )
  }
  static associate(models) {
    Inventory.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    })
    Inventory.belongsTo(models.Batch, {
      foreignKey: 'batchId',
      as: 'batch',
    })
  }
}

Inventory.init(sequelize)
