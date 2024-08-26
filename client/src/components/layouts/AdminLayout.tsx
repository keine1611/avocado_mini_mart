import React from 'react'
import { AdminNavBar } from '../ui'
import { Outlet } from 'react-router-dom'

export const AdminLayout: React.FC = () => {
  return (
    <div className=' w-full flex flex-col h-screen'>
      <AdminNavBar />
      <div className=' flex-1 bg-neutral'>
        <Outlet />
      </div>
    </div>
  )
}
