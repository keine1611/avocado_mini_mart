import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumb, FilterSide, ListProductsPage } from '@/components'
import { useGetAllMainCategoryQuery } from '@/services'

const UserProduct: React.FC = () => {
  const { data: mainCategory } = useGetAllMainCategoryQuery()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div className=' flex flex-col gap-4 bg-white'>
      <Breadcrumb />
      <div className='grid grid-cols-12 gap-4 md:px-24 px-4 py-2 '>
        <FilterSide />
        <ListProductsPage />
      </div>
    </div>
  )
}

export { UserProduct }
