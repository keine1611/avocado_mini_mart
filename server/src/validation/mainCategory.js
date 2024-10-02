import Joi from 'joi'

export const mainCategoryValidation = {
  create: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string()
      .required()
      .min(3)
      .max(50)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 3 characters long'
              break
            case 'any.required':
              error.message = 'Name is required'
              break
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .min(3)
      .max(100)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Slug must be at least 3 characters long'
              break
            case 'any.required':
              error.message = 'Slug is required'
              break
            case 'string.max':
              error.message = 'Slug must be at most 50 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
  update: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string()
      .required()
      .min(3)
      .max(50)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 3 characters long'
              break
            case 'any.required':
              error.message = 'Name is required'
              break
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .min(3)
      .max(100)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Slug must be at least 3 characters long'
              break
            case 'any.required':
              error.message = 'Slug is required'
              break
            case 'string.max':
              error.message = 'Slug must be at most 100 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
}
