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
  getOrderById: async (req, res) => {
    try {
      const { orderCode } = req.params
      const order = await Order.findOne({
        where: { code: orderCode },
        include: [
          { model: models.OrderItem, as: 'orderItems', include: ['product'] },
        ],
      })
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
      res.json({ message: 'Get order by id successfully', data: order })
    } catch (error) {
      res.status(500).json({
        message: formatError(error),
        data: null,
      })
    }
  },
  updateOrderStatus: async (req, res) => {
    const { orderStatus } = req.body
    const { orderCode } = req.params
    try {
      if (!orderCode || !orderStatus) {
        return res
          .status(400)
          .json({ message: 'Order code and order status are required' })
      }
      const order = await Order.findOne({ where: { code: orderCode } })
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
      order.orderStatus = orderStatus
      await order.save()
      res.json({ message: 'Update order status successfully' })
    } catch (error) {
      res.status(500).json({
        message:
          formatError(error.toString()) || 'Failed to update order status',
      })
    }
  },
}

export { orderController }
