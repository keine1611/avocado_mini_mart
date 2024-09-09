import { query } from 'express'
import { Op } from 'sequelize'

export const getPagination = async ({ page, size }) => {
  const limit = size ? +size : 10
  const offset = page ? (page - 1) * limit : 0
  return { limit, offset }
}

export const getFilters = async ({ queryFilters }) => {
  if (!queryFilters) return {}
  const filters = {}
  Object.keys(queryFilters).forEach((key) => {
    if (query[key]) {
      filters[key] - { [Op.like]: `%${queryFilters[key]}%` }
    }
  })
  return filters
}

export const getSearch = async ({ key, search }) => {
  if (!search) return {}
  return { key: { [Op.like]: `%${search}%` } }
}

export const getSort = async ({ sort }) => {
  if (!sort) return null
  const sortBy = sort.split('_')
  const order = sortBy[1] === 'asc' ? 'ASC' : 'DESC'
  return { sortBy: sortBy[0], order }
}
