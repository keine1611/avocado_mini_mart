import { Brand } from '@/model/brand'
import { createSlug } from '@/utils'
import { Op } from 'sequelize'

export const getAllBrand = async ({ limit, offset, filters }) => {
  const listBrands = await Brand.findAndCountAll({
    limit: limit,
    offset: offset,
    where: filters,
  })
  return listBrands.rows
}

export const getBrandById = async ({ id }) => {
  const brand = await Brand.findOne({ where: { id } })
  return brand
}

export const createBrand = async ({ name, description, logo, slug, code }) => {
  const brand = await Brand.create({ name, description, slug, logo, code })
  return brand
}
