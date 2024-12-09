import { BatchProduct } from './BatchProduct'

export interface Batch {
  id: number
  code: string
  arrivalDate: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  batchProducts: BatchProduct[]
}
