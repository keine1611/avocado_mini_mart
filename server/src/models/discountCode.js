import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { DISCOUNT_TYPE } from '@/enum'
import { Op } from 'sequelize'
export class DiscountCode extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
          validate: {
            isUnique: async function (value) {
              const discountCode = await DiscountCode.findOne({
                where: { code: value, id: { [Op.ne]: this.id } },
              })
              if (discountCode) {
                throw new Error('Code already exists')
              }
            },
          },
        },
        discountType: {
          type: DataTypes.ENUM,
          values: Object.values(DISCOUNT_TYPE),
          allowNull: false,
        },
        discountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        expiryDate: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        usageLimit: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        timesUsed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'discount_codes',
      }
    )
  }
  static associate(models) {}
}

DiscountCode.init(sequelize)
