import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config'

export class RolePermission extends Model {
  static init(sequelize) {
    super.init(
      {
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permissionName: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'role_permissions',
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' })
    this.belongsTo(models.Permission, {
      foreignKey: 'permissionName',
      as: 'permission',
    })
  }
}

RolePermission.init(sequelize)
