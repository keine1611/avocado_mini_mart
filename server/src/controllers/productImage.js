const { ProductImage } = require('../models')

const productImageController = {
  createProductImage: async (req, res) => {
    try {
      const productImage = await ProductImage.create(req.body)
      res.status(201).json(productImage)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  deleteProductImage: async (req, res) => {
    try {
      const productImage = await ProductImage.findByPk(req.params.id)
      if (!productImage) {
        return res.status(404).json({ error: 'Product image not found' })
      }
      await productImage.destroy()
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = productImageController
