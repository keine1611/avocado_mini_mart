import { Account } from './Account'

export interface Role {
  id: number
  name: string
  code: string
  accounts: Account[]
}
