import Joi from 'joi'
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  SHIPPING_METHOD,
} from '@/enum'

const orderValidation = {
  paypalCreateOrder: Joi.object({
    fullName: Joi.string()
      .required()
      .max(50)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Full name is required'
              break
            case 'string.max':
              error.message = 'Full name must be at most 50 characters long'
              break
          }
        })
        return errors
      }),
    address: Joi.string()
      .max(100)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Address is required'
              break
            case 'string.max':
              error.message = 'Address must be at most 100 characters long'
              break
          }
        })
        return errors
      }),
    phone: Joi.string()
      .required()
      .min(10)
      .max(10)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Phone is required'
              break
            case 'string.min':
              error.message = 'Phone must be at least 10 characters long'
              break
            case 'string.max':
              error.message = 'Phone must be at most 10 characters long'
              break
          }
        })
        return errors
      }),
    email: Joi.string()
      .required()
      .email()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Email is required'
              break
            case 'string.email':
              error.message = 'Invalid email'
              break
          }
        })
        return errors
      }),
    provinceCode: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            default:
              break
          }
        })
        return errors
      }),
    districtCode: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'District code is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    wardCode: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Ward code is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    orderStatus: Joi.string()
      .valid(...Object.values(ORDER_STATUS))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.only':
              error.message = 'Invalid order status'
              break
            default:
              break
          }
        })
        return errors
      }),
    paymentMethod: Joi.string()
      .valid(...Object.values(PAYMENT_METHOD))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.only':
              error.message = 'Invalid payment method'
              break
          }
        })
        return errors
      }),
    paymentStatus: Joi.string()
      .valid(...Object.values(PAYMENT_STATUS))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.only':
              error.message = 'Invalid payment status'
              break
          }
        })
        return errors
      }),
    paymentId: Joi.string().max(100),
    shippingMethod: Joi.string()
      .valid(...Object.values(SHIPPING_METHOD))
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.only':
              error.message = 'Invalid shipping method'
              break
            default:
              break
          }
        })
        return errors
      }),
    notes: Joi.string()
      .max(200)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            default:
              break
          }
        })
        return errors
      }),
    discount: Joi.number()
      .min(0)
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Discount is required'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
}

export { orderValidation }
