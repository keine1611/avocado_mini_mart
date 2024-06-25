import React from 'react'
import { AdminNavBar, AdminSideBar } from '../ui'
import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <div className='  w-full grid grid-cols-6 h-screen'>
      <div className='col-span-1'>
        <AdminSideBar />
      </div>
      <div className=' col-span-5 flex flex-col'>
        <AdminNavBar />
        <Outlet />
      </div>
    </div>
  )
}
