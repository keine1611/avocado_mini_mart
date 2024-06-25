import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PATH } from '@/constant'
import { AdminHome, UserHome, UserLogin } from '@/pages'
import { AdminLayout } from '@/components'

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
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
    ],
  },
])
