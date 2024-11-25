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
      const { batchProducts, ...batchData } = req.body
      transaction = await sequelize.transaction()
      const batch = await Batch.findByPk(req.params.id, {
        transaction,
        include: {
          model: BatchProduct,
          as: 'batchProducts',
        },
      })

      if (!batch) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Batch not found' })
      }

      await batch.update(batchData, { transaction })

      const existingBatchProducts = batch.batchProducts.map(
        (bp) => bp.productId
      )
      const updatedBatchProducts = req.body.batchProducts.map(
        (bp) => bp.productId
      )

      // Create new BatchProducts
      const newBatchProducts = req.body.batchProducts.filter((bp) => {
        const existing = existingBatchProducts.find(
          (existingProductId) => existingProductId == bp.productId
        )
        return !existing
      })
      await BatchProduct.bulkCreate(
        newBatchProducts.map((bp) => ({
          ...bp,
          batchId: req.params.id,
        })),
        { transaction }
      )

      // Delete BatchProducts not in the update
      const batchProductsToDelete = existingBatchProducts.filter(
        (productId) => {
          const updated = updatedBatchProducts.find(
            (updatedProductId) => updatedProductId === productId
          )
          return !updated
        }
      )
      await BatchProduct.destroy({
        where: {
          batchId: req.params.id,
          productId: batchProductsToDelete,
        },
        transaction,
      })

      // Update existing BatchProducts
      await Promise.all(
        req.body.batchProducts.map(async (bp) => {
          if (existingBatchProducts.includes(bp.productId)) {
            await BatchProduct.update(bp, {
              where: { productId: bp.productId, batchId: req.params.id },
              transaction,
            })
          }
        })
      )

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
