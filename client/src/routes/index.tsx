import { createBrowserRouter, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PATH } from '@/constant'
import {
  AdminHome,
  UserHome,
  UserLogin,
  AdminBrand,
  UserRegister,
  AdminProduct,
  AdminMainCategory,
  AdminSubCategory,
  AdminUser,
  NoAccess,
} from '@/pages'
import { AdminLayout } from '@/components'
import { useAppSelector } from '@/hooks'
interface PrivateRouteProps {
  roles?: string[]
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!roles?.includes(user?.role?.name || '')) navigate('/no-access')
  }, [user])
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <></>,
    children: [
      {
        index: true,
        element: <UserHome />,
      },
    ],
  },
  {
    path: PATH.user.login,
    element: <UserLogin />,
  },
  {
    path: PATH.user.register,
    element: <UserRegister />,
  },
  {
    path: '/no-access',
    element: <NoAccess />,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={['ADMIN']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: 'databases',
        children: [
          {
            path: 'brands',
            element: <AdminBrand />,
          },
          {
            path: 'products',
            element: <AdminProduct />,
          },
          {
            path: 'sub-categories',
            element: <AdminSubCategory />,
          },
          {
            path: 'main-categories',
            element: <AdminMainCategory />,
          },
          {
            path: 'users',
            element: <AdminUser />,
          },
        ],
      },
    ],
  },
])

export { router }
