import { client } from '@/config'
import paypal from '@paypal/checkout-server-sdk'
import {
  Product,
  Order,
  OrderItem,
  DiscountCode,
  OrderLog,
  OrderItemBatch,
  BatchProduct,
} from '@/models'
import { Op } from 'sequelize'
import { orderValidation } from '@/validation'
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ORDER_STATUS,
  DISCOUNT_TYPE,
  ACCOUNT_STATUS,
} from '@/enum'
import { sequelize } from '@/config'
import { generateOrderCode } from '@/utils'
import {
  createOrderItems,
  getProductWithMaxDiscount,
  orderService,
} from '@/services'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const DATE_FORMAT = process.env.DATE_FORMAT

const paymentController = {
  paypalCreateOrder: async (req, res) => {
    try {
      const { items, discountCode, ...data } = req.body
      const account = req.account
      if (account.status === ACCOUNT_STATUS.RESTRICTED) {
        return res.status(400).json({
          message: 'Account is restricted',
          data: null,
        })
      }
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
      const paymentAmount =
        totalAmount + (data.shippingMethod === 'standard' ? 5 : 10) - discount

      const request = new paypal.orders.OrdersCreateRequest()
      request.prefer('return=representation')
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: paymentAmount.toFixed(2).toString(),
              currency_code: 'USD',
            },
            address: {
              country_code: 'VN',
            },
          },
        ],
      })

      try {
        transaction = await sequelize.transaction()
        const response = await client.execute(request)
        const order = await Order.create(
          {
            ...data,
            totalAmount,
            paymentMethod: PAYMENT_METHOD.PAYPAL,
            paymentStatus: PAYMENT_STATUS.PENDING,
            code: generateOrderCode(),
            orderStatus: ORDER_STATUS.PENDING,
            shippingFee: data.shippingMethod === 'standard' ? 5 : 10,
            accountId: account.id,
            discount,
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
        res.status(200).json({
          paymentOrderID: response.result.id,
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
  paypalVerifyOrder: async (req, res) => {
    const { orderCode, paypalOrderID } = req.body
    try {
      const response = await client.execute(
        new paypal.orders.OrdersGetRequest(paypalOrderID)
      )
      const order = await Order.findOne({
        where: { code: orderCode },
        include: [{ model: OrderItem, as: 'orderItems', include: ['product'] }],
      })
      if (response.result.status === 'COMPLETED') {
        if (order.paymentStatus === PAYMENT_STATUS.PENDING) {
          await order.update({ paymentStatus: PAYMENT_STATUS.PAID })
          await order.update({
            paymentId:
              response.result.purchase_units[0].payments.captures[0].id,
          })
          await order.save()
        }
        try {
          await sendOrderConfirmationEmail(
            order.email || order.account.email,
            order.toJSON()
          )
        } catch (error) {}
        res.status(200).json({ message: 'Order completed' })
      } else {
        res.status(400).json({ message: 'Order not completed' })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || 'Failed to verify order' })
    }
  },
  cancelOrder: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const account = req.account
      const { orderCode } = req.params
      const order = await Order.findOne({
        where: { code: orderCode },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [{ model: OrderItemBatch, as: 'orderItemBatches' }],
          },
        ],
      })
      if (!order) {
        return res.status(400).json({ message: 'Order not found' })
      }
      if (order.orderStatus !== ORDER_STATUS.PENDING) {
        return res.status(400).json({ message: 'Order is not pending' })
      }
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        await refundOrder({
          captureId: order.paymentId,
          amount: order.totalAmount + order.shippingFee - order.discount || 0,
        })
        await order.update(
          { paymentStatus: PAYMENT_STATUS.REFUNDED },
          { transaction }
        )
      }
      await order.update(
        {
          orderStatus: ORDER_STATUS.CANCELLED,
          updatedBy: account.email,
        },
        { transaction }
      )
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
      await OrderLog.create(
        {
          orderId: order.id,
          status: ORDER_STATUS.CANCELLED,
          updatedBy: account.email,
        },
        { transaction }
      )
      await order.save({ transaction })
      const numberOfCancelledOrders =
        await orderService.getNumberOfCancelledOrdersOfAccountIn24Hours(
          account.id
        )
      if (numberOfCancelledOrders >= 5) {
        await account.update(
          {
            status: ACCOUNT_STATUS.RESTRICTED,
            restrictedUntil: global.dayjs().add(1, 'day').format(DATE_FORMAT),
            note: 'Account is restricted due to too many cancelled orders',
          },
          { transaction }
        )
        await transaction.commit()
        return res
          .status(200)
          .json({ message: 'Order cancelled. Account is restricted' })
      }
      await transaction.commit()
      res.status(200).json({ message: 'Order cancelled' })
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      res
        .status(500)
        .json({ message: error.message || 'Failed to cancel order' })
    }
  },
  retryPaypalOrder: async (req, res) => {
    try {
      const { orderCode } = req.params
      const order = await Order.findOne({ where: { code: orderCode } })
      if (!order) {
        return res.status(400).json({ message: 'Order not found' })
      }
      if (order.paymentMethod !== PAYMENT_METHOD.PAYPAL) {
        return res.status(400).json({ message: 'Order is not paid by paypal' })
      }
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return res.status(400).json({ message: 'Order is already paid' })
      }
      const request = new paypal.orders.OrdersCreateRequest()
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: (
                order.totalAmount +
                order.shippingFee -
                order.discount
              ).toString(),
              currency_code: 'USD',
            },
          },
        ],
      })
      const response = await client.execute(request)
      res.status(200).json({ paymentOrderID: response.result.id })
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || 'Failed to retry paypal order' })
    }
  },
}

export { paymentController }

export const refundOrder = async ({ captureId, amount }) => {
  try {
    const request = new paypal.payments.CapturesRefundRequest(captureId)
    request.requestBody({ amount: { value: amount, currency_code: 'USD' } })
    const response = await client.execute(request)
    return response
  } catch (error) {
    throw error
  }
}
