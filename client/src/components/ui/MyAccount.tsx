import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Breadcrumb } from './Breadcrumb'

const MyAccount: React.FC = () => {
  const { pathname } = useLocation()
  const isActiveLink = (path: string) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-700'
  }

  return (
    <>
      <div className='h-full max-w-screen flex flex-col md:flex-row bg-white px-4 py-4 my-10 border border-gray-200 mx-2 rounded-lg'>
        <aside className='w-full md:max-w-64 bg-white shadow-lg rounded-lg p-4 mb-4 md:mb-0'>
          <div className='text-2xl font-bold text-gray-800 mb-6'>
            My Account
          </div>
          <nav>
            <ul className='space-y-2'>
              <li className='hover:bg-gray-200 rounded-lg'>
                <Link
                  to='/account/profile'
                  className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out transform ${isActiveLink(
                    '/account/profile'
                  )}`}
                >
                  <UserOutlined className='mr-2' />
                  My Profile
                </Link>
              </li>
              <li className='hover:bg-gray-200 rounded-lg'>
                <Link
                  to='/account/orders'
                  className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out transform ${isActiveLink(
                    '/account/orders'
                  )}`}
                >
                  <ShoppingCartOutlined className='mr-2' />
                  My Orders
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className='flex-grow bg-white rounded-lg shadow-md'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export { MyAccount }
