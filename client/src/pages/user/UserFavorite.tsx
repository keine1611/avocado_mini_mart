import { Breadcrumb, ListProduct } from '@/components'
import { useGetUserFavoriteProductsQuery } from '@/services'
import React from 'react'

const UserFavorite: React.FC = () => {
  const { data: favoriteData } = useGetUserFavoriteProductsQuery()
  return (
    <div className=' w-full'>
      <Breadcrumb />
      <div className='mt-5'>
        <h1 className='text-xl font-semibold text-center'>
          Your Favorite Products
        </h1>
      </div>
    </div>
  )
}

export { UserFavorite }
