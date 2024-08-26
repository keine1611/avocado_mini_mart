import { Profile } from './Profile'
import { Role } from './Role'

export interface Account {
  email: string
  password: string
}

export interface LoginResponse {
  email: string
  avatarUrl: string
  profile: Profile
  role: Role
}
