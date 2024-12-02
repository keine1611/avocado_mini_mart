import { Batch } from './Batch'
import { OrderItem } from './OrderItem'

export type OrderItemBatch = {
  id: number
  orderItemId: number
  batchId: number
  quantity: number
  batch: Batch
  orderItem: OrderItem
}
