import { models, Order, OrderLog, Product, Discount } from '@/models'
import { formatError } from '@/utils'
import { sequelize } from '@/config'
import {
  PAYMENT_METHOD,
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIPPING_METHOD,
} from '@/enum'
import { orderValidation } from '@/validation'
import { generateOrderCode, sendOrderConfirmationEmail } from '@/utils'
import { Op } from 'sequelize'
import { getProductWithMaxDiscount } from '@/services'
import { createOrderItems } from '@/services'

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
          { model: models.OrderLog, as: 'orderLogs' },
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
    const account = req.account
    let transaction
    try {
      transaction = await sequelize.transaction()
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
      await order.save({ transaction })
      await OrderLog.create(
        {
          orderId: order.id,
          status: orderStatus,
          updatedBy: account.email,
        },
        { transaction }
      )
      await transaction.commit()
      res.json({ message: 'Update order status successfully' })
    } catch (error) {
      res.status(500).json({
        message:
          formatError(error.toString()) || 'Failed to update order status',
      })
    }
  },
  userCreateOrder: async (req, res) => {
    try {
      const { items, discountCode, ...data } = req.body
      const account = req.account

      const itemsData = JSON.parse(items)
      if (!itemsData || !Array.isArray(itemsData)) {
        return res.status(400).json({
          message: 'Invalid items data',
          data: null,
        })
      }
      if (itemsData.length === 0) {
        return res.status(400).json({
          message: 'Product order is empty',
          data: null,
        })
      }

      const { error } = orderValidation.paypalCreateOrder.validate(data)
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }

      const productIds = itemsData.map((item) => item.productId)
      const products = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
      })
      if (products.length !== productIds.length) {
        return res.status(400).json({
          message: 'Some products are not found',
          data: null,
        })
      }

      const totalAmount = await products.reduce(async (accPromise, product) => {
        const acc = await accPromise
        const maxDiscount = await getProductWithMaxDiscount(product.id)
        const item = itemsData.find((item) => item.productId == product.id)
        if (item) {
          return (
            acc +
            product.standardPrice * item.quantity * (1 - maxDiscount / 100)
          )
        }
        return acc
      }, Promise.resolve(0))

      let discount = 0
      if (discountCode && discountCode !== '') {
        const discountData = await Discount.findOne({
          where: { code: discountCode },
        })
        if (!discountData) {
          return res.status(400).json({
            message: 'Discount code is not found',
            data: null,
          })
        }
        if (!discountData.isActive) {
          return res.status(400).json({
            message: 'Discount code is not active',
            data: null,
          })
        }
        discount = discountData.value
      }

      let transaction
      try {
        transaction = await sequelize.transaction()
        const order = await Order.create(
          {
            ...data,
            totalAmount,
            orderStatus: ORDER_STATUS.PENDING,
            paymentMethod: PAYMENT_METHOD.COD,
            code: generateOrderCode(),
            paymentStatus: PAYMENT_STATUS.PENDING,
            accountId: account.id,
            discount,
            shippingFee:
              data.shippingMethod === SHIPPING_METHOD.STANDARD ? 5 : 10,
          },
          { transaction }
        )
        await createOrderItems(itemsData, transaction, order.id)
        await OrderLog.create(
          {
            orderId: order.id,
            status: ORDER_STATUS.PENDING,
            updatedBy: account.email,
          },
          { transaction }
        )
        await transaction.commit()
        const orderDetails = await Order.findOne({
          where: { id: order.id },
          include: [
            { model: models.OrderItem, as: 'orderItems', include: ['product'] },
          ],
        })
        await sendOrderConfirmationEmail(
          orderDetails.email || account.email,
          orderDetails.toJSON()
        )

        res.status(200).json({
          message: 'Order created successfully',
          orderCode: order.code,
        })
      } catch (error) {
        if (transaction) {
          await transaction.rollback()
        }
        res
          .status(500)
          .json({ message: error.message || 'Failed to create order' })
      }
    } catch (err) {
      res.status(500).json({ message: err.message || 'Failed to create order' })
    }
  },
}

export { orderController }
