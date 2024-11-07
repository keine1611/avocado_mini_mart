import { client } from '@/config'
import paypal from '@paypal/checkout-server-sdk'
import { Product, Order, OrderItem, Discount } from '@/models'
import { Op } from 'sequelize'
import { orderValidation } from '@/validation'
import { PAYMENT_METHOD, PAYMENT_STATUS, ORDER_STATUS } from '@/enum'
import { sequelize } from '@/config'
import { generateOrderCode } from '@/utils'
import { createOrderItems } from '@/services'

const paymentController = {
  paypalCreateOrder: async (req, res) => {
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
    const totalAmount = products.reduce((acc, product) => {
      return (
        acc +
        product.standardPrice *
          itemsData.find((item) => item.productId === product.id).quantity
      )
    }, 0)

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        { amount: { value: totalAmount.toString(), currency_code: 'USD' } },
      ],
    })
    let discount = 0
    if (discountCode) {
      const discountData = await Discount.findOne({
        where: { code: discountCode },
      })
      if (discountData) {
        discount = discountData.value
      }
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
        },
        { transaction }
      )
      await createOrderItems(itemsData, transaction, order.id)
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
  },
  paypalVerifyOrder: async (req, res) => {
    console.log(req.body)
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
