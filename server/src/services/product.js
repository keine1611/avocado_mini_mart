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
      where: conditions,
      include: [
        {
          model: BatchProduct,
          as: 'batchProducts',
          attributes: ['quantity'],
        },
        {
          model: ProductDiscount,
          as: 'productDiscounts',
          where: {
            isActive: true,
          },
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
  const products = await Product.findAll({
    where: { id: { [Op.in]: productIds } },
  })
  return products
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
