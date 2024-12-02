import { models } from '@/models'

const permissionController = {
  getAll: async (req, res) => {
    try {
      const permissions = await models.Permission.findAll()
      res
        .status(200)
        .json({
          message: 'Get all permissions successfully',
          data: permissions,
        })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
}

export { permissionController }
