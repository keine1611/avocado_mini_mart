import { authApi } from './auth'
import { brandApi } from './brand'
import { productApi } from './product'
import { subCategoryApi } from './subCategory'
import { mainCategoryApi } from './mainCategory'
import { accountApi } from './account'
import { roleApi } from './role'
import { orderApi } from './order'
import { paymentService } from './payment'
import { discountCodeApi } from './discountCode'
import { batchApi } from './batch'
export const serviceReducer = {
  [brandApi.reducerPath]: brandApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [subCategoryApi.reducerPath]: subCategoryApi.reducer,
  [mainCategoryApi.reducerPath]: mainCategoryApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [paymentService.reducerPath]: paymentService.reducer,
  [discountCodeApi.reducerPath]: discountCodeApi.reducer,
  [batchApi.reducerPath]: batchApi.reducer,
}

export const serviceMiddleware = [
  brandApi.middleware,
  authApi.middleware,
  productApi.middleware,
  subCategoryApi.middleware,
  mainCategoryApi.middleware,
  accountApi.middleware,
  roleApi.middleware,
  orderApi.middleware,
  paymentService.middleware,
  discountCodeApi.middleware,
  batchApi.middleware,
]
