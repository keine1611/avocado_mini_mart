import { clearFavoriteFromLocalStorage } from '@/utils'
import { cartActions, favoriteActions, useAppDispatch } from '@/store'
import { authActions } from '@/store'
import Cookies from 'js-cookie'
import { useSyncFavorites } from './useSyncFavorites'
import { useNavigate } from 'react-router-dom'

const auth = () => {
  const dispatch = useAppDispatch()
  const { syncFavorites } = useSyncFavorites()
  const navigate = useNavigate()
  const logout = async () => {
    await syncFavorites()
    dispatch(authActions.clear())
    dispatch(cartActions.clearCart())
    dispatch(favoriteActions.clearFavorite())
    clearFavoriteFromLocalStorage()
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    navigate('/login', { replace: true, state: { from: null } })
  }

  return { logout }
}

export { auth }
