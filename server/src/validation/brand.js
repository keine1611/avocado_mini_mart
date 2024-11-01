import Joi from 'joi'

const brandValidation = {
  create: Joi.object({
    name: Joi.string()
      .max(50)
      .min(3)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Name is required'
              break
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            case 'string.min':
              error.message = 'Name must be at least 1 character long'
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
            case 'string.max':
              error.message = 'Slug must be at most 100 characters long'
              break
            case 'string.min':
              error.message = 'Slug must be at least 1 character long'
              break
            default:
              break
          }
        })
        return errors
      }),
    description: Joi.string()
      .max(500)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Description must be at most 500 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    logo: Joi.object()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Logo is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Code must be at most 50 characters long'
              break
            case 'string.min':
              error.message = 'Code must be at least 1 character long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
  update: Joi.object({
    name: Joi.string()
      .max(50)
      .min(3)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Name must be at most 50 characters long'
              break
            case 'string.min':
              error.message = 'Name must be at least 1 character long'
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
            case 'string.max':
              error.message = 'Slug must be at most 100 characters long'
              break
            case 'string.min':
              error.message = 'Slug must be at least 1 character long'
              break
            default:
              break
          }
        })
        return errors
      }),
    description: Joi.string()
      .max(500)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Descriptio n must be at most 500 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    logo: Joi.object()
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            default:
              break
          }
        })
        return errors
      }),
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Code must be at most 50 characters long'
              break
            case 'string.min':
              error.message = 'Code must be at least 1 character long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
  delete: Joi.object({
    id: Joi.number().required(),
  }),
}

export { brandValidation }
