import { Breadcrumb, FilterSide, ListProductsPage } from '@/components'

const UserProduct: React.FC = () => {
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
