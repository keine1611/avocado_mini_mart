import { logo } from '@/constant'
import React from 'react'
import { Link } from 'react-router-dom'

export const AdminSideBar = () => {
  return (
    <div className=' bg-neutral h-full flex flex-col gap-2 border-r border-base-200 shadow-md relative'>
      <div className=' h-16 items-center flex bg-accent px-3 border-b border-base-200'>
        <img
          className=' max-h-full'
          src={logo}
          alt='logo'
        />
      </div>
      <div className=' flex-1'>
        <p className=' uppercase'>Menu</p>
      </div>
      <label className='btn btn-circle swap swap-rotate right-0'>
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
    </div>
  )
}
