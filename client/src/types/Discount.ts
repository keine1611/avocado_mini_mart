import { ProductDiscount } from './ProductDiscount'

export interface Discount {
  id: number
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  productDiscounts: ProductDiscount[]
}
