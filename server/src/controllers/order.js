import { models, Order } from '@/models'
import { formatError } from '@/utils'

const orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: models.OrderItem, as: 'orderItems', include: ['product'] },
        ],
      })
      res.json({
        message: 'Get orders successfully',
        data: orders,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error),
        data: null,
      })
    }
  },
}

export { orderController }
