import { models } from '@/model'
import { sequelize } from '@/config'

export const connectToDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connect to db success full')
  } catch (error) {
    console.log(error)
  }
}

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
    isPublic: true,
  },
  {
    name: 'GET_ACCOUNT_BY_ID',
    path: '/api/accounts/:id',
    method: 'GET',
    isPublic: true,
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
]

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
    const brand = await models.Brand.create({
      name: 'Initial Brand',
      code: 'IB',
      slug: 'initial-brand',
      description: 'This is the initial brand created during database sync.',
    })

    const mainCategory = await models.MainCategory.create({
      name: 'Initial Category',
      code: 'IC',
    })

    const subCategory = await models.SubCategory.create({
      name: 'Initial Subcategory',
      code: 'IS',
      mainCategoryId: mainCategory.id,
    })

    await models.Role.bulkCreate([
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'USER' },
      { id: 3, name: 'STAFF' },
    ])
    await models.Account.create({
      email: 'admin@gmail.com',
      password: '123456',
      roleId: 1,
    })

    const permissions = await models.Permission.bulkCreate([
      ...brandPath,
      ...productPath,
      ...subCategoryPath,
      ...mainCategoryPath,
      ...rolePath,
      ...accountPath,
      ...authPath,
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
