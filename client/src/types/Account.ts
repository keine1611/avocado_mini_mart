
import { Profile } from './Profile'
import { Role } from './Role'
import { Cart } from './Cart'
import { Order } from './Order'

export interface Account {
  id: number
  email: string
  password: string
  avatarUrl: string
  block: boolean
  isVerified: boolean
  verifiedAt: string
  isDeleted: boolean
  deletedAt: string
  deletedBy: string
  createdAt: string
  updatedAt: string
  profile: Profile
  role: Role
  carts: Cart[]
  orders: Order[]
  
}


export interface LoginResponse {
  email: string
  avatarUrl: string
  profile: Profile
  role: Role
}
