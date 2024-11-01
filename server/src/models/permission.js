import { Model, Op, DataTypes } from 'sequelize'
import { sequelize } from '@/config'
import { Method } from '@/enum'

export class Permission extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          primaryKey: true,
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
          validate: {
            isUnique: async function (value) {
              const permission = await Permission.findOne({
                where: {
                  name: value,
                  id: { [Op.ne]: this.id },
                },
              })
              if (permission) {
                throw new Error('Permission already exists')
              }
            },
          },
        },
        path: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        method: {
          type: DataTypes.ENUM,
          values: Object.values(Method),
          allowNull: false,
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'permissions',
      }
    )
  }
  static associate(models) {
    this.hasMany(models.RolePermission, {
      foreignKey: 'permissionName',
      as: 'rolePermissions',
    })
  }
}

Permission.init(sequelize)
