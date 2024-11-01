import { Role } from '@/models'

const roleController = {
  getAll: async (req, res) => {
    try {
      const roles = await Role.findAll()
      res
        .status(200)
        .json({ message: 'Get all roles successfully', data: roles })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
}

export { roleController }
