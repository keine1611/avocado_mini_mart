import { client } from '@/config'
import paypal from '@paypal/checkout-server-sdk'

const paymentController = {
  paypalCreateOrder: async (req, res) => {
    console.log(req.body)

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { value: '100.00', currency_code: 'USD' } }],
    })
    try {
      const response = await client.execute(request)
      res
        .status(200)
        .json({ orderID: response.result.id, status: response.result.status })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    }
  },
  paypalVerifyOrder: async (req, res) => {
    const { orderID } = req.body
    try {
      const response = await client.execute(
        new paypal.orders.OrdersGetRequest(orderID)
      )
      if (response.result.status === 'COMPLETED') {
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
}

export { paymentController }
