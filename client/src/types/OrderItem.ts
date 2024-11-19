import { Order } from './Order'
import { Product } from './Product'

export interface OrderItem {
  id: string
  quantity: number
  price: number
  productId: string
  orderId: string
  order: Order
  product: Product
  discount: number
  isReviewed: boolean
}
