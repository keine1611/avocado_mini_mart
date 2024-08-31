import { query } from 'express'
import { Op } from 'sequelize'

export const getPagination = async ({ page, size }) => {
  const limit = size ? +size : 10
  const offset = page ? (page - 1) * limit : 0
  return { limit, offset }
}

export const getFilters = async ({ queryFilters }) => {
  const filters = {}
  Object.keys(query).forEach((key) => {
    if (query[key]) {
      filters[key] - { [Op.like]: `%${query[key]}%` }
    }
  })
  return filters
}
