import { models, Product, ProductImage, BatchProduct } from '@/models'
import { sequelize } from '@/config'
import _, { includes } from 'lodash'
import {
  getPagination,
  decodeQueryFromBase64,
  uploadFileToFirebase,
  deleteFileFromFirebase,
  formatError,
  stringToDayjs,
  getToday,
} from '@/utils'
import { Op } from 'sequelize'
import { productValidation } from '@/validation'
import { v4 as uuidv4 } from 'uuid'
import { statusProduct } from '@/enum'
import dayjs from 'dayjs'

import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import {
  updateProductPrice,
  getRecommendedProducts,
  getProductsWithDetails,
} from '@/services'
import { getProductByIds, getFeaturedProducts } from '@/services'

const { DATE_FORMAT } = process.env

export const productController = {
  getAll: async (req, res) => {
    try {
      const { param } = req.query
      let {
        page,
        size,
        sort,
        order,
        search,
        maincategory,
        subcategory,
        maxprice,
        minprice,
      } = await decodeQueryFromBase64({
        param,
      })

      const productWhereCondition = { status: statusProduct.ACTIVE }
      if (minprice !== undefined && minprice !== null) {
        productWhereCondition[Op.and] = [
          ...(productWhereCondition[Op.and] || []),
          sequelize.where(
            sequelize.literal(`
              standardPrice * (1 - COALESCE((
                SELECT MAX(discountPercentage)
                FROM product_discounts pd
                JOIN discounts d ON pd.discountId = d.id
                WHERE pd.productId = Product.id AND d.isActive = true
              ), 0) / 100)
            `),
            {
              [Op.gte]: Number(minprice),
            }
          ),
        ]
      }

      if (maxprice !== undefined && maxprice !== null) {
        productWhereCondition[Op.and] = [
          ...(productWhereCondition[Op.and] || []),
          sequelize.where(
            sequelize.literal(`
              standardPrice * (1 - COALESCE((
                SELECT MAX(discountPercentage)
                FROM product_discounts pd
                JOIN discounts d ON pd.discountId = d.id
                WHERE pd.productId = Product.id AND d.isActive = true
              ), 0) / 100)
            `),
            {
              [Op.lte]: Number(maxprice),
            }
          ),
        ]
      }

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
        distinct: true,
        required: false,
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
            model: models.BatchProduct,
            as: 'batchProducts',
            attributes: ['quantity', 'expiredDate'],
          },
          {
            model: models.ProductDiscount,
            as: 'productDiscounts',
            separate: true,
            required: false,
            include: {
              model: models.Discount,
              as: 'discount',
              where: { isActive: true },
            },
            attributes: ['discountPercentage'],
            order: [['discountPercentage', 'DESC']],
          },
        ],
      })

      const productsWithDetails = products.map((product) => {
        const totalQuantity = product.batchProducts.reduce((acc, batch) => {
          if (dayjs(batch.expiredDate, DATE_FORMAT).isAfter(global.dayjs())) {
            return acc + batch.quantity
          }
          return acc
        }, 0)
        const highestDiscount =
          product.productDiscounts.length > 0
            ? product.productDiscounts[0].discountPercentage
            : 0
        return {
          ...product.toJSON(),
          totalQuantity,
          maxDiscount: highestDiscount,
        }
      })

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: {
          data: productsWithDetails,
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
      const account = req.account
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

      await updateProductPrice({
        productId: product.id,
        oldPrice: 0,
        newPrice: productData.standardPrice,
        changedBy: account.email,
        transaction,
      })

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
      const account = req.account
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

      if (product.standardPrice !== productData.standardPrice) {
        await updateProductPrice({
          productId: product.id,
          oldPrice: product.standardPrice,
          newPrice: productData.standardPrice,
          changedBy: account.email,
          transaction,
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
            model: models.Review,
            as: 'reviews',
            attributes: ['rating', 'comment', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: models.Account,
                as: 'account',
                attributes: ['email', 'avatarUrl'],
              },
              {
                model: models.ReviewMedia,
                as: 'reviewMedia',
                attributes: ['url', 'mediaType'],
              },
            ],
          },
        ],
      })

      const productDiscounts = await models.ProductDiscount.findAll({
        where: { productId: product.id },
        include: {
          model: models.Discount,
          as: 'discount',
          where: { isActive: true },
        },
        attributes: ['discountPercentage'],
        order: [['discountPercentage', 'DESC']],
      })

      const rating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => {
              return acc + review.rating
            }, 0) / product.reviews.length
          : 0
      const maxDiscount =
        productDiscounts.length > 0 ? productDiscounts[0].discountPercentage : 0

      const batchProducts = await BatchProduct.findAll({
        where: { productId: product.id },
      })
      const totalQuantity = batchProducts.reduce((acc, batch) => {
        if (dayjs(batch.expiredDate, DATE_FORMAT).isAfter(global.dayjs())) {
          return acc + batch.quantity
        }
        return acc
      }, 0)

      const recommendedProducts = await getRecommendedProducts(product.id)
      const shuffledProducts = _.shuffle(recommendedProducts).slice(0, 10)

      res.status(200).json({
        message: 'Product detail retrieved successfully',
        data: {
          ...product.dataValues,
          maxDiscount,
          totalQuantity,
          rating,
          recommendedProducts: shuffledProducts,
        },
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
      const { ids } = req.query
      const arrIds = JSON.parse(ids)
      const products = await getProductByIds(arrIds)
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
  getBatchProduct: async (req, res) => {
    try {
      const { id } = req.params
      const product = await Product.findByPk(id, {
        include: [
          { model: models.Brand, as: 'brand' },
          { model: models.SubCategory, as: 'subCategory' },
        ],
      })
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
          data: null,
        })
      }
      const batchProduct = await BatchProduct.findAll({
        where: { productId: id },
        include: [{ model: models.Batch, as: 'batch' }],
      })
      const productStock = batchProduct.reduce((acc, curr) => {
        if (
          dayjs(curr.expiredDate, DATE_FORMAT).isAfter(global.dayjs()) &&
          dayjs(curr.batch.arrivalDate, DATE_FORMAT).isBefore(global.dayjs())
        ) {
          return acc + curr.quantity
        }
        return acc
      }, 0)
      const expectedStock = batchProduct.reduce((acc, curr) => {
        if (dayjs(curr.expiredDate, DATE_FORMAT).isAfter(global.dayjs())) {
          return acc + curr.quantity
        }
        return acc
      }, 0)
      res.status(200).json({
        message: 'Batch product retrieved successfully',
        data: {
          product: {
            ...product.dataValues,
            stock: productStock,
            expectedStock,
          },
          batchProduct,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getLowStockProduct: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: models.SubCategory, as: 'subCategory' },
          { model: models.Brand, as: 'brand' },
        ],
      })
      const lowStockProducts = await Promise.all(
        products.map(async (product) => {
          const batchProduct = await BatchProduct.findAll({
            where: { productId: product.id },
          })
          const stock = batchProduct.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          )
          if (stock < 10) {
            return { ...product.dataValues, stock }
          }
          return null
        })
      )
      res.status(200).json({
        message: 'Low stock product retrieved successfully',
        data: lowStockProducts.filter((product) => product),
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getNearlyExpiredProduct: async (req, res) => {
    try {
      const { param } = req.query
      const { days = 7 } = await decodeQueryFromBase64({ param })

      const products = await Product.findAll({
        include: [
          { model: models.SubCategory, as: 'subCategory' },
          { model: models.Brand, as: 'brand' },
        ],
      })
      const nearlyExpiredProducts = await Promise.all(
        products.map(async (product) => {
          const batchProductExpiredDate = []
          const batchProducts = await BatchProduct.findAll({
            where: { productId: product.id },
            include: [{ model: models.Batch, as: 'batch' }],
          })
          batchProducts.forEach((batchProduct) => {
            const expiredDate = stringToDayjs(batchProduct.expiredDate)
            if (
              expiredDate.isBefore(dayjs(new Date()).add(days, 'day'), 'day') &&
              expiredDate.isAfter(dayjs(new Date()), 'day')
            ) {
              batchProductExpiredDate.push(batchProduct)
            }
          })
          if (batchProductExpiredDate.length > 0) {
            return {
              ...product.dataValues,
              batchProduct: batchProductExpiredDate,
            }
          }
          return null
        })
      )
      res.status(200).json({
        message: 'Nearly expired product retrieved successfully',
        data: nearlyExpiredProducts.filter((product) => product),
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getExpiredProduct: async (req, res) => {
    try {
      const { param } = req.query
      const { days = 1000000000000 } = await decodeQueryFromBase64({ param })
      const products = await Product.findAll({
        include: [
          { model: models.SubCategory, as: 'subCategory' },
          { model: models.Brand, as: 'brand' },
        ],
      })

      const expiredProducts = await Promise.all(
        products.map(async (product) => {
          const batchProductExpiredDate = []
          const batchProducts = await BatchProduct.findAll({
            where: { productId: product.id },
            include: [{ model: models.Batch, as: 'batch' }],
          })
          batchProducts.forEach((batchProduct) => {
            const expiredDate = stringToDayjs(batchProduct.expiredDate)
            if (
              expiredDate.isBefore(global.dayjs(), 'day') &&
              expiredDate.isAfter(global.dayjs().subtract(days, 'day'), 'day')
            ) {
              batchProductExpiredDate.push(batchProduct)
            }
          })

          if (batchProductExpiredDate.length > 0) {
            return {
              ...product.dataValues,
              batchProduct: batchProductExpiredDate,
            }
          }
          return null
        })
      )
      res.status(200).json({
        message: 'Expired product retrieved successfully',
        data: expiredProducts.filter((product) => product !== null),
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  getHomeData: async (req, res) => {
    try {
      const featuredProducts = await getFeaturedProducts()
      const freshProduceProducts = await getProductsWithDetails({
        subCategoryId: { [Op.in]: [4, 5] },
        status: statusProduct.ACTIVE,
      })
      const fastFoodProducts = await getProductsWithDetails({
        subCategoryId: { [Op.in]: [1, 2, 3] },
        status: statusProduct.ACTIVE,
      })
      const beverageProducts = await getProductsWithDetails({
        subCategoryId: { [Op.in]: [6, 7, 8] },
        status: statusProduct.ACTIVE,
      })
      res.status(200).json({
        message: 'Home data retrieved successfully',
        data: {
          featuredProducts,
          freshProduceProducts,
          fastFoodProducts,
          beverageProducts,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  updateProductPrice: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const { id } = req.params
      const { standardPrice } = req.body
      const product = await Product.findByPk(id)
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }
      const updatedProduct = await Product.update(
        { standardPrice },
        { where: { id }, transaction }
      )
      const productHistory = await models.PriceHistory.create(
        {
          productId: id,
          oldPrice: product.standardPrice,
          newPrice: standardPrice,
          changedBy: req.account.email,
          changedAt: getToday(),
        },
        { transaction }
      )
      await transaction.commit()
      res.status(200).json({
        message: 'Product price updated successfully',
        data: updatedProduct,
      })
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      res.status(500).json({
        message: formatError(error.message),
      })
    }
  },
}
