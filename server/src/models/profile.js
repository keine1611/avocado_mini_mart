import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { getToday } from '@/utils'
import { Gender } from '@/enum'

export class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING(30),
        },
        lastName: {
          type: DataTypes.STRING(30),
        },
        dob: {
          type: DataTypes.STRING(14),
        },
        phone: {
          type: DataTypes.STRING(10),
        },
        address: {
          type: DataTypes.STRING(255),
        },
        gender: {
          type: DataTypes.ENUM,
          values: Object.values(Gender),
        },
        updateAt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => getToday(),
        },
      },
      {
        hooks: {
          afterUpdate: async (profile, options) => {
            profile.updateAt = getToday()
          },
        },
        sequelize,
        tableName: 'profiles',
      }
    )
  }
  static associate(models) {
    Profile.belongsTo(models.Account, {
      foreignKey: {
        name: 'accountId',
        allowNull: false,
        unique: true,
      },
      as: 'account',
    })
  }
}

Profile.init(sequelize)
