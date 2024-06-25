import { Profile } from './Profile'

export interface Account {
  email: string
  password: string
}

export interface LoginResponse {
  email: string
  avatarUrl: string
  profile: Profile
}
