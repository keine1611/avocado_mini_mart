import React from 'react'
import { BellIcon, MailIcon } from '@/resources'
import { AdminSideBar } from './AdminSideBar'

export const AdminNavBar: React.FC = () => {
  return (
    <div className='w-full h-20 bg-base-200 border-b border-base-300 shadow-md flex flex-row justify-between px-2 items-center'>
      <AdminSideBar />
      <div className='flex flex-row justify-end items-center gap-4'>
        <button className='btn btn-ghost rounded-full h-12 w-12 p-0'>
          <MailIcon className='w-6 h-6 m-auto text-base-content' />
        </button>
        <button className='btn btn-ghost rounded-full h-12 w-12 p-0'>
          <BellIcon className='w-6 h-6 m-auto text-base-content' />
        </button>
        <div className='avatar'>
          <div className='w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
            <img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg' />
          </div>
        </div>
      </div>
    </div>
  )
}
