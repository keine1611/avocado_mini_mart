import { Role, Gender } from '@/enum'
import { StatusAccount } from '@/enum'
import Joi from 'joi'

const accountValidate = {
  createAccount: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Email is required'
              break
            case 'string.email':
              error.message = 'Email is invalid'
              break
            default:
              break
          }
        })
        return errors
      }),
    password: Joi.string()
      .min(6)
      .max(30)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Password is required'
              break
            case 'string.min':
              error.message = 'Password must be at least 6 characters long'
              break
            case 'string.max':
              error.message = 'Password must be at most 30 characters long'
              break
            default:
              break
          }
        })
        return errors
      }),
    avatarUrl: Joi.string().optional(),
    status: Joi.string()
      .valid(StatusAccount)
      .optional()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Status is required'
              break
            case 'string.valid':
              error.message = 'Status is invalid'
              break
            default:
              break
          }
        })
        return errors
      }),
    role: Joi.string()
      .valid(Role)
      .required()
      .error((errors) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'any.required':
              error.message = 'Role is required'
              break
            case 'string.valid':
              error.message = 'Role is invalid'
              break
            default:
              break
          }
        })
        return errors
      }),
    profile: Joi.object({
      firstName: Joi.string()
        .min(1)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'any.required':
                error.message = 'First name is required'
                break
              case 'string.min':
                error.message = 'First name must be at least 1 characters long'
                break
              case 'string.max':
                error.message = 'First name must be at most 30 characters long'
                break
              default:
                break
            }
          })
          return errors
        }),
      lastName: Joi.string()
        .min(1)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'any.required':
                error.message = 'Last name is required'
                break
              case 'string.min':
                error.message = 'Last name must be at least 1 characters long'
                break
              case 'string.max':
                error.message = 'Last name must be at most 30 characters long'
                break
              default:
                break
            }
          })
          return errors
        }),
      phone: Joi.string()
        .min(10)
        .max(10)
        .required()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'any.required':
                error.message = 'Phone is required'
                break
              case 'string.min':
                error.message = 'Phone must be at least 10 characters long'
                break
              case 'string.max':
                error.message = 'Phone must be at most 10 characters long'
                break
              default:
                break
            }
          })
          return errors
        }),
      address: Joi.string()
        .min(3)
        .max(255)
        .required()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'any.required':
                error.message = 'Address is required'
                break
              case 'string.min':
                error.message = 'Address must be at least 3 characters long'
                break
              case 'string.max':
                error.message = 'Address must be at most 255 characters long'
                break
              default:
                break
            }
          })
          return errors
        }),
      gender: Joi.string()
        .valid(Gender)
        .optional()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'any.required':
                error.message = 'Gender is required'
                break
              case 'string.valid':
                error.message = 'Gender is invalid'
                break
              default:
                break
            }
          })
          return errors
        }),
      dob: Joi.string()
        .min(14)
        .max(14)
        .required()
        .error((errors) => {
          errors.forEach((error) => {
            switch (error.code) {
              case 'string.base':
                error.message = 'Date of birth must be a string'
                break
              case 'any.required':
                error.message = 'Date of birth is required'
                break
              case 'string.min':
                error.message =
                  'Date of birth must be at least 14 characters long'
                break
              case 'string.max':
                error.message =
                  'Date of birth must be at most 14 characters long'
                break
              default:
                break
            }
          })
          return errors
        }),
    }).optional(),
  }),
}

export { accountValidate }
