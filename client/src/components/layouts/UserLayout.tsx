import React from 'react'
import { Outlet } from 'react-router-dom'
import { HeaderNavBar, Footer } from '@/components'
import { useAutoSyncCart, useAutoSyncFavorites } from '@/hooks'

export const UserLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const autoSyncCart = useAutoSyncCart()
  const autoSyncFavorites = useAutoSyncFavorites()
  return (
    <div className='flex flex-col h-screen w-full relative'>
      <HeaderNavBar />
      <main className='flex-grow'>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
