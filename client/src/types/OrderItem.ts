import { Product } from './Product'

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  productId: string
  orderId: string
  product: Product[]
}
