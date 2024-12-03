import React from 'react'
import { Outlet } from 'react-router-dom'
import { HeaderNavBar, Footer } from '@/components'

export const UserLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className='flex flex-col h-screen w-full relative'>
      <HeaderNavBar />
      <main className='flex-grow'>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
