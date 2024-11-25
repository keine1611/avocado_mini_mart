import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom'
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
  AdminOrder,
  UserProductDetail,
  UserProduct,
  UserCart,
  UserCheckout,
  UserFavorite,
  AdminDiscountCode,
  AdminBatch,
  AdminBatchProduct,
  AdminDiscount,
  UserMyOrder,
  UserProfile,
  UserOrderDetail,
  AdminCheckOrder,
  AdminDashboard,
} from '@/pages'
import { AdminLayout, UserLayout, MyAccount } from '@/components'
import { useAppSelector } from '@/store'

interface PrivateRouteProps {
  roles?: string[]
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (!roles?.includes(user?.role?.name || '')) navigate('/no-access')
    } else {
      if (roles && roles.length > 0) navigate('/login')
      else navigate('/no-access')
    }
  }, [user])
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserHome />,
      },
      {
        path: 'products',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <UserProduct />,
          },
          {
            path: ':slugmaincategory',
            element: <UserProduct />,
          },
          {
            path: ':slugmaincategory/:slugsubcategory',
            element: <UserProduct />,
          },
          {
            path: ':slugmaincategory/:slugsubcategory/:slugproduct',
            element: <UserProductDetail />,
          },
        ],
      },

      {
        path: 'cart',
        element: <UserCart />,
      },
      {
        path: 'favorites',
        element: <UserFavorite />,
      },
      {
        path: 'account',
        element: <MyAccount />,
        children: [
          {
            path: 'orders',
            element: <UserMyOrder />,
          },
          {
            path: 'orders/:orderCode',
            element: <UserOrderDetail />,
          },
          {
            path: 'profile',
            element: <UserProfile />,
          },
        ],
      },
    ],
  },
  {
    path: 'checkout',
    element: <UserCheckout />,
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
          {
            path: 'orders',
            element: <AdminOrder />,
          },
          {
            path: 'discount-codes',
            element: <AdminDiscountCode />,
          },
          {
            path: 'batches',
            element: <AdminBatch />,
          },
          {
            path: 'batch-product',
            element: <AdminBatchProduct />,
          },
          {
            path: 'discounts',
            element: <AdminDiscount />,
          },
        ],
      },
      {
        path: 'tasks',
        children: [
          {
            path: 'check-orders',
            element: <AdminCheckOrder />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
    ],
  },
])

export { router }
