import { Product } from './Product'

export interface OrderItem {
  id: string
  quantity: number
  price: number
  productId: string
  orderId: string
  product: Product
}
