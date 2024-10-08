import { Product } from './Product'

interface Cart {
  id: number
  product: Product
  quantity: number
  accountId: number
}

export type { Cart }
