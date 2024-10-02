import { MainCategory } from '@/model'
import { mainCategoryValidation } from '@/validation'

export const mainCategoryController = {
  getAll: async (req, res) => {
    try {
      const mainCategories = await MainCategory.findAll()
      res.status(200).json({
        message: 'MainCategories retrieved successfully',
        data: mainCategories,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  create: async (req, res) => {
    try {
      const { error } = mainCategoryValidation.create.validate(req.body)
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0].message, data: null })
      }
      const mainCategory = await MainCategory.create(req.body)
      res.status(200).json({
        message: 'MainCategory created successfully',
        data: mainCategory,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  update: async (req, res) => {
    try {
      const { error } = mainCategoryValidation.update.validate(req.body)
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0].message, data: null })
      }
      const mainCategory = await MainCategory.update(req.body, {
        where: { id: req.params.id },
      })
      res.status(200).json({
        message: 'MainCategory updated successfully',
        data: mainCategory,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  delete: async (req, res) => {
    try {
      const mainCategory = await MainCategory.destroy({
        where: { id: req.params.id },
      })
      res.status(200).json({
        message: 'MainCategory deleted successfully',
        data: mainCategory,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
}
