import { authApi } from './auth'
import { brandApi } from './brand'

export const serviceReducer = {
  [brandApi.reducerPath]: brandApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
}

export const serviceMiddleware = [brandApi.middleware, authApi.middleware]
