import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductDetailQuery } from '@/services'
import { Breadcrumb, Loading } from '@/components'
import { FaHeartCircleCheck, FaHeart } from 'react-icons/fa6'
import {
  cartActions,
  favoriteActions,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { useState } from 'react'
import { Favorite, Product } from '@/types'

const UserProductDetail: React.FC = () => {
  const { slugproduct } = useParams()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const { data: product, isLoading: isLoadingProduct } =
    useGetProductDetailQuery(slugproduct || '')
  const favorites = useAppSelector((state) => state.favorite.favorites)
  const isFavorite = favorites.some(
    (favorite) => favorite.productId === product?.data.id
  )

  const dispatch = useAppDispatch()
  const handleAddToCart = (
    productId: number | undefined,
    product: Product | undefined
  ) => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!productId || !product) {
      return
    }
    dispatch(cartActions.addCart({ productId, quantity, product }))
  }

  const handleFavoriteClick = ({
    productId,
  }: {
    productId: number | undefined
  }) => {
    if (user) {
      if (productId) {
        if (isFavorite) {
          dispatch(favoriteActions.removeFavorite(productId))
        } else {
          dispatch(favoriteActions.addFavorite({ productId }))
        }
      }
    } else {
      navigate('/login')
    }
  }

  return (
    <div className='w-full h-full'>
      <Breadcrumb />

      {!isLoadingProduct ? (
        <div className='mt-10'>
          <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-wrap -mx-4'>
              <div className='w-full md:w-1/3  px-4 mb-8'>
                <img
                  src={product?.data.mainImage}
                  alt='Product'
                  className='w-full h-96 rounded-lg shadow-md mb-4 object-contain'
                  id='mainImage'
                />
                <div className='flex gap-4 py-4 justify-center overflow-x-auto'>
                  {product?.data.productImages?.map((image) => (
                    <img
                      src={image.url}
                      alt='Product'
                      className='w-20 h-auto rounded-lg shadow-md'
                    />
                  ))}
                </div>
              </div>

              <div className='w-full md:w-1/2 px-4'>
                <h2 className='text-3xl font-bold mb-2'>
                  {product?.data.name}
                </h2>
                <p className='text-gray-600 mb-4'>SKU: {product?.data.slug}</p>
                <div className='mb-4'>
                  <span className='text-2xl font-bold mr-2'>
                    ${product?.data.standardPrice}
                  </span>
                  <span className='text-gray-500 line-through'>$399.99</span>
                </div>
                <div className='flex items-center mb-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6 text-yellow-500'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6 text-yellow-500'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6 text-yellow-500'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6 text-yellow-500'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6 text-yellow-500'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <span className='ml-2 text-gray-600'>4.5 (120 reviews)</span>
                </div>
                <p className='text-gray-700 mb-6'>
                  {product?.data.description}
                </p>

                <div className='mb-6'>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Quantity:
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    name='quantity'
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min='1'
                    value={quantity}
                    className='w-12 text-center rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  />
                </div>

                <div className='flex space-x-4 mb-6'>
                  <button
                    onClick={() =>
                      handleAddToCart(product?.data.id, product?.data)
                    }
                    className=' bg-primary flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                      />
                    </svg>
                    Add to Cart
                  </button>
                  <button
                    onClick={() =>
                      handleFavoriteClick({ productId: product?.data.id })
                    }
                    className={`${
                      isFavorite
                        ? 'bg-red-500 text-white hover:text-white hover:bg-red-600'
                        : 'bg-gray-200 text-black hover:text-black hover:bg-gray-300'
                    } flex gap-2 items-center px-6 py-2 rounded-md`}
                  >
                    {isFavorite ? <FaHeartCircleCheck /> : <FaHeart />}
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <Loading size='large' color='text-white' />
        </div>
      )}
    </div>
  )
}

export { UserProductDetail }
