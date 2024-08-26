import { Brand } from '@/model'
import { createBrand, getAllBrand } from '@/services'
import { createSlug, saveExcelToDb, uploadFileToFirebase } from '@/utils'
import { createBrandValidation } from '@/validation/brand'

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
        data: null,
      })
    }
  },

  create: async (req, res) => {
    try {
      let { name, slug, description, logo } = req.body

      const { error } = createBrandValidation({ name, slug, description, logo })
      if (!logo) {
        return res.status(400).json({
          message: 'No logo uploaded.',
          data: null,
        })
      }
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      const logoURL = await uploadFileToFirebase({
        logo,
        path: `brands/${logo.originalname}`,
      })
      const brand = await createBrand({
        name,
        slug,
        description,
        logo: logoURL,
      })
      res.status(200).json({
        message: 'success',
        data: brand,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      })
    }
  },

  importExcel: async (req, res) => {
    const file = req.file
    if (!file) {
      return res.status(400).send('No file uploaded. ')
    }

    const result = await saveExcelToDb(file, Brand)
    if (result.success) {
      res.status(200).send(result.message)
    } else {
      res.status(500).send(result.message)
    }
  },
}
