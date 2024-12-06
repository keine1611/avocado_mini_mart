import {
  models,
  Order,
  OrderLog,
  Product,
  Discount,
  DiscountCode,
  OrderItemBatch,
  BatchProduct,
} from '@/models'
import { formatError } from '@/utils'
import { sequelize } from '@/config'
import {
  PAYMENT_METHOD,
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIPPING_METHOD,
  DISCOUNT_TYPE,
} from '@/enum'
import { orderValidation } from '@/validation'
import { generateOrderCode, sendOrderConfirmationEmail } from '@/utils'
import { Op } from 'sequelize'
import { getProductWithMaxDiscount } from '@/services'
import { createOrderItems } from '@/services'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { refundOrder } from '@/controllers/payment'

const DATE_FORMAT = process.env.DATE_FORMAT

const orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: models.OrderItem,
            as: 'orderItems',
            include: [
              { model: models.Product, as: 'product' },
              {
                model: models.OrderItemBatch,
                as: 'orderItemBatches',
                include: [
                  {
                    model: models.Batch,
                    as: 'batch',
                    include: [
                      {
                        model: models.BatchProduct,
                        as: 'batchProducts',
                        required: false,
                        where: sequelize.literal(
                          '`orderItems->product`.`id` = `orderItems->orderItemBatches->batch->batchProducts`.`productId`'
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { model: models.OrderLog, as: 'orderLogs' },
        ],
        order: [['createdAt', 'DESC']],
      })

      const ordersWithMetrics = orders.map((order) => {
        let totalCost = 0
        let revenue = order.totalAmount - order.discount

        order.orderItems.forEach((orderItem) => {
          orderItem.orderItemBatches.forEach((orderItemBatch) => {
            const batchProduct = orderItemBatch.batch.batchProducts[0]
            if (batchProduct) {
              totalCost += orderItemBatch.quantity * batchProduct.price
            }
          })
        })

        return {
          ...order.toJSON(),
          totalCost,
          profit: revenue - totalCost,
        }
      })

      res.json({
        message: 'Get orders successfully',
        data: ordersWithMetrics,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.toString()) || 'Failed to get orders',
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
          {
            model: models.OrderItem,
            as: 'orderItems',
            include: [
              {
                model: models.Product,
                as: 'product',
                include: [
                  {
                    model: models.SubCategory,
                    as: 'subCategory',
                    include: [
                      { model: models.MainCategory, as: 'mainCategory' },
                    ],
                  },
                ],
              },
            ],
          },
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
      const order = await Order.findOne({
        where: { code: orderCode },
        include: [
          {
            model: models.OrderItem,
            as: 'orderItems',
            include: [
              {
                model: models.OrderItemBatch,
                as: 'orderItemBatches',
              },
            ],
          },
        ],
      })
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
      if (order.orderStatus === ORDER_STATUS.CANCELLED) {
        return res.status(400).json({ message: 'Order is cancelled' })
      }
      if (order.orderStatus === ORDER_STATUS.DELIVERED) {
        return res.status(400).json({ message: 'Order is delivered' })
      }
      if (
        orderStatus === ORDER_STATUS.PENDING &&
        order.paymentMethod === PAYMENT_METHOD.PAYPAL &&
        order.paymentStatus === PAYMENT_STATUS.PENDING
      ) {
        return res
          .status(400)
          .json({ message: 'Order is waiting for payment!' })
      }
      if (
        orderStatus === ORDER_STATUS.CANCELLED ||
        orderStatus === ORDER_STATUS.REJECTED
      ) {
        for (const orderItem of order.orderItems) {
          for (const orderItemBatch of orderItem.orderItemBatches) {
            const batchProduct = await BatchProduct.findOne({
              where: {
                batchId: orderItemBatch.batchId,
                productId: orderItem.productId,
              },
            })
            if (batchProduct) {
              await batchProduct.update(
                { quantity: batchProduct.quantity + orderItemBatch.quantity },
                { transaction }
              )
            }
          }
        }
      }
      order.orderStatus = orderStatus
      if (
        orderStatus === ORDER_STATUS.DELIVERED &&
        order.paymentMethod === PAYMENT_METHOD.COD
      ) {
        order.paymentStatus = PAYMENT_STATUS.PAID
      }
      await order.save({ transaction })
      await OrderLog.create(
        {
          orderId: order.id,
          status: orderStatus,
          updatedBy: account.email,
        },
        { transaction }
      )
      if (orderStatus === ORDER_STATUS.REJECTED) {
        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
          await refundOrder({
            captureId: order.paymentId,
            amount: order.totalAmount + order.shippingFee - order.discount || 0,
          })
          order.paymentStatus = PAYMENT_STATUS.REFUNDED
        }
      }
      await transaction.commit()
      res.json({ message: 'Update order status successfully' })
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
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
      let transaction
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
        const discountData = await DiscountCode.findOne({
          where: {
            code: discountCode,
            isActive: true,
            expiryDate: { [Op.gte]: global.dayjs().format(DATE_FORMAT) },
            timesUsed: { [Op.lt]: sequelize.col('usageLimit') },
          },
        })
        if (!discountData) {
          return res.status(400).json({
            message: 'Discount code is not found',
            data: null,
          })
        }
        if (discountData.discountType == DISCOUNT_TYPE.PERCENTAGE) {
          discount = (totalAmount * discountData.discountValue) / 100
        } else {
          if (discountData.discountValue > totalAmount) {
            discount = totalAmount
          } else {
            discount = discountData.discountValue
          }
        }
        discountData.timesUsed += 1
        await discountData.save({ transaction })
      }

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
        try {
          await sendOrderConfirmationEmail(
            orderDetails.email || account.email,
            orderDetails.toJSON()
          )
        } catch (error) {}

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
