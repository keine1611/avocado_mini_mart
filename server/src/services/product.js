import { Product, Batch, OrderItem } from '@/models'
import { batchStatus } from '@/enum'
import { Op } from 'sequelize'

export const createOrderItems = async (orderItems, transaction, orderId) => {
  try {
    for (const item of orderItems) {
      const { productId, quantity } = item
      let remainingQuantity = quantity
      const batches = await Batch.findAll({
        where: {
          productId,
          quantity: { [Op.gt]: 0 },
          status: batchStatus.AVAILABLE,
        },
        order: [['expirationDate', 'ASC']],
      })
      for (const batch of batches) {
        if (remainingQuantity <= 0) return
        if (batch.quantity >= remainingQuantity) {
          await batch.update(
            { quantity: batch.quantity - remainingQuantity },
            { transaction }
          )
          remainingQuantity = 0
        } else {
          remainingQuantity -= batch.quantity
          await batch.update({ quantity: 0 }, { transaction })
        }
      }
      const product = await Product.findByPk(productId)
      if (remainingQuantity > 0) {
        throw new Error(product.name + ' quantity is not enough')
      }
      await OrderItem.create(
        { ...item, price: product.standardPrice, orderId },
        { transaction }
      )
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to create order items')
  }
}
