import { DISCOUNT_TYPE } from '@/enum'

export interface DiscountCode {
  id: number
  code: string
  discountType: DISCOUNT_TYPE
  discountValue: number
  expiredDate: string
  usageLimit: number
  timesUsed: number
  isActive: boolean
}
