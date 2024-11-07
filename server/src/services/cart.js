import { Cart, Product } from '../models'
import { sequelize } from '@/config'

const cartService = {
  syncCart: async ({ cartItems, accountId }) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      await Cart.destroy({ where: { accountId }, transaction })
      await Cart.bulkCreate(
        cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          accountId,
        })),
        { transaction }
      )

      await transaction.commit()
      const cart = await Cart.findAll({
        where: { accountId },
        include: [{ model: Product, as: 'product' }],
      })
      return cart
    } catch (error) {
      if (transaction) await transaction.rollback()
      return Cart.findAll({
        where: { accountId },
        include: [{ model: Product, as: 'product' }],
      })
    }
  },
}

export { cartService }
