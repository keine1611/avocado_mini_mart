import { OrderItem, Review, ReviewMedia, Product, Order } from '@/models'
import { uploadFileToFirebase } from '@/utils'
import { sequelize } from '@/config'
import { ORDER_STATUS } from '@/enum'

const reviewController = {
  createReview: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const { orderItemId, ...review } = req.body
      const files = req.files

      const account = req.account
      const orderItem = await OrderItem.findByPk(orderItemId, {
        include: [{ model: Order, as: 'order' }],
        transaction,
      })
      if (!orderItem) throw new Error('Order item not found')
      if (orderItem.isReviewed)
        throw new Error('Order item is already reviewed')
      if (orderItem.order.orderStatus !== ORDER_STATUS.DELIVERED)
        throw new Error('Order is not delivered')
      const product = await Product.findByPk(orderItem.productId, {
        transaction,
      })
      if (!product) throw new Error('Product not found')
      const reviewCreated = await Review.create(
        {
          rating: review.rating,
          comment: review.comment,
          productId: product.id,
          accountId: account.id,
        },
        { transaction }
      )

      orderItem.isReviewed = true
      await orderItem.save({ transaction })

      if (files && files.length > 0) {
        const mediaPromises = files.map(async (file) => {
          const uniqueFilename = `/reviews/${review.id}_${file.originalname}`
          const url = await uploadFileToFirebase({ file, path: uniqueFilename })

          return ReviewMedia.create(
            {
              reviewId: reviewCreated.id,
              mediaType: file.mimetype.startsWith('image') ? 'image' : 'video',
              url,
            },
            { transaction }
          )
        })

        await Promise.all(mediaPromises)
      }
      await transaction.commit()
      res.status(200).json({ message: 'Review created successfully' })
    } catch (error) {
      if (transaction) await transaction.rollback()
      res.status(500).json({ error: error.message })
    }
  },
  getReviews: async (req, res) => {
    const { productId } = req.params
    const reviews = await Review.findAll({ where: { productId } })
    res.status(200).json(reviews)
  },
}

export { reviewController }
