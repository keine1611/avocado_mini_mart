import { authApi } from './auth'
import { brandApi } from './brand'
import { productApi } from './product'
import { subCategoryApi } from './subCategory'

export const serviceReducer = {
  [brandApi.reducerPath]: brandApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [subCategoryApi.reducerPath]: subCategoryApi.reducer,
}

export const serviceMiddleware = [brandApi.middleware, authApi.middleware, productApi.middleware, subCategoryApi.middleware]
