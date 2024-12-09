import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export class Role extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'roles',
        hooks: {
          beforeCreate: (role) => {
            role.name = role.name.toUpperCase()
          },
        },
      }
    )
  }
  static associate(models) {
    this.hasMany(models.RolePermission, {
      foreignKey: 'roleId',
      as: 'rolePermissions',
    })
    this.hasMany(models.Account, {
      foreignKey: 'roleId',
      as: 'accounts',
      onDelete: 'RESTRICT',
    })
  }
}

Role.init(sequelize)
