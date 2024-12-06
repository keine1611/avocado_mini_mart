import { Cart } from '@/models'

const cartController = {
  getUserCart: async (req, res) => {
    const account = req.account
    const cart = await Cart.findOne({ accountId: account._id })
    res.status(200).json(cart)
  },
}

export { cartController }
