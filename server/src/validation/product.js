import Joi from 'joi'

const productValidation = {
  create: Joi.object({
    name: Joi.string()
      .max(50)
      .min(10)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 10 characters long'
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
    barcode: Joi.string()
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Barcode must be at most 50 characters long'
              break
            case 'any.required':
              error.message = 'Barcode is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .max(50)
      .min(3)
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
    standardPrice: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.base':
              error.message = 'Standard price is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    status: Joi.string()
      .valid('active', 'inactive')
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Status is required'
              break
            case 'any.only':
              error.message = 'Status must be either active or inactive'
              break
            default:
              break
          }
        })
        return errors
      }),
    brandId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.base':
              error.message = 'Brand ID is required'
              break
            default:
              break
          }
        })
        return errors
      }),
    subCategoryId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'number.base':
              error.message = 'Subcategory ID is required'
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
      .min(10)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Name must be at least 10 characters long'
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
    barcode: Joi.string()
      .max(50)
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.max':
              error.message = 'Barcode must be at most 50 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    slug: Joi.string()
      .max(50)
      .min(3)
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
    standardPrice: Joi.number().error((errors) => {
      errors.forEach((error) => {
        switch (error.code) {
          case 'number.base':
            error.message = 'Standard price is required'
            break
          default:
            break
        }
      })
      return errors
    }),
    status: Joi.string()
      .valid('active', 'inactive')
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.only':
              error.message = 'Status must be either active or inactive'
              break
            default:
              break
          }
        })
        return errors
      }),
    brandId: Joi.number().error((errors) => {
      errors.forEach((error) => {
        switch (error.code) {
          case 'number.base':
            error.message = 'Brand ID is required'
            break
          default:
            break
        }
      })
      return errors
    }),
    subCategoryId: Joi.number().error((errors) => {
      errors.forEach((error) => {
        switch (error.code) {
          case 'number.base':
            error.message = 'Subcategory ID is required'
            break
          default:
            break
        }
      })
      return errors
    }),
  }),
}

export { productValidation }
