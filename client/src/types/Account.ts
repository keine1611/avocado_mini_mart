import { RoleAccount, StatusAccount } from '@/enum'
import { Profile } from './Profile'
import { Role } from './Role'

export interface Account {
  id: number
  email: string
  password: string
  status: StatusAccount
  role: RoleAccount
  avatarUrl: string
  createdAt: string
  updatedAt: string
  profile: Profile
}


export interface LoginResponse {
  email: string
  avatarUrl: string
  profile: Profile
  role: Role
}
