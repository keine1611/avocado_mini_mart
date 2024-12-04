import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'
import { MyToast } from './components'
import { LoadingOverlay } from './components/ui/LoadingOverlay'
import {
  loadingActions,
  useAppDispatch,
  authActions,
  cartActions,
} from './store'
import { useRefreshMutation } from '@/services'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useAutoSyncCart, useSyncCart } from './hooks'

const RefreshToken: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refresh] = useRefreshMutation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const rememberMe = Cookies.get('rememberMe')
        const res = await refresh({
          rememberMe: rememberMe === 'true',
        }).unwrap()
        if (res.data) {
          dispatch(authActions.setUser(res.data))
          dispatch(cartActions.setCarts(res.data.carts))
        }
      } catch (error) {
        dispatch(authActions.clear())
      } finally {
        setLoading(false)
      }
    }
    const refreshTokenId = setInterval(refreshToken, 1000 * 60 * 8)
    refreshToken()

    return () => {
      clearInterval(refreshTokenId)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(loadingActions.setLoading(loading))
  }, [loading, dispatch])

  if (loading) {
    return null
  }

  return <>{children}</>
}

function App() {
  // useWebSocket()
  useSyncCart()
  useAutoSyncCart()
  return (
    <RefreshToken>
      <RouterProvider router={router} />
      <LoadingOverlay />
      <MyToast />
    </RefreshToken>
  )
}

export default App
