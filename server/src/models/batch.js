import { sequelize } from '@/config'
import { DataTypes, Model, Op } from 'sequelize'
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
          allowNull: true,
          unique: true,
          validate: {
            isUnique: async function (value) {
              const batch = await Batch.findOne({
                where: { code: value, id: { [Op.ne]: this.id } },
              })
              if (batch) {
                throw new Error('Code must be unique')
              }
            },
          },
        },
        createdBy: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        arrivalDate: {
          type: DataTypes.STRING(14),
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    Batch.hasMany(models.BatchProduct, {
      foreignKey: 'batchId',
      as: 'batchProducts',
      onDelete: 'CASCADE',
    })
    Batch.hasMany(models.OrderItemBatch, {
      foreignKey: 'batchId',
      as: 'orderItemBatches',
      onDelete: 'RESTRICT',
    })
  }
}

Batch.init(sequelize)
