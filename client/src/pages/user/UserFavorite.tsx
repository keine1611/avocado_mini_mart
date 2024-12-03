import { Breadcrumb } from '@/components'
import { useGetUserFavoriteProductsQuery } from '@/services'
import { Empty } from 'antd'
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
        {favoriteData && favoriteData.data.length > 0 ? <></> : <Empty />}
      </div>
    </div>
  )
}

export { UserFavorite }
