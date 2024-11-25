import { client } from '@/config'
import paypal from '@paypal/checkout-server-sdk'
import { Product, Order, OrderItem, Discount, OrderLog } from '@/models'
import { Op } from 'sequelize'
import { orderValidation } from '@/validation'
import { PAYMENT_METHOD, PAYMENT_STATUS, ORDER_STATUS } from '@/enum'
import { sequelize } from '@/config'
import { generateOrderCode } from '@/utils'
import { createOrderItems, getProductWithMaxDiscount } from '@/services'

const paymentController = {
  paypalCreateOrder: async (req, res) => {
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
      console.log(itemsData)
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

      const paymentAmount =
        totalAmount + (data.shippingMethod === 'standard' ? 5 : 10)

      const request = new paypal.orders.OrdersCreateRequest()
      request.prefer('return=representation')
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { value: paymentAmount.toString(), currency_code: 'USD' },
            address: {
              country_code: 'VN',
            },
          },
        ],
      })
      let discount = 0
      if (discountCode) {
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
      const order = await Order.findOne({ where: { code: orderCode } })
      if (response.result.status === 'COMPLETED') {
        if (order.paymentStatus === PAYMENT_STATUS.PENDING) {
          await order.update({ paymentStatus: PAYMENT_STATUS.PAID })
          await order.save()
        }
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
    const { orderCode } = req.body
    await Order.update(
      { orderStatus: ORDER_STATUS.CANCELLED },
      { where: { code: orderCode } }
    )
    res.status(200).json({ message: 'Order cancelled' })
  },
}

export { paymentController }
