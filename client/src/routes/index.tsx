import { createBrowserRouter, Navigate } from 'react-router-dom'

import { PATH } from '@/constant'
import { AdminHome, UserHome, UserLogin, AdminBrand, UserRegister } from '@/pages'
import { AdminLayout } from '@/components'
import { useAppSelector } from '@/hooks'

interface PrivateRouteProps {
  roles?: string[]
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const { user } = useAppSelector((state) => state.auth)

  if (!roles?.includes('admin')) return <Navigate to='/no-access' />
  return <>{children}</>
}

export const router = createBrowserRouter([
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
    path: '/admin',
    element: (
      <PrivateRoute roles={['admin']}>
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
        ],
      },
    ],
  },
])
