import { sequelize } from '@/config'
import { Account } from './account'
import { Batch } from './batch'
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
import { Role } from './role'
import { Permission } from './permission'
import { RolePermission } from './rolePermission'
import { ProductDiscount } from './productDiscount'
import { Discount } from './discount'
import { Favorite } from './favorite'
import { DiscountCode } from './discountCode'
import { BatchProduct } from './batchProduct'
import { Review } from './review'
import { ReviewMedia } from './reviewMedia'
import { OrderInfo } from './orderInfo'
import { OrderStatus } from './orderStatus'

export const models = {
  Account,
  Batch,
  Brand,
  Cart,
  MainCategory,
  Order,
  OrderItem,
  PriceHistory,
  ProductImage,
  Profile,
  SubCategory,
  Role,
  Permission,
  RolePermission,
  ProductDiscount,
  Discount,
  Product,
  Favorite,
  DiscountCode,
  BatchProduct,
  Review,
  ReviewMedia,
  OrderInfo,
  OrderStatus,
}

Object.values(models).forEach((model) => {
  model.associate(models)
})

export * from './account'
export * from './batch'
export * from './brand'
export * from './cart'
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
export * from './productDiscount'
export * from './discount'
export * from './favorite'
export * from './discountCode'
export * from './batchProduct'
export * from './review'
export * from './reviewMedia'
export * from './orderInfo'
export * from './orderStatus'
