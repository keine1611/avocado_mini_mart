import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { getToday } from '@/utils'

export class Batch extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        arrivalDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.STRING(14),
          allowNull: false,
          defaultValue: () => getToday(),
        },
        updateAt: {
          type: DataTypes.STRING(14),
          allowNull: false,
          defaultValue: () => getToday(),
        },
      },
      {
        sequelize,
        tableName: 'batches',
        hooks: {
          afterUpdate: async (batch, options) => {
            batch.updateAt = getToday()
          },
        },
      }
    )
  }
  static associate(models) {
    Batch.hasMany(models.BatchDetail, {
      foreignKey: 'batchId',
      as: 'batchDetails',
    })
    Batch.hasMany(models.Inventory, {
      foreignKey: 'batchId',
      as: 'inventories',
    })
  }
}

Batch.init(sequelize)
