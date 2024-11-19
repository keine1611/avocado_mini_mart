import { Product } from './Product'
import { Discount } from './Discount'

export interface ProductDiscount {
  productId: number
  discountId: number
  discountPercentage: number
  product: Product
  discount: Discount
}
