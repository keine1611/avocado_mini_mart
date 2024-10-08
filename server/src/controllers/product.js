import { Product, ProductImage } from '@/model'
import { sequelize } from '@/config'
import {
  getPagination,
  decodeQueryFromBase64,
  getSort,
  getSearch,
  uploadFileToFirebase,
  deleteFileFromFirebase,
} from '@/utils'
import { productValidation } from '@/validation'
import { v4 as uuidv4 } from 'uuid'

export const productController = {
  getAll: async (req, res) => {
    try {
      const { param } = req.query

      let page, size, sort, search

      if (param) {
        ;({ page, size, sort, search } = await decodeQueryFromBase64({ param }))
      } else {
        // Default values if param is not provided
        const products = await Product.findAll({
          include: ['brand', 'productImages', 'subCategory'],
        })
        return res.status(200).json({
          message: 'Products retrieved successfully',
          data: products,
        })
      }

      const { limit, offset } = await getPagination({ page, size })

      const order = await getSort({ sort })
      const searchFilters = await getSearch({ key: 'name', search })

      const { rows: products, count } = await Product.findAndCountAll({
        where: searchFilters,
        limit,
        offset,
        order: order ? order : [['createdAt', 'DESC']],
        include: ['brand', 'productImages', 'subCategory'],
      })

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: {
          products,
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
  getById: async (req, res) => {
    try {
      const { id } = req.params
      const product = await Product.findByPk(id)
      res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  create: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()

      const { ...productData } = req.body
      const { error } = productValidation.create.validate(productData)
      if (error) {
        await transaction.rollback()
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }

      const product = await Product.create(productData, { transaction })

      const images = req.files
      if (!images) {
        return res.status(400).json({
          message: 'No images provided',
          data: null,
        })
      }
      if (images && images.length > 0) {
        const productImages = await Promise.all(
          images.map(async (image) => {
            const uniqueFilename = `/products/${uuidv4()}_${image.originalname}`
            const imageUrl = await uploadFileToFirebase({
              file: image,
              path: uniqueFilename,
            })
            return { url: imageUrl, productId: product.id }
          })
        )
        await ProductImage.bulkCreate(productImages, { transaction })
      }

      const createdProduct = await Product.findByPk(product.id, { transaction })

      await transaction.commit()

      res.status(201).json({
        message: 'Product created successfully',
        data: createdProduct,
      })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  update: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()

      const { id } = req.params
      const { imagesToDelete, ...productData } = req.body
      const { error } = productValidation.update.validate(productData)
      if (error) {
        await transaction.rollback()
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }
      const product = await Product.findByPk(id)
      if (!product) {
        await transaction.rollback()
        return res.status(404).json({
          message: 'Product not found',
          data: null,
        })
      }
      const arrImagesToDelete = JSON.parse(imagesToDelete)
      if (arrImagesToDelete && arrImagesToDelete.length > 0) {
        arrImagesToDelete.forEach(async (imageId) => {
          await ProductImage.destroy({
            where: { id: imageId },
            transaction,
          })
          const image = await ProductImage.findByPk(imageId)
          await deleteFileFromFirebase({ url: image.url })
        })
      }

      await product.update(productData, { transaction })

      const images = req.files
      if (images && images.length > 0) {
        const productImages = await Promise.all(
          images.map(async (image) => {
            const uniqueFilename = `/products/${uuidv4()}_${image.originalname}`
            const imageUrl = await uploadFileToFirebase({
              file: image,
              path: uniqueFilename,
            })
            return { url: imageUrl, productId: product.id }
          })
        )
        await ProductImage.bulkCreate(productImages, { transaction })
      }

      const updatedProduct = await Product.findByPk(id, { transaction })

      await transaction.commit()

      res.status(200).json({
        message: 'Product updated successfully',
        data: updatedProduct,
      })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  delete: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const { id } = req.params
      const product = await Product.findByPk(id)
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
          data: null,
        })
      }
      await ProductImage.destroy({ where: { productId: id }, transaction })
      await product.destroy({ transaction })
      await transaction.commit()

      res.status(200).json({
        message: 'Product deleted successfully',
        data: null,
      })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
}
