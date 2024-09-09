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
import { Role } from './role'
import { SubCategory } from './subCategory'
import { ProductImage } from './productImage'
import { PriceHistory } from './priceHistory'
import { Inventory } from './inventory'

Brand.hasMany(Product, {
  foreignKey: 'brandId',
  as: 'products',
})
Product.belongsTo(Brand, {
  foreignKey: 'brandId',
  as: 'brand',
})

Batch.hasMany(BatchDetail, {
  foreignKey: 'batchId',
  as: 'batchDetails',
})
BatchDetail.belongsTo(Batch, {
  foreignKey: 'batchId',
  as: 'batch',
})

Product.hasMany(BatchDetail, {
  foreignKey: 'productId',
  as: 'batchDetails',
})
BatchDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Product.hasMany(ProductImage, {
  foreignKey: 'productId',
  as: 'productImages',
})
ProductImage.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Product.hasMany(PriceHistory, {
  foreignKey: 'productId',
  as: 'priceHistories',
})
PriceHistory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Role.hasMany(Account, {
  foreignKey: 'roleId',
  as: 'accounts',
})
Account.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
})

Account.hasOne(Profile, {
  foreignKey: 'accountId',
  as: 'profile',
})
Profile.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
})

Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
})
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Product.hasMany(Inventory, {
  foreignKey: 'productId',
  as: 'inventories',
})
Inventory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Batch.hasMany(Inventory, {
  foreignKey: 'batchId',
  as: 'inventories',
})
Inventory.belongsTo(Batch, {
  foreignKey: 'batchId',
  as: 'batch',
})

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
})
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
})

SubCategory.hasMany(Product, {
  foreignKey: 'subCategoryId',
  as: 'products',
})
Product.belongsTo(SubCategory, {
  foreignKey: 'subCategoryId',
  as: 'subCategory',
})

MainCategory.hasMany(SubCategory, {
  foreignKey: 'mainCategoryId',
  as: 'subCategories',
})
SubCategory.belongsTo(MainCategory, {
  foreignKey: 'mainCategoryId',
  as: 'mainCategory',
})

Product.hasMany(Cart, {
  foreignKey: 'productId',
  as: 'carts',
})
Cart.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Account.hasMany(Cart, {
  foreignKey: 'accountId',
  as: 'carts',
})
Cart.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
})

Account.hasMany(Order, {
  foreignKey: 'accountId',
  as: 'orders',
})
Order.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
})

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
  Role,
  SubCategory,
}

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
export * from './role'
export * from './subCategory'
