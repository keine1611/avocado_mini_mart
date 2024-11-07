import Joi from 'joi'

const batchValidation = {
  createBatch: Joi.object({
    code: Joi.string()
      .required()
      .min(3)
      .max(10)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Code is required'
              break
            case 'string.min':
              error.message = 'Code must be 10 characters'
              break
            case 'string.max':
              error.message = 'Code must be 10 characters'
              break
          }
        })
        return errors
      }),
    arrivalDate: Joi.string()
      .min(14)
      .max(14)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Arrival Date is required'
              break
            case 'string.min':
              error.message = 'Arrival Date must be 14 characters'
              break
            case 'string.max':
              error.message = 'Arrival Date must be 14 characters'
              break
          }
        })
        return errors
      }),
    batchProducts: Joi.array()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          error.message = 'Batch Products is required'
        })
        return errors
      }),
  }),
}

export { batchValidation }
