import { register } from '@/services/auth'
import Joi from 'joi'

const authValidation = {
  register: Joi.object({
    email: Joi.string()
      .max(320)
      .required()
      .email()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.email':
              error.message = 'Email is invalid'
              break
            case 'any.required':
              error.message = 'Email is required'
              break
            case 'string.max':
              error.message = 'Email must be at most 320 characters long'
              break
            default:
              break
          }
        })
      }),
    password: Joi.string()
      .min(6)
      .max(15)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Password must be at least 6 characters long'
              break
            case 'any.required':
              error.message = 'Password is required'
              break
            case 'string.max':
              error.message = 'Password must be at most 15 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
  login: Joi.object({
    email: Joi.string()
      .max(320)
      .required()
      .email()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.email':
              error.message = 'Email is invalid'
              break
            case 'any.required':
              error.message = 'Email is required'
              break
            case 'string.max':
              error.message = 'Email must be at most 320 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    password: Joi.string()
      .min(6)
      .max(15)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'string.min':
              error.message = 'Password must be at least 6 characters long'
              break
            case 'any.required':
              error.message = 'Password is required'
              break
            case 'string.max':
              error.message = 'Password must be at most 15 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
  }),
}

export { authValidation }
