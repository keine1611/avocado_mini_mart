import { Brand } from '@/model/brand'
import { createSlug } from '@/utils'

export const getAllBrand = async () => {
  const listBrands = await Brand.findAll()
  return listBrands
}

export const getBrandById = async ({ id }) => {
  const brand = await Brand.findOne({ where: { id } })
  return brand
}

export const createBrand = async ({ name, description, logo, slug }) => {
  const brand = await Brand.create({ name, description, slug, logo })
  return brand
}
