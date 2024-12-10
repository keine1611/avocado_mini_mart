import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/config'

export class OrderInfo extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        provinceCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        districtCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        wardCode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'order_infos',
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'accountId', as: 'account' })
  }
}

OrderInfo.init(sequelize)
