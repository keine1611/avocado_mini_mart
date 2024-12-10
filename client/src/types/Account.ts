import { Profile } from './Profile'
import { Role } from './Role'
import { Cart } from './Cart'
import { Order } from './Order'
import { Favorite } from './Favorite'
import { OrderInfo } from './OrderInfo'
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
  status: string
  restrictedUntil: string
  note: string
  profile: Profile
  role: Role
  carts: Cart[]
  orders: Order[]
  favorites: Favorite[]
  orderInfos: OrderInfo[]
}

export interface LoginResponse {
  email: string
  avatarUrl: string
  profile: Profile
  role: Role
  status: string
  restrictedUntil: string
}
