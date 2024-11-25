import { Brand, Review, SubCategory } from '@/types'

export interface Product {
  id: number
  name: string
  barcode: string
  description: string
  slug: string
  standardPrice: number
  mainImage: string
  maxDiscount: number
  totalQuantity: number
  status: string
  brandId: number
  subCategoryId: number
  rating: number
  createdAt: string
  updatedAt: string
  productImages?: ProductImage[]
  brand?: Brand
  subCategory?: SubCategory
  reviews?: Review[]
  recommendedProducts?: Product[]
}

export interface ProductImage {
  id: string
  url: string
  productId: number
}
