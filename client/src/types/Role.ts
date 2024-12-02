import { Account } from './Account'

export interface Role {
  id: number
  name: string
  code: string
  accounts: Account[]
  rolePermissions: RolePermission[]
}

export interface Permission {
  id: number
  name: string
  path: string
  method: string
  isPublic: boolean
}

export interface RolePermission {
  id: number
  roleId: number
  permissionId: number
  permission: Permission
}
