import { logo } from '@/constant'
import {
  ApplicationIcon,
  DashboardIcon,
  DatabaseIcon,
  SideBarIcon,
} from '@/resources'
import React from 'react'
import { Link } from 'react-router-dom'

export const AdminSideBar: React.FC = () => {
  return (
    <div className='drawer z-50'>
      <input
        id='sidebar'
        type='checkbox'
        className='drawer-toggle'
      />
      <div className='drawer-content'>
        <label
          htmlFor='sidebar'
          className='btn btn-accent drawer-button py-0 px-0'
        >
          <SideBarIcon className=' w-8 h-8  fill-neutral' />
        </label>
      </div>
      <div className='drawer-side'>
        <label
          htmlFor='sidebar'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <div className=' menu w-72 bg-primary h-screen flex flex-col p-0'>
          <img
            src={logo}
            className=' h-20 object-contain'
          />
          <div className=' flex-1 bg-neutral flex flex-col gap-3 py-1 px-1'>
            <div
              tabIndex={0}
              className='collapse collapse-arrow border-base-300 bg-primary border-none rounded-md'
            >
              <div className='collapse-title font-semibold flex flex-row gap-2 items-center'>
                <DashboardIcon className=' h-6 w-6' />
                <p className=' font-semibold capitalize'>dashboard</p>
              </div>
              <div className='collapse-content bg-neutral'>
                <div className=' flex flex-col gap-2 py-2 px-0 m-0'>
                  <Link
                    className=' w-full rounded-md bg-secondary py-3 px-2 font-medium shadow-md hover:bg-accent transition-all duration-500 hover:cursor-pointer'
                    to={'/dashboard/analytics'}
                  >
                    Analytics
                  </Link>
                  <Link
                    className=' w-full rounded-md bg-secondary py-3 px-2 font-medium shadow-md hover:bg-accent transition-all duration-500 hover:cursor-pointer'
                    to={'/dashboard/analytics'}
                  >
                    Ecommerce
                  </Link>
                  <Link
                    className=' w-full rounded-md bg-secondary py-3 px-2 font-medium shadow-md hover:bg-accent transition-all duration-500 hover:cursor-pointer'
                    to={'/dashboard/project'}
                  >
                    Project
                  </Link>
                </div>
              </div>
            </div>
            <div
              tabIndex={0}
              className='collapse collapse-arrow border-base-300 bg-primary border-none rounded-md'
            >
              <div className='collapse-title font-semibold flex flex-row gap-2 items-center'>
                <DatabaseIcon className=' h-6 w-6' />
                <p className=' font-semibold capitalize'>database</p>
              </div>
              <div className='collapse-content bg-neutral'>
                <div className=' flex flex-col gap-2 py-2 px-0 m-0'>
                  <Link
                    className=' w-full rounded-md bg-secondary py-3 px-2 font-medium shadow-md hover:bg-accent transition-all duration-500 hover:cursor-pointer'
                    to={'/database/brands'}
                  >
                    Brands
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
