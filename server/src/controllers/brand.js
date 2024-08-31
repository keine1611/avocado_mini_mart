import { Brand } from '@/model'
import { createBrand, getAllBrand } from '@/services'
import {
  createSlug,
  decodeQueryFromBase64,
  getFilters,
  getPagination,
  saveExcelToDb,
  uploadFileToFirebase,
} from '@/utils'
import { createBrandValidation } from '@/validation'
import { v4 as uuidv4 } from 'uuid'

export const brandController = {
  getAll: async (req, res) => {
    try {
      const encodedQuery = req.query.param
      const query = await decodeQueryFromBase64({ base64String: encodedQuery })
      const { page, size, ...queryFilters } = query
      const { limit, offset } = await getPagination({ page: page, size })
      const filters = await getFilters({ queryFilters: queryFilters })
      const brands = await getAllBrand({ limit, offset, filters })

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
      let { name, slug, description, code } = req.body
      const logo = req.file

      const { error } = createBrandValidation({
        name,
        slug,
        description,
        logo,
        code,
      })
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
      const uniqueFilename = `/brands/${uuidv4()}_${logo.originalname}`
      const logoURL = await uploadFileToFirebase({
        file: logo,
        path: uniqueFilename,
      })
      const brand = await createBrand({
        name,
        code,
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

    const result = await saveExcelToDb({ file, Model: Brand })
    if (result.success) {
      res.status(200).send(result.message)
    } else {
      res.status(500).send(result.message)
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params
      const { name, code, slug, description } = req.body
      const logo = req.file

      // Validate input
      const { error } = createBrandValidation({ name, code, slug, description })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }

      let updateData = { name, code, slug, description }

      // Handle logo upload if a new file is provided
      if (logo) {
        const uniqueFilename = `/brands/${uuidv4()}_${logo.originalname}`
        const logoURL = await uploadFileToFirebase({
          file: logo,
          path: uniqueFilename,
        })
        updateData.logo = logoURL
      }

      const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, {
        new: true,
      })

      if (!updatedBrand) {
        return res.status(404).json({
          message: 'Brand not found',
          data: null,
        })
      }

      res.status(200).json({
        message: 'Brand updated successfully',
        data: updatedBrand,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      })
    }
  },
}
