import { MainCategory, SubCategory } from '@/models'
import { subCategoryValidation } from '@/validation'
import { formatError } from '@/utils'
export const subCategoryController = {
  getAll: async (req, res) => {
    try {
      const subCategories = await SubCategory.findAll({
        include: ['mainCategory'],
      })
      res.status(200).json({
        message: 'SubCategories retrieved successfully',
        data: subCategories,
      })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  getById: async (req, res) => {
    try {
      const subCategory = await SubCategory.findByPk(req.params.id)
      res.status(200).json({
        message: 'SubCategory retrieved successfully',
        data: subCategory,
      })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  create: async (req, res) => {
    try {
      const { error } = subCategoryValidation.create.validate(req.body)
      if (error) {
        return res.status(400).json({ message: error.message, data: null })
      }
      const subCategory = await SubCategory.create(req.body)
      res.status(200).json({
        message: 'SubCategory created successfully',
        data: subCategory,
      })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  update: async (req, res) => {
    try {
      const { error } = subCategoryValidation.update.validate(req.body)
      if (error) {
        return res.status(400).json({ message: error.message, data: null })
      }
      const subCategory = await SubCategory.update(req.body, {
        where: { id: req.params.id },
      })
      res.status(200).json({
        message: 'SubCategory updated successfully',
        data: subCategory,
      })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  delete: async (req, res) => {
    try {
      await SubCategory.destroy({ where: { id: req.params.id } })
      res
        .status(200)
        .json({ message: 'SubCategory deleted successfully', data: null })
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        const table = error.table
        const violatedIndex = error.index
        const referencedTable = violatedIndex.split('_')[0]
        return res.status(400).json({
          message: `Record in table ${table} is referenced by table ${referencedTable}.`,
          data: null,
        })
      } else {
        res.status(500).json({
          message: formatError(error.message || 'Cannot delete record'),
          data: null,
        })
      }
    }
  },
}
