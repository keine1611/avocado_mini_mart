import { Product } from '@/types'
import { Link, useSearchParams } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { ProductCard } from './ProductCard'

interface ListProductProps {
  productData: Product[]
  currentPage: number
  totalPages: number
}

const ListProduct: React.FC<ListProductProps> = ({
  productData,
  totalPages,
  currentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage.toString(),
    })
  }

  return (
    <div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 items-center'>
        {productData?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className='flex justify-center mt-10 space-x-2'>
        {Array.from({ length: totalPages || 1 }, (_, index) => index + 1).map(
          (number) => (
            <Link
              key={number}
              to={`?page=${number}`}
              className={`px-2 py-1 sm:px-4 sm:py-2 mt-2 text-gray-600 border rounded-lg hover:bg-gray-100 focus:outline-none ${
                currentPage === number ? 'bg-primary text-white' : ''
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link
            to={`?page=${currentPage + 1}`}
            className='px-2 py-1 sm:px-4 sm:py-2 mt-2 text-gray-600 border rounded-lg hover:bg-gray-100 focus:outline-none'
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <IoIosArrowForward />
          </Link>
        )}
      </div>
    </div>
  )
}

export { ListProduct }
