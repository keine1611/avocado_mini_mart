import Joi from 'joi'

const subCategoryValidation = {
  create: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 3 characters long'
              break
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            case 'any.required':
              error.message = 'Name is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    mainCategoryId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Main category ID is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Slug must be at least 3 characters long'
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
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 3 characters long'
              break
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            case 'any.required':
              error.message = 'Name is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    mainCategoryId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Main category ID is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Slug must be at least 3 characters long'
              break
            case 'string.max':
              error.message = 'Slug must be at most 50 characters long'
              break
            case 'any.required':
              error.message = 'Slug is required'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
}

export { subCategoryValidation }
