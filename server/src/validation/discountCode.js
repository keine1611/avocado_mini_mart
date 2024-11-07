import Joi from 'joi'
import { DISCOUNT_TYPE } from '@/enum'

export const discountCodeValidation = {
  create: Joi.object({
    id: Joi.number().optional(),
    code: Joi.string()
      .required()
      .min(3)
      .max(20)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Code must be at least 3 characters long'
              break
            case 'string.max':
              error.message = 'Code must be at most 20 characters long'
              break
            case 'any.required':
              error.message = 'Code is required'
              break
          }
        })
        return errors
      }),
    discountType: Joi.string()
      .required()
      .valid(...Object.values(DISCOUNT_TYPE))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Discount type is required'
              break
            case 'any.only':
              error.message = 'Invalid discount type'
              break
          }
        })
        return errors
      }),
    discountValue: Joi.number()
      .required()
      .min(0)
      .max(100)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.min':
              error.message = 'Discount value must be at least 0'
              break
            case 'number.max':
              error.message = 'Discount value must be at most 100'
              break
            case 'any.required':
              error.message = 'Discount value is required'
              break
          }
        })
        return errors
      }),
    expiryDate: Joi.string()
      .max(14)
      .min(14)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Expiry date is required'
              break
            case 'string.max':
              error.message = 'Expiry date must be at most 14 characters long'
              break
            case 'string.min':
              error.message = 'Expiry date must be at least 14 characters long'
              break
          }
        })
        return errors
      }),
    usageLimit: Joi.number()
      .required()
      .min(0)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Usage limit is required'
              break
            case 'number.min':
              error.message = 'Usage limit must be at least 0'
              break
          }
        })
        return errors
      }),
    timesUsed: Joi.number()
      .min(0)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Times used is required'
              break
            case 'number.min':
              error.message = 'Times used must be at least 0'
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
          }
        })
        return errors
      }),
  }),
  update: Joi.object({
    id: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Id is required'
              break
          }
        })
        return errors
      }),
    code: Joi.string()
      .required()
      .min(3)
      .max(20)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Code must be at least 3 characters long'
              break
            case 'string.max':
              error.message = 'Code must be at most 20 characters long'
              break
            case 'any.required':
              error.message = 'Code is required'
              break
          }
        })
        return errors
      }),
    discountType: Joi.string()
      .required()
      .valid(...Object.values(DISCOUNT_TYPE))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Discount type is required'
              break
            case 'any.only':
              error.message = 'Invalid discount type'
              break
          }
        })
        return errors
      }),
    discountValue: Joi.number()
      .required()
      .min(0)
      .max(100)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.min':
              error.message = 'Discount value must be at least 0'
              break
            case 'number.max':
              error.message = 'Discount value must be at most 100'
              break
            case 'any.required':
              error.message = 'Discount value is required'
              break
          }
        })
        return errors
      }),
    expiryDate: Joi.string()
      .max(14)
      .min(14)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Expiry date is required'
              break
            case 'string.max':
              error.message = 'Expiry date must be at most 14 characters long'
              break
            case 'string.min':
              error.message = 'Expiry date must be at least 14 characters long'
              break
          }
        })
        return errors
      }),
    usageLimit: Joi.number()
      .required()
      .min(0)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Usage limit is required'
              break
            case 'number.min':
              error.message = 'Usage limit must be at least 0'
              break
          }
        })
        return errors
      }),
    timesUsed: Joi.number()
      .min(0)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Times used is required'
              break
            case 'number.min':
              error.message = 'Times used must be at least 0'
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
          }
        })
        return errors
      }),
  }),
}
