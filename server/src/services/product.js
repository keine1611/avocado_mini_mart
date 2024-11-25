import {
  Product,
  BatchProduct,
  OrderItem,
  PriceHistory,
  ProductDiscount,
  Discount,
} from '@/models'
import { Op } from 'sequelize'
import { getToday } from '@/utils'
import { models } from '@/models'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const DATE_FORMAT = process.env.DATE_FORMAT

export const createOrderItems = async (orderItems, transaction, orderId) => {
  try {
    for (const item of orderItems) {
      const { productId, quantity } = item
      let remainingQuantity = quantity

      const batchProducts = await BatchProduct.findAll({
        where: {
          productId,
          quantity: { [Op.gt]: 0 },
          expiredDate: { [Op.gt]: getToday() },
        },
        order: [['expiredDate', 'ASC']],
      })

      for (const batchProduct of batchProducts) {
        if (remainingQuantity <= 0) return

        if (batchProduct.quantity >= remainingQuantity) {
          await batchProduct.update(
            { quantity: batchProduct.quantity - remainingQuantity },
            { transaction }
          )
          remainingQuantity = 0
        } else {
          remainingQuantity -= batchProduct.quantity
          await batchProduct.update({ quantity: 0 }, { transaction })
        }
      }

      const product = await Product.findByPk(productId)
      if (remainingQuantity > 0) {
        throw new Error(product.name + ' quantity is not enough')
      }
      const discount = await getProductWithMaxDiscount(productId)
      await OrderItem.create(
        { ...item, price: product.standardPrice, discount, orderId },
        { transaction }
      )
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to create order items')
  }
}

export const updateProductPrice = async ({
  productId,
  oldPrice,
  newPrice,
  changedBy,
  transaction,
}) => {
  try {
    const changedAt = getToday()
    await PriceHistory.create(
      {
        productId,
        oldPrice,
        newPrice,
        changedBy,
        changedAt,
      },
      { transaction }
    )
  } catch (error) {
    throw new Error(error.message || 'Failed to update product price')
  }
}

export const getProductsWithDetails = async (conditions) => {
  try {
    const products = await Product.findAll({
      where: conditions ? conditions : {},
      include: [
        {
          model: models.Review,
          as: 'reviews',
          attributes: ['rating', 'comment'],
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
        {
          model: models.SubCategory,
          as: 'subCategory',
          include: [
            {
              model: models.MainCategory,
              as: 'mainCategory',
            },
          ],
        },
        {
          model: BatchProduct,
          as: 'batchProducts',
          attributes: ['quantity'],
        },
        {
          model: ProductDiscount,
          as: 'productDiscounts',
          separate: true,
          include: [
            {
              model: Discount,
              as: 'discount',
              where: { isActive: true },
            },
          ],
          required: false,
          attributes: ['discountPercentage'],
          order: [['discountPercentage', 'DESC']],
        },
      ],
    })

    return products.map((product) => {
      const totalQuantity = product.batchProducts.reduce(
        (acc, batch) => acc + batch.quantity,
        0
      )
      const highestDiscount =
        product.productDiscounts.length > 0
          ? product.productDiscounts[0].discountPercentage
          : 0

      return {
        ...product.toJSON(),
        totalQuantity,
        highestDiscount,
      }
    })
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch products with details')
  }
}

export const getProductByIds = async (productIds) => {
  try {
    const products = await Promise.all(
      productIds.map(async (productId) => {
        return await getProductById(productId)
      })
    )
    return products
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch products by ids')
  }
}

export const getProductById = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: models.Review,
        as: 'reviews',
        attributes: ['rating', 'comment'],
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
      {
        model: models.SubCategory,
        as: 'subCategory',
        include: [
          {
            model: models.MainCategory,
            as: 'mainCategory',
          },
        ],
      },
      {
        model: BatchProduct,
        as: 'batchProducts',
        attributes: ['quantity'],
      },
      {
        model: ProductDiscount,
        as: 'productDiscounts',
        separate: true,
        include: [
          {
            model: Discount,
            as: 'discount',
            where: { isActive: true },
          },
        ],
        required: false,
        attributes: ['discountPercentage'],
        order: [['discountPercentage', 'DESC']],
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
    if (dayjs(batch.expiredDate, DATE_FORMAT).isAfter(dayjs())) {
      return acc + batch.quantity
    }
    return acc
  }, 0)

  return {
    ...product.toJSON(),
    totalQuantity,
    maxDiscount,
    rating,
  }
}

export const getProductWithMaxDiscount = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: ProductDiscount,
        as: 'productDiscounts',
        required: false,
        separate: true,
        attributes: ['discountPercentage'],
        order: [['discountPercentage', 'DESC']],
        include: [
          {
            model: Discount,
            as: 'discount',
            where: { isActive: true },
          },
        ],
      },
    ],
  })
  if (!product) {
    throw new Error('Product not found')
  }
  const maxDiscount = product.productDiscounts.reduce(
    (max, discount) => Math.max(max, discount.discountPercentage),
    0
  )

  return maxDiscount
}

export const getRecommendedProducts = async (productId) => {
  const product = await Product.findByPk(productId)
  const products = await getProductsWithDetails({
    subCategoryId: product.subCategoryId,
    id: { [Op.ne]: productId },
    status: 'active',
  })
  const activeProducts = products.filter((product) => product.totalQuantity > 0)
  return activeProducts
}
