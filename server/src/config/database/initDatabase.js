import { models } from '@/models'
import { sequelize } from '@/config'
import { statusProduct } from '@/enum'
import fs from 'fs/promises'
import path from 'path'

const brandPath = [
  {
    name: 'GET_BRANDS',
    path: '/api/brands',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_BRAND_BY_ID',
    path: '/api/brands/:id',
    method: 'GET',
  },
  {
    name: 'CREATE_BRAND',
    path: '/api/brands',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_BRAND',
    path: '/api/brands/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_BRAND',
    path: '/api/brands/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const productPath = [
  {
    name: 'GET_PRODUCTS',
    path: '/api/products',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_PRODUCT_BY_ID',
    path: '/api/products/:id',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_PRODUCT_BY_SUB_CATEGORY',
    path: '/api/sub-categories/:id/products',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_PRODUCT_BY_MAIN_CATEGORY',
    path: '/api/main-categories/:id/products',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_PRODUCT_BY_BRAND',
    path: '/api/brands/:id/products',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'CREATE_PRODUCT',
    path: '/api/products',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_PRODUCT',
    path: '/api/products/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_PRODUCT',
    path: '/api/products/:id',
    method: 'DELETE',
    isPublic: false,
  },
  {
    name: 'GET_ALL_PRODUCTS',
    path: '/api/products/all',
    method: 'GET',
    isPublic: true,
  },
]

const subCategoryPath = [
  {
    name: 'GET_SUB_CATEGORIES',
    path: '/api/sub-categories',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_SUB_CATEGORY_BY_ID',
    path: '/api/sub-categories/:id',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'CREATE_SUB_CATEGORY',
    path: '/api/sub-categories',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_SUB_CATEGORY',
    path: '/api/sub-categories/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_SUB_CATEGORY',
    path: '/api/sub-categories/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const mainCategoryPath = [
  {
    name: 'GET_MAIN_CATEGORIES',
    path: '/api/main-categories',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_MAIN_CATEGORY_BY_ID',
    path: '/api/main-categories/:id',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'CREATE_MAIN_CATEGORY',
    path: '/api/main-categories',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_MAIN_CATEGORY',
    path: '/api/main-categories/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_MAIN_CATEGORY',
    path: '/api/main-categories/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const rolePath = [
  {
    name: 'GET_ROLES',
    path: '/api/roles',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'GET_ROLE_BY_ID',
    path: '/api/roles/:id',
    method: 'GET',
    isPublic: true,
  },
  {
    name: 'CREATE_ROLE',
    path: '/api/roles',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_ROLE',
    path: '/api/roles/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_ROLE',
    path: '/api/roles/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const accountPath = [
  {
    name: 'GET_ACCOUNTS',
    path: '/api/accounts',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'GET_ACCOUNT_BY_ID',
    path: '/api/accounts/:id',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'CREATE_ACCOUNT',
    path: '/api/accounts',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_ACCOUNT',
    path: '/api/accounts/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_ACCOUNT',
    path: '/api/accounts/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const authPath = [
  {
    name: 'LOGIN',
    path: '/api/auth/login',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'LOGOUT',
    path: '/api/auth/logout',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'REFRESH_TOKEN',
    path: '/api/auth/refresh',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'FORGOT_PASSWORD',
    path: '/api/auth/forgot-password',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'RESET_PASSWORD',
    path: '/api/auth/reset-password',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'CHANGE_PASSWORD',
    path: '/api/auth/change-password',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'REGISTER',
    path: '/api/auth/register',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'VERIFY_EMAIL',
    path: '/api/auth/verify',
    method: 'POST',
    isPublic: true,
  },
  {
    name: 'GET_USER_FAVORITE_PRODUCTS',
    path: '/api/auth/user-favorites',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'GET_USER_CART',
    path: '/api/auth/user-cart',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'SYNC_FAVORITES',
    path: '/api/auth/sync-favorites',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'SYNC_CART',
    path: '/api/auth/sync-cart',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'GET_LIST_CART_PRODUCTS_BY_IDS',
    path: '/api/auth/user-cart/products/product-ids',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'GET_USER_ORDERS',
    path: '/api/auth/user-orders',
    method: 'GET',
    isPublic: false,
  },
]

const orderPath = [
  {
    name: 'GET_ORDERS',
    path: '/api/orders',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'GET_ORDER_BY_ID',
    path: '/api/orders/:id',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'CREATE_ORDER',
    path: '/api/orders',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_ORDER',
    path: '/api/orders/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_ORDER',
    path: '/api/orders/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

const paymentPath = [
  {
    name: 'PAYMENT_PAYPAL_CREATE_ORDER',
    path: '/api/payment/paypal/create-order',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'PAYMENT_PAYPAL_VERIFY_ORDER',
    path: '/api/payment/paypal/verify-order',
    method: 'POST',
    isPublic: false,
  },
]

const discountCodePath = [
  {
    name: 'GET_DISCOUNT_CODES',
    path: '/api/discount-codes',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'CREATE_DISCOUNT_CODE',
    path: '/api/discount-codes',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_DISCOUNT_CODE',
    path: '/api/discount-codes/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_DISCOUNT_CODE',
    path: '/api/discount-codes/:id',
    method: 'DELETE',
    isPublic: false,
  },
  {
    name: 'GET_DISCOUNT_CODE_BY_CODE',
    path: '/api/discount-codes/:code',
    method: 'GET',
    isPublic: false,
  },
]

const batchPath = [
  {
    name: 'GET_BATCHES',
    path: '/api/batches',
    method: 'GET',
    isPublic: false,
  },
  {
    name: 'CREATE_BATCH',
    path: '/api/batches',
    method: 'POST',
    isPublic: false,
  },
  {
    name: 'UPDATE_BATCH',
    path: '/api/batches/:id',
    method: 'PUT',
    isPublic: false,
  },
  {
    name: 'DELETE_BATCH',
    path: '/api/batches/:id',
    method: 'DELETE',
    isPublic: false,
  },
]

export const connectToDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connect to db success full')
  } catch (error) {
    console.log(error)
  }
}

export const syncDatabase = async () => {
  try {
    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    // Sync all models
    await sequelize.sync({ force: true })

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

    console.log('All models were synchronized successfully.')

    // Create initial data
    await importDataFromJson('brands.json', models.Brand)
    await importDataFromJson('mainCategories.json', models.MainCategory)
    await importDataFromJson('subCategories.json', models.SubCategory)
    await importDataFromJson('products.json', models.Product)
    await importDataFromJson('imagesProduct.json', models.ProductImage)
    await importDataFromJson('batch.json', models.Batch)
    await importDataFromJson('batchProduct.json', models.BatchProduct)

    await models.Role.bulkCreate([
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'USER' },
      { id: 3, name: 'STAFF' },
    ])
    await models.Account.create(
      {
        email: 'admin@gmail.com',
        password: '123456',
        roleId: 1,
        profile: {
          firstName: 'Admin',
          lastName: 'Admin',
          phone: '0909090909',
          dob: '16112002000000',
          address: '123 Main St, Anytown, USA',
          gender: 'male',
        },
      },
      {
        include: ['profile'],
      }
    )

    const permissions = await models.Permission.bulkCreate([
      ...brandPath,
      ...productPath,
      ...subCategoryPath,
      ...mainCategoryPath,
      ...rolePath,
      ...accountPath,
      ...authPath,
      ...orderPath,
      ...paymentPath,
      ...discountCodePath,
      ...batchPath,
    ])

    const adminRolePermission = await models.RolePermission.bulkCreate(
      permissions.map((permission) => ({
        roleId: 1,
        permissionName: permission.name,
      }))
    )

    // const staffRolePermission = await models.RolePermission.bulkCreate([])

    console.log('Initial data created successfully.')
  } catch (error) {
    console.error('Error synchronizing models:', error)
  }
}

const importDataFromJson = async (fileName, model) => {
  try {
    const dataPath = path.join(__dirname, '../../static/json', fileName)
    const data = await fs.readFile(dataPath, 'utf8')
    const jsonData = JSON.parse(data)
    await model.bulkCreate(jsonData)
  } catch (error) {
    console.error('Error importing data from JSON:', error)
  }
}
