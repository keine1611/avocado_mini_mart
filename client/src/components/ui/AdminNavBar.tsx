import React from 'react'
import { BellIcon, MailIcon } from '@/resources'
export const AdminNavBar = () => {
  return (
    <div className=' w-full h-16 bg-accent border-b border-base-200 shadow-md flex flex-row justify-between px-2 items-center'>
      <label className='btn btn-circle swap swap-rotate bg-primary'>
        <input type='checkbox' />
        <svg
          className='swap-off fill-current'
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 512 512'
        >
          <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
        </svg>
        <svg
          className='swap-on fill-current'
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 512 512'
        >
          <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
        </svg>
      </label>
      <div className='flex flex-row justify-end items-center gap-4'>
        <MailIcon />
        <BellIcon />
        <div className='avatar'>
          <div className='w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
            <img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg' />
          </div>
        </div>
      </div>
    </div>
  )
}
