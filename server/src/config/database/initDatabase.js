import { models } from '@/models'
import { sequelize } from '@/config'
import { statusProduct } from '@/enum'

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

    const mainCategory = await models.MainCategory.bulkCreate(
      [
        {
          name: 'Fast Food',
          slug: 'fast-food',
          subCategories: [
            {
              name: 'Instant Noodles',
              slug: 'instant-noodles',
            },
            {
              name: 'Snack',
              slug: 'snack',
            },
            {
              name: 'Sweet and Candy',
              slug: 'sweet-and-candy',
            },
          ],
        },
        {
          name: 'Fresh Produce',
          slug: 'fresh-produce',
          subCategories: [
            {
              name: 'Vegetable',
              slug: 'vegetable',
            },
            {
              name: 'Fruit',
              slug: 'fruit',
            },
          ],
        },
        {
          name: 'Beverages',
          slug: 'beverages',
          subCategories: [
            {
              name: 'Soft Drink',
              slug: 'soft-drink',
            },
            {
              name: 'Milk and Dairy',
              slug: 'milk-and-dairy',
            },
            {
              name: 'Coffee and Tea',
              slug: 'coffee-and-tea',
            },
          ],
        },
        {
          name: 'Fresh Food',
          slug: 'fresh-food',
          subCategories: [
            {
              name: 'Seafood',
              slug: 'seafood',
            },
            {
              name: 'Meat',
              slug: 'meat',
            },
            {
              name: 'Egg',
              slug: 'egg',
            },
          ],
        },
        {
          name: 'Condiments',
          slug: 'condiments',
          subCategories: [
            {
              name: 'Sauce',
              slug: 'sauce',
            },
            {
              name: 'Salt, sugar, spice',
              slug: 'salt-sugar-spice',
            },
          ],
        },
      ],
      { include: ['subCategories'] }
    )
    const brand = await models.Brand.bulkCreate(
      [
        {
          name: 'Coca-Cola',
          code: 'cocacola',
          slug: 'coca-cola',
          description:
            'Coca-Cola is a carbonated soft drink manufactured by The Coca-Cola Company.',
          logo: 'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/brands%2Fcoca-cola.png?alt=media&token=1490e80d-458a-4bde-9c0d-d334096845bf',
          products: [
            {
              name: 'Coca-Cola 330ml',
              barcode: '5449000000996',
              slug: 'coca-cola-330ml',
              description:
                'Coca-Cola is a carbonated soft drink manufactured by The Coca-Cola Company.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
          ],
        },
        {
          name: 'Vinamilk',
          code: 'vinamilk',
          slug: 'vinamilk',
          description: 'Vinamilk is a dairy product manufacturer in Vietnam.',
          logo: 'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/brands%2Fvinamilk.png?alt=media&token=1490e80d-458a-4bde-9c0d-d334096845bf',
          products: [
            {
              name: 'Vinamilk 1L',
              barcode: '5449000002996',
              slug: 'vinamilk-1l',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 2L',
              barcode: '5449000003996',
              slug: 'vinamilk-2l',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 3L',
              barcode: '5449000004996',
              slug: 'vinamilk-3l',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 1000ml',
              barcode: '5449000005996',
              slug: 'vinamilk-1000ml',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 2000ml',
              barcode: '5449000006996',
              slug: 'vinamilk-2000ml',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 3000ml',
              barcode: '5449000007996',
              slug: 'vinamilk-3000ml',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
            {
              name: 'Vinamilk 5000ml',
              barcode: '5449000008996',
              slug: 'vinamilk-5000ml',
              description:
                'Vinamilk is a dairy product manufacturer in Vietnam.',
              standardPrice: 1.5,
              stock: 100,
              status: statusProduct.ACTIVE,
              mainImage:
                'https://firebasestorage.googleapis.com/v0/b/mini-mart-613a2.appspot.com/o/products%2Fcoca330ml.png?alt=media&token=89462a0e-a140-4dd1-892d-762fb9bd708a',
              subCategoryId: 1,
            },
          ],
        },
      ],
      { include: ['products'] }
    )

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
      ...orderPath,
      ...paymentPath,
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
