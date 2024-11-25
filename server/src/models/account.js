import { sequelize } from '@/config'
import { DataTypes, Model } from 'sequelize'
import { Profile } from './profile'
import { getToday } from '@/utils'
import bcrypt from 'bcrypt'

export class Account extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING(320),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: 'Email is not valid',
            },
            isUnique: async function (value) {
              const account = await Account.findOne({ where: { email: value } })
              if (account) {
                throw new Error('Email already exists')
              }
            },
            notEmpty: {
              msg: 'Email is required',
            },
          },
        },
        password: {
          type: DataTypes.STRING(60),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Password is required',
            },
          },
        },
        avatarUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        block: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        verifiedAt: {
          type: DataTypes.STRING(14),
          defaultValue: null,
          allowNull: true,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        deletedAt: {
          type: DataTypes.STRING(14),
          allowNull: true,
          defaultValue: null,
        },
        deletedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: null,
        },
        createdAt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => getToday(),
        },
        updatedAt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => getToday(),
        },
      },
      {
        sequelize,
        tableName: 'accounts',
        hooks: {
          beforeCreate: async (account, options) => {
            account.password = await bcrypt.hash(account.password, 10)
          },
          afterCreate: async (account, options) => {
            const profile = await Profile.findOne({
              where: { accountId: account.id },
            })
            if (!profile) {
              await Profile.create({ accountId: account.id })
            }
          },
          afterUpdate: async (account, options) => {
            account.updatedAt = getToday()
          },
        },
      }
    )
  }
  static associate(models) {
    Account.hasOne(models.Profile, {
      foreignKey: {
        name: 'accountId',
        allowNull: false,
        unique: true,
      },
      as: 'profile',
    })
    Account.hasMany(models.Cart, {
      foreignKey: 'accountId',
      as: 'carts',
    })
    Account.hasMany(models.Order, {
      foreignKey: 'accountId',
      as: 'orders',
    })
    Account.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    })
    Account.hasMany(models.Favorite, {
      foreignKey: 'accountId',
      as: 'favorites',
    })
    Account.hasMany(models.OrderInfo, {
      foreignKey: 'accountId',
      as: 'orderInfos',
    })
    Account.hasMany(models.Review, {
      foreignKey: 'accountId',
      as: 'reviews',
    })
  }
}

Account.init(sequelize)
