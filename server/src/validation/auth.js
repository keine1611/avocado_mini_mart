import Joi from 'joi'

export const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(320).required().email(),
    password: Joi.string().min(6).max(15).required(),
  })
  return schema.validate(data)
}

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(320).required().email(),
    password: Joi.string().min(6).max(15).required(),
  })
  return schema.validate(data)
}
