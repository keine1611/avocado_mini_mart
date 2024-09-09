import Joi from 'joi'

export const createProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(10).required(),
    barcode: Joi.string().max(10).required(),
    slug: Joi.string().max(100),
    description: Joi.string().max(500),
    standardPrice: Joi.number().required(),
    brandId: Joi.number().required(),
    subCategoryId: Joi.number().required(),
  })
  return schema.validate(data)
}

export const updateProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(10),
    barcode: Joi.string().max(10),
    slug: Joi.string().max(100),
    description: Joi.string().max(500),
    standardPrice: Joi.number(),
    status: Joi.string().valid('active', 'inactive'),
    brandId: Joi.number(),
    subCategoryId: Joi.number(),
  })
  return schema.validate(data)
}
