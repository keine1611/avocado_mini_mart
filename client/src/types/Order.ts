import { Account } from './Account'
import { OrderItem } from './OrderItem'

interface Order {
  id: number
  code: string
  orderStatus: string
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  shippingMethod: string
  notes: string
  discount: number
  accountId: number
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  account: Account
}

export type { Order }
