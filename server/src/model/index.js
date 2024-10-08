import { sequelize } from '@/config'
import { Account } from './account'
import { Batch } from './batch'
import { BatchDetail } from './batchDetail'
import { Brand } from './brand'
import { Cart } from './cart'
import { MainCategory } from './mainCategory'
import { Order } from './order'
import { OrderItem } from './orderItem'
import { Product } from './product'
import { Profile } from './profile'
import { SubCategory } from './subCategory'
import { ProductImage } from './productImage'
import { PriceHistory } from './priceHistory'
import { Inventory } from './inventory'
import { Role } from './role'
import { Permission } from './permission'
import { RolePermission } from './rolePermission'
export const models = {
  Account,
  Batch,
  BatchDetail,
  Brand,
  Cart,
  Inventory,
  MainCategory,
  Order,
  OrderItem,
  PriceHistory,
  Product,
  ProductImage,
  Profile,
  SubCategory,
  Role,
  Permission,
  RolePermission,
}

Object.values(models).forEach((model) => {
  model.associate(models)
})

export * from './account'
export * from './batch'
export * from './batchDetail'
export * from './brand'
export * from './cart'
export * from './inventory'
export * from './mainCategory'
export * from './order'
export * from './orderItem'
export * from './priceHistory'
export * from './product'
export * from './productImage'
export * from './profile'
export * from './subCategory'
export * from './role'
export * from './permission'
export * from './rolePermission'
