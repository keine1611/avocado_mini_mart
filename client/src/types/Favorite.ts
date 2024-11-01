import { Account, Product } from '@/types'

interface Favorite {
  accountId?: number
  productId: number
  product?: Product
  account?: Account
}

export type { Favorite }
