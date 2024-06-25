import { createBrand, getAllBrand } from '@/services'
import { createSlug } from '@/utils'
import { createValidation } from '@/validation/brand'

export const brandController = {
  getAll: async (req, res) => {
    try {
      const brands = await getAllBrand()
      res.status(200).json({
        message: 'success',
        data: brands,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: [],
      })
    }
  },

  create: async (req, res) => {
    try {
      let { name, slug, description, logo } = req.body
      if (!slug) slug = await createSlug(name)
      const { error } = createValidation({ name, slug, description, logo })
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          data: {},
        })
      const brand = await createBrand({ name, slug, description, logo })
      res.status(200).json({
        message: 'success',
        data: brand,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: {},
      })
    }
  },
}
