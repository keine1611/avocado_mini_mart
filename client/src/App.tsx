import { RouterProvider, useNavigate } from 'react-router-dom'
import { router } from './routes'
import './index.css'
import { useEffect } from 'react'
import { useRefreshMutation } from './services'
import Cookies from 'js-cookie'
import { useAppDispatch } from './hooks'
import { authActions } from './store/auth'

function TokenRefresher() {
  const [refresh] = useRefreshMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      try {
        const response = await refresh().unwrap()
        dispatch(authActions.setUser(response.data))
      } catch (error) {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        console.log('hehe')
        navigate('/login')
      }
    }, 9 * 60 * 1000)

    return () => clearInterval(refreshToken)
  }, [refresh, dispatch])
}

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
