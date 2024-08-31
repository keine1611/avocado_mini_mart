import Joi from 'joi'

export const createBrandValidation = ({ data }) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(10).required(),
    slug: Joi.string().max(100),
    description: Joi.string().max(500),
    logo: Joi.string().max(100),
    code: Joi.string().max(50).required(),
  })
  return schema.validate(data)
}
