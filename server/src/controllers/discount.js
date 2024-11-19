import { Discount, models, ProductDiscount } from '@/models'
import { discountValidation } from '@/validation'
import { formatError } from '@/utils'
import { sequelize } from '@/config'
import { Op } from 'sequelize'

const discountController = {
  getDiscount: async (req, res) => {
    try {
      const discounts = await Discount.findAll({
        include: [
          {
            model: models.ProductDiscount,
            as: 'productDiscounts',
            include: [{ model: models.Product, as: 'product' }],
          },
        ],
      })
      res
        .status(200)
        .json({ message: 'Discount retrieved successfully', data: discounts })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message })
    }
  },
  createDiscount: async (req, res) => {
    try {
      const { error } = discountValidation.createDiscount.validate(req.body)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
      const discount = await Discount.create(req.body, {
        include: [{ model: models.ProductDiscount, as: 'productDiscounts' }],
      })
      res
        .status(200)
        .json({ message: 'Discount created successfully', data: discount })
    } catch (error) {
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  updateDiscount: async (req, res) => {
    let transaction
    try {
      transaction = await sequelize.transaction()
      const { error } = discountValidation.updateDiscount.validate(req.body)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
      const { id } = req.params
      const { productDiscounts, ...discountData } = req.body
      const discount = await Discount.findByPk(id, {
        include: [{ model: models.ProductDiscount, as: 'productDiscounts' }],
      })
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' })
      }
      const newProductDiscountIds = productDiscounts.map(
        (productDiscount) => productDiscount.productId
      )

      await discount.update(discountData, { transaction })
      await Promise.all(
        productDiscounts.map(async (productDiscount) => {
          const isExist = await discount.productDiscounts.find(
            (item) =>
              item.productId == productDiscount.productId &&
              item.discountId == id
          )

          if (isExist) {
            await ProductDiscount.update(
              { discountPercentage: productDiscount.discountPercentage },
              {
                where: {
                  productId: productDiscount.productId,
                  discountId: id,
                },
                transaction,
              }
            )
          } else {
            await ProductDiscount.create(
              { ...productDiscount, discountId: id },
              { transaction }
            )
          }
        })
      )

      await ProductDiscount.destroy({
        where: {
          discountId: id,
          productId: { [Op.notIn]: newProductDiscountIds },
        },
        transaction,
      })

      await transaction.commit()
      res
        .status(200)
        .json({ message: 'Discount updated successfully', data: discount })
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params
      const discount = await Discount.findByPk(id)
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' })
      }
      await discount.destroy()
      res.status(200).json({ message: 'Discount deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: formatError(error.message), data: null })
    }
  },
}

export { discountController }
