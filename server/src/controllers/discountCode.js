import { models } from '@/models'
import { discountCodeValidation } from '@/validation'
export const discountCodeController = {
  getDiscountCodes: async (req, res) => {
    try {
      const discountCodes = await models.DiscountCode.findAll()
      res.status(200).json({
        message: 'Discount codes fetched successfully',
        data: discountCodes,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  createDiscountCode: async (req, res) => {
    try {
      const { error } = await discountCodeValidation.create.validate(req.body)
      if (error)
        return res
          .status(400)
          .json({ message: error.details[0].message, data: null })
      const discountCode = await models.DiscountCode.create(req.body)
      res.status(200).json({
        message: 'Discount code created successfully',
        data: discountCode,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  updateDiscountCode: async (req, res) => {
    try {
      const discountCode = await models.DiscountCode.findByPk(req.params.id)
      if (!discountCode)
        return res
          .status(404)
          .json({ message: 'Discount code not found', data: null })
      const { error } = await discountCodeValidation.update.validate(req.body)
      if (error)
        return res
          .status(400)
          .json({ message: error.details[0].message, data: null })
      await discountCode.update(req.body)
      const updatedDiscountCode = await models.DiscountCode.findByPk(
        req.params.id
      )
      res.status(200).json({
        message: 'Discount code updated successfully',
        data: updatedDiscountCode,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  deleteDiscountCode: async (req, res) => {
    try {
      await models.DiscountCode.destroy({ where: { id: req.params.id } })
      res.status(200).json({
        message: 'Discount code deleted successfully',
        data: null,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
  getDiscountCodeByCode: async (req, res) => {
    try {
      const discountCode = await models.DiscountCode.findOne({
        where: { code: req.params.code },
      })
      if (!discountCode)
        return res
          .status(404)
          .json({ message: 'Discount code not found', data: null })
      res.status(200).json({
        message: 'Discount code fetched successfully',
        data: discountCode,
      })
    } catch (error) {
      res.status(500).json({ message: error.message, data: null })
    }
  },
}
