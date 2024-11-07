import {
  clearCartFromLocalStorage,
  clearFavoriteFromLocalStorage,
} from '@/utils'
import { cartActions, favoriteActions, useAppDispatch } from '@/store'
import { authActions } from '@/store'
import Cookies from 'js-cookie'
import { useSyncFavorites } from './useSyncFavorites'

const auth = () => {
  const dispatch = useAppDispatch()
  const { syncFavorites } = useSyncFavorites()
  const logout = async () => {
    await syncFavorites()
    dispatch(authActions.clear())
    dispatch(cartActions.clearCart())
    dispatch(favoriteActions.clearFavorite())
    clearFavoriteFromLocalStorage()
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
  }

  return { logout }
}

export { auth }
