import { Brand } from '@/models'
import { sequelize } from '@/config'
import {
  decodeQueryFromBase64,
  getPagination,
  saveExcelToDb,
  uploadFileToFirebase,
  getSort,
  getSearch,
  formatError,
} from '@/utils'
import { brandValidation } from '@/validation'
import { v4 as uuidv4 } from 'uuid'

export const brandController = {
  getAll: async (req, res) => {
    try {
      const { param } = req.query
      if (!param) {
        const brands = await Brand.findAll()
        return res.status(200).json({
          message: 'Brands retrieved successfully',
          data: brands,
        })
      }
      const { page, size, sort, search } = await decodeQueryFromBase64({
        param,
      })
      const { limit, offset } = await getPagination({ page, size })

      const searchFilters = await getSearch({ key: 'name', search })
      const order = await getSort({ sort })

      const { rows: brands, count } = await Brand.findAndCountAll({
        where: searchFilters,
        limit,
        offset,
        order: order ? order : [['createdAt', 'DESC']],
      })

      res.status(200).json({
        message: 'Brands retrieved successfully',
        data: {
          brands,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page ? +page : 1,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      })
    }
  },

  create: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      let { name, slug, description, code } = req.body
      const logo = req.file
      const { error } = brandValidation.create.validate({
        name,
        slug,
        description,
        code,
        logo,
      })

      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }
      const brand = await Brand.create(
        {
          name,
          code,
          slug,
          description,
        },
        { transaction }
      )

      if (logo) {
        const uniqueFilename = `/brands/${uuidv4()}_${logo.originalname}`
        const logoURL = await uploadFileToFirebase({
          file: logo,
          path: uniqueFilename,
        })
        await brand.update({ logo: logoURL }, { transaction })
      }

      await transaction.commit()
      res.status(200).json({
        message: 'Brand created successfully',
        data: brand,
      })
    } catch (error) {
      await transaction.rollback()
      res.status(500).json({
        message: formatError(error.message),
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
      const { ...brandData } = req.body
      const logo = req.file

      const { error } = brandValidation.update.validate({ ...brandData, logo })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }

      if (logo) {
        const uniqueFilename = `/brands/${uuidv4()}_${logo.originalname}`
        const logoURL = await uploadFileToFirebase({
          file: logo,
          path: uniqueFilename,
        })
        brandData.logo = logoURL
      }

      await Brand.update({ ...brandData, id }, { where: { id } })

      const updatedBrand = await Brand.findByPk(id)

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
        message: formatError(error.message),
        data: null,
      })
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params
      await Brand.destroy({ where: { id } })
      res.status(200).json({
        message: 'Brand deleted successfully',
        data: null,
      })
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
