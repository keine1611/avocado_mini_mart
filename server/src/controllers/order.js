import { Order } from '@/models'

const orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll()
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
