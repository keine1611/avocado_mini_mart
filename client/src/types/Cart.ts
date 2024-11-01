import { Account, Product } from '@/types'

interface Cart {
  id?: number
  product?: Product
  productId: number
  quantity: number
  accountId?: number
  account?: Account
}

export type { Cart }
