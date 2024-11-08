import { Batch, BatchProduct, Product } from '@/models'
import { formatError } from '@/utils'
import { batchValidation } from '@/validation'
import { sequelize } from '@/config'

const batchController = {
  getAllBatch: async (req, res) => {
    try {
      const batches = await Batch.findAll({
        include: [
          {
            model: BatchProduct,
            as: 'batchProducts',
            include: [{ model: Product, as: 'product' }],
          },
        ],
        order: [['id', 'DESC']],
      })
      res
        .status(200)
        .json({ message: 'Get all batches successfully', data: batches })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  createBatch: async (req, res) => {
    console.log(req.body)
    try {
      const { error } = batchValidation.createBatch.validate(req.body)
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0].message, data: null })
      }
      const batch = await Batch.create(
        {
          ...req.body,
          createdBy: req.account.email,
        },
        {
          include: [
            {
              model: BatchProduct,
              as: 'batchProducts',
            },
          ],
        }
      )
      res
        .status(201)
        .json({ message: 'Create batch successfully', data: batch })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  updateBatch: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const batch = await Batch.update(req.body, {
        where: { id: req.params.id },
        transaction,
      })

      if (req.body.batchProducts) {
        await Promise.all(
          req.body.batchProducts.map(async (product) => {
            await BatchProduct.update(product, {
              where: { productId: product.productId, batchId: req.params.id },
              transaction,
            })
          })
        )
      }
      await transaction.commit()
      res
        .status(200)
        .json({ message: 'Update batch successfully', data: batch })
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      res.status(500).json({ message: error.message })
    }
  },
  deleteBatch: async (req, res) => {
    try {
      await Batch.destroy({ where: { id: req.params.id } })
      res.status(200).json({ message: 'Delete batch successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
}

export { batchController }
