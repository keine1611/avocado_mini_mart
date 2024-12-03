import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
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
  UserCheckout,
  AdminDiscountCode,
  AdminBatch,
  AdminBatchProduct,
  AdminDiscount,
  UserMyOrder,
  UserProfile,
  UserOrderDetail,
  AdminCheckOrder,
  AdminDashboard,
  AdminSaleAnalytics,
} from '@/pages'
import { AdminLayout, UserLayout, MyAccount } from '@/components'
import { useAppSelector } from '@/store'
import { AdminRole } from '@/pages/admin/AdminRole'
import { UserForgotPassword } from '@/pages/user/UserForgotPassword'

export enum RouteRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
}

interface ProtectedRouteProps {
  allowedRoles?: RouteRole[]
  redirectPath?: string
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
  children,
}) => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  if (!allowedRoles?.includes(user.role.name as RouteRole)) {
    return <Navigate to='/no-access' replace />
  }

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
    ],
  },
  {
    path: 'account',
    element: (
      <ProtectedRoute allowedRoles={[RouteRole.USER]}>
        <UserLayout>
          <MyAccount />
        </UserLayout>
      </ProtectedRoute>
    ),
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
  {
    path: 'checkout',
    element: (
      <ProtectedRoute allowedRoles={[RouteRole.USER]}>
        <UserCheckout />
      </ProtectedRoute>
    ),
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
    path: '/forgot-password',
    element: <UserForgotPassword />,
  },
  {
    path: '/no-access',
    element: <NoAccess />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[RouteRole.ADMIN, RouteRole.STAFF]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: 'databases',
        element: (
          <ProtectedRoute allowedRoles={[RouteRole.ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
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
            path: 'discounts',
            element: <AdminDiscount />,
          },
          {
            path: 'roles',
            element: <AdminRole />,
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
        element: (
          <ProtectedRoute allowedRoles={[RouteRole.ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'inventory-analytics',
            element: <AdminBatchProduct />,
          },
          {
            path: 'sales-analytics',
            element: <AdminSaleAnalytics />,
          },
        ],
      },
    ],
  },
])

export { router }
