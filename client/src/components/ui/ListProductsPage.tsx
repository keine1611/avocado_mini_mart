import { useGetAllProductQuery } from '@/services'
import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Loading, ListProduct } from '@/components'

const ListProductsPage: React.FC = () => {
  const { slugmaincategory, slugsubcategory } = useParams()
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('size') || '12')

  const {
    data: productData,
    isLoading: getAllProductLoading,
    refetch: refetchProduct,
    isFetching: isFetchingProduct,
  } = useGetAllProductQuery({
    ...(slugmaincategory && { maincategory: slugmaincategory }),
    ...(slugsubcategory && { subcategory: slugsubcategory }),
    page: currentPage,
    size: pageSize,
    search: searchParams.get('search') || undefined,
    maxprice: searchParams.get('maxprice')
      ? parseInt(searchParams.get('maxprice')!)
      : undefined,
    minprice: searchParams.get('minprice')
      ? parseInt(searchParams.get('minprice')!)
      : undefined,
  })

  useEffect(() => {
    refetchProduct()
  }, [slugmaincategory, slugsubcategory, currentPage, pageSize, searchParams])

  return (
    <div className='lg:col-span-9 col-span-12'>
      {getAllProductLoading || isFetchingProduct ? (
        <div className='flex justify-center items-center h-96 w-full'>
          <Loading size='loading-md' />
        </div>
      ) : (
        <ListProduct
          productData={productData?.data.data || []}
          currentPage={currentPage}
          totalPages={productData?.data.totalPages || 1}
        />
      )}
    </div>
  )
}

export { ListProductsPage }
