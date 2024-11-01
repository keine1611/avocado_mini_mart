import React, { useState } from 'react'
import {
  BellOutlined,
  MailOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { AdminSideBar } from './AdminSideBar'
import { useAppSelector } from '@/store'
import { auth } from '@/hooks'

export const AdminNavBar: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const { logout } = auth()

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className='w-full h-20 bg-base-200 border-b border-base-300 shadow-md flex flex-row justify-between items-center px-4 md:px-6 lg:px-8'>
      <AdminSideBar />
      <div className='flex flex-row justify-end items-center gap-4'>
        <button className='btn btn-ghost rounded-full h-12 w-12 p-0 hover:bg-base-300 transition duration-200'>
          <MailOutlined className=' text-xl text-primary' />
        </button>
        <button className='btn btn-ghost rounded-full h-12 w-12 p-0 hover:bg-base-300 transition duration-200'>
          <BellOutlined className=' text-xl text-primary' />
        </button>
        <div className='relative'>
          <div className='avatar cursor-pointer' onClick={toggleDropdown}>
            <div className='w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden'>
              <img src={user?.avatarUrl} className='object-cover' />
            </div>
          </div>
          {isDropdownOpen && (
            <div className='absolute text-sm right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
              <ul className='py-1'>
                <li className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-200'>
                  <UserOutlined className='mr-2 text-primary' />
                  Profile
                </li>
                <li className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-200'>
                  <SettingOutlined className='mr-2 text-primary' />
                  Settings
                </li>
                <li
                  onClick={logout}
                  className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-200'
                >
                  <LogoutOutlined className='mr-2 text-primary' />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
