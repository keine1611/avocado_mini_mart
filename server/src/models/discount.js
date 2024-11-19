import { Model, DataTypes, Op } from 'sequelize'
import { sequelize } from '@/config'

export class Discount extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          isUnique: true,
          validate: {
            isUnique: async function (value) {
              const discount = await Discount.findOne({
                where: { name: value, id: { [Op.ne]: this.id } },
              })
              if (discount) {
                throw new Error('Discount name must be unique')
              }
            },
          },
        },
        startDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        endDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'discounts',
      }
    )
  }
  static associate(models) {
    this.hasMany(models.ProductDiscount, {
      foreignKey: 'discountId',
      as: 'productDiscounts',
      onDelete: 'CASCADE',
    })
  }
}

Discount.init(sequelize)
