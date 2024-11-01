import { Brand, SubCategory } from '@/types'

export interface Product {
  id: number
  name: string
  barcode: string
  description: string
  slug: string
  standardPrice: number
  mainImage: string
  maxDiscount: number
  brandId: number
  subCategoryId: number
  createdAt: string
  updatedAt: string
  productImages?: ProductImage[]
  brand?: Brand
  subCategory?: SubCategory
}

export interface ProductImage {
  id: string
  url: string
  productId: number
}
