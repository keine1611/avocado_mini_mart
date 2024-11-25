import { Order } from './Order'
import { Product } from './Product'

export interface OrderItem {
  id: number
  quantity: number
  price: number
  productId: number
  orderId: number
  order: Order
  product: Product
  discount: number
  isReviewed: boolean
}
