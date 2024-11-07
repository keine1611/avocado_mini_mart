import { models, Product, ProductImage } from '@/models'
import { sequelize } from '@/config'
import {
  getPagination,
  decodeQueryFromBase64,
  getSort,
  getSearch,
  uploadFileToFirebase,
  deleteFileFromFirebase,
  formatError,
} from '@/utils'
import { Op } from 'sequelize'
import { productValidation } from '@/validation'
import { v4 as uuidv4 } from 'uuid'

export const productController = {
  getAll: async (req, res) => {
    try {
      const { param } = req.query
      let { page, size, sort, order, search, maincategory, subcategory } =
        (subcategory = await decodeQueryFromBase64({
          param,
        }))

      const productWhereCondition = {}
      const subCategoryWhereCondition = {}
      if (search) productWhereCondition.name = { [Op.like]: `%${search}%` }
      if (maincategory) {
        const mainCT = await models.MainCategory.findOne({
          where: { slug: maincategory },
        })
        subCategoryWhereCondition.mainCategoryId = mainCT.id
      }
      if (subcategory) {
        subCategoryWhereCondition.slug = subcategory
      }

      const { limit, offset } = await getPagination({ page, size })

      const { rows: products, count } = await Product.findAndCountAll({
        where: productWhereCondition,
        order: order && sort ? [[sort, order]] : [['createdAt', 'DESC']],
        limit,
        offset,
        include: [
          { model: models.Brand, as: 'brand' },
          { model: models.ProductImage, as: 'productImages' },
          {
            model: models.SubCategory,
            as: 'subCategory',
            include: [{ model: models.MainCategory, as: 'mainCategory' }],
            where: subCategoryWhereCondition,
          },
          {
            model: models.ProductDiscount,
            as: 'productDiscounts',
            include: {
              model: models.Discount,
              as: 'discount',
              attributes: ['discountPercentage'],
            },
          },
        ],
      })

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: {
          data: products,
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
      const mainImage = req.files.mainImage[0]

      if (!mainImage) {
        return res.status(400).json({
          message: 'No main image provided',
          data: null,
        })
      }

      const uniqueFilename = `/products/${uuidv4()}_${mainImage.originalname}`
      const imageUrl = await uploadFileToFirebase({
        file: mainImage,
        path: uniqueFilename,
      })

      const product = await Product.create(
        { ...productData, mainImage: imageUrl },
        { transaction }
      )

      const images = req.files.images
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
      const mainImage = req.files.mainImage ? req.files.mainImage[0] : null
      if (mainImage) {
        const uniqueFilename = `/products/${uuidv4()}_${mainImage.originalname}`
        const imageUrl = await uploadFileToFirebase({
          file: mainImage,
          path: uniqueFilename,
        })
        await product.update({ mainImage: imageUrl }, { transaction })
      }

      await product.update(productData, { transaction })

      const images = req.files.images
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
  getDetail: async (req, res) => {
    try {
      const { slug } = req.params
      const product = await Product.findOne({
        where: { slug },
        include: [
          { model: models.Brand, as: 'brand' },
          { model: models.ProductImage, as: 'productImages' },
          {
            model: models.SubCategory,
            as: 'subCategory',
            include: [{ model: models.MainCategory, as: 'mainCategory' }],
          },
          {
            model: models.ProductDiscount,
            as: 'productDiscounts',
            include: {
              model: models.Discount,
              as: 'discount',
            },
          },
        ],
      })
      res.status(200).json({
        message: 'Product detail retrieved successfully',
        data: product,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getListProductByIds: async (req, res) => {
    try {
      const { ids } = req.params
      const products = await Product.findAll({
        where: { id: { [Op.in]: ids } },
      })
      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getAllProductWithoutPagination: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: models.Brand, as: 'brand' },
          { model: models.ProductImage, as: 'productImages' },
        ],
      })
      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
}
