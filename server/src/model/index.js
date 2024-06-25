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

Role.hasMany(Account, {
  foreignKey: 'roleId',
  as: 'account',
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

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
})
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
})

MainCategory.hasMany(Product, {
  foreignKey: 'mainCategoryId',
  as: 'products',
})
Product.belongsTo(MainCategory, {
  foreignKey: 'mainCategoryId',
  as: 'mainCategory',
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

export const models = {
  Brand,
  Product,
  Batch,
  BatchDetail,
  Role,
  Account,
  Profile,
  Order,
  OrderItem,
  SubCategory,
  MainCategory,
  Cart,
}
