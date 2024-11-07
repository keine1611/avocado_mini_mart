import { Account } from './Account'
import { OrderItem } from './OrderItem'

interface Order {
  id: number
  code: string
  fullName: string
  phone: string
  address: string
  email: string
  provinceCode: string
  districtCode: string
  wardCode: string
  orderStatus: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  paymentId: string
  shippingMethod: string
  shippingFee: number
  discount: number
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  account: Account
}

export type { Order }
