import { authReducer } from './auth'
import { cartReducer } from './cart'
import { favoriteReducer } from './favorite'
import { loadingReducer } from './loading'

export const reduxReducers = {
  auth: authReducer,
  loading: loadingReducer,
  cart: cartReducer,
  favorite: favoriteReducer,
}
