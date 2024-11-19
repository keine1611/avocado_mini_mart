import Joi from 'joi'

export const productDiscountValidation = {
  createProductDiscount: Joi.object({
    productId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Product id is required'
              break
          }
        })
        return errors
      }),
    discountId: Joi.number()
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Discount id is required'
              break
          }
        })
        return errors
      }),
    discountPercentage: Joi.number()
      .integer()
      .required()
      .max(100)
      .min(0)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Discount percentage is required'
              break
            case 'number.base':
              error.message = 'Discount percentage must be a number'
              break
            case 'number.integer':
              error.message = 'Discount percentage must be an integer'
              break
            case 'number.max':
              error.message = 'Discount percentage must be at most 100'
              break
            case 'number.min':
              error.message = 'Discount percentage must be at least 0'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),

  updateProductDiscount: Joi.object({
    discountPercentage: Joi.number()
      .max(100)
      .min(0)
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.max':
              error.message = 'Discount percentage must be at most 100'
              break
            case 'number.min':
              error.message = 'Discount percentage must be at least 0'
              break
            default:
              break
          }
        })
        return errors
      }),
    productId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Product id is required'
              break
            case 'number.base':
              error.message = 'Product id must be a number'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
}

export const discountValidation = {
  createDiscount: Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Name is required'
              break
            case 'string.min':
              error.message = 'Name must be at least 1 character'
              break
            case 'string.max':
              error.message = 'Name must be at most 100 characters'
              break
            default:
              break
          }
        })
        return errors
      }),
    startDate: Joi.string()
      .min(14)
      .max(14)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Start date is required'
              break
            case 'string.min':
              error.message = 'Start date must be at least 14 characters'
              break
            case 'string.max':
              error.message = 'Start date must be at most 14 characters'
              break
            default:
              break
          }
        })
        return errors
      }),
    endDate: Joi.string()
      .min(14)
      .max(14)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'End date is required'
              break
            case 'string.max':
              error.message = 'End date must be at most 14 characters'
              break
            case 'string.min':
              error.message = 'End date must be at least 14 characters'
              break
            default:
              break
          }
        })
        return errors
      }),
    isActive: Joi.boolean()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Is active is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    productDiscounts: Joi.array()
      .items(productDiscountValidation.createProductDiscount)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Product discounts are required'
              break
          }
        })
        return errors
      }),
  }),

  updateDiscount: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    startDate: Joi.string().min(14).max(14).optional(),
    endDate: Joi.string().min(14).max(14).optional(),
    isActive: Joi.boolean().optional(),
    productDiscounts: Joi.array()
      .items(productDiscountValidation.updateProductDiscount)
      .optional(),
  }),
}
