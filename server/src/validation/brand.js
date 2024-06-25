import Joi from 'joi'

export const createValidation = ({ data }) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(10).required(),
    slug: Joi.string().max(100),
    description: Joi.string().max(500),
    logo: Joi.string().max(100),
  })
  return schema.validate(data)
}
