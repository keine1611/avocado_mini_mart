import { Batch } from './Batch'
import { Product } from './Product'

export interface BatchProduct {
  batchId: number
  productId: number
  initialQuantity: number
  quantity: number
  price: number
  expiredDate: string
  product?: Product
  batch?: Batch
}
