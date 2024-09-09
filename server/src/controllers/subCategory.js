import { SubCategory } from '@/model'

export const subCategoryController = {
  getAll: async (req, res) => {
    const subCategories = await SubCategory.findAll()
    res.status(200).json({ data: subCategories })
  },
}
