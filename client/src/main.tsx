import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { MyToast } from './components/index.ts'
import { useRefreshMutation } from './services/auth.ts'
import { useAppDispatch } from './hooks.ts'
import { authActions } from './store/auth/index.ts'
import { loadingActions } from './store/loading/index.ts'
import Cookies from 'js-cookie'

const RefreshToken: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refresh] = useRefreshMutation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const refreshToken = Cookies.get('refreshToken')
        const rememberMe = Cookies.get('rememberMe')
        if (refreshToken) {
          const res = await refresh({
            rememberMe: rememberMe === 'true',
          }).unwrap()
          dispatch(authActions.setUser(res.data))
        } else {
          dispatch(authActions.clear())
        }
      } catch (error) {
        dispatch(authActions.clear())
      } finally {
        setLoading(false)
      }
    }
    const refreshTokenId = setInterval(refreshToken, 9 * 60 * 60 * 1000)
    refreshToken()

    return () => {
      clearInterval(refreshTokenId)
    }
  }, [dispatch, refresh])

  useEffect(() => {
    // Update loading state in a separate effect
    dispatch(loadingActions.setLoading(loading))
  }, [loading, dispatch])

  if (loading) {
    return null // or a loading spinner
  }

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RefreshToken>
        <App />
        <MyToast />
      </RefreshToken>
    </Provider>
  </React.StrictMode>
)
