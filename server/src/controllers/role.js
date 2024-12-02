import { models } from '@/models'

const roleController = {
  getAll: async (req, res) => {
    try {
      const roles = await models.Role.findAll({
        include: [
          {
            model: models.RolePermission,
            as: 'rolePermissions',
            include: [{ model: models.Permission, as: 'permission' }],
          },
        ],
      })
      res
        .status(200)
        .json({ message: 'Get all roles successfully', data: roles })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  update: async (req, res) => {
    const { id } = req.params
    const { name, permissions } = req.body
    console.log(permissions)
    try {
      const role = await models.Role.findByPk(id)
      if (!role) {
        return res.status(404).json({ message: 'Role not found', data: null })
      }
      await role.update({ name })
      await models.RolePermission.destroy({ where: { roleId: id } })
      await models.RolePermission.bulkCreate(
        permissions.map((permission) => ({
          roleId: id,
          permissionName: permission,
        }))
      )
      const updatedRole = await models.Role.findByPk(id, {
        include: [{ model: models.RolePermission, as: 'rolePermissions' }],
      })
      res
        .status(200)
        .json({ message: 'Update role successfully', data: updatedRole })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
}

export { roleController }
