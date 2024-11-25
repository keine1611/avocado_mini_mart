import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductDetailQuery } from '@/services'
import { Breadcrumb, Loading, ProductCard, showToast } from '@/components'
import {
  FaHeartCircleCheck,
  FaHeart,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa6'
import {
  cartActions,
  favoriteActions,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { useState, useRef } from 'react'
import { Favorite, Product } from '@/types'
import { Carousel, ConfigProvider, Rate } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import { formatCurrency } from '@/utils'
import { ProductReview } from '@/components/ui/ProductReview'
import { RatingSnapshot } from '@/components/ui/RatingSnapshot'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const UserProductDetail: React.FC = () => {
  const { slugproduct } = useParams()
  const user = useAppSelector((state) => state.auth.user)
  const carts = useAppSelector((state) => state.cart.cart)

  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useGetProductDetailQuery(slugproduct || '', {
    refetchOnMountOrArgChange: true,
  })
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
    if (quantity <= 0) {
      showToast.error('Quantity must be greater than 0')
      return
    }
    if (!product.totalQuantity) {
      showToast.error('Out of Stock')
      return
    }

    if (product.totalQuantity && product.totalQuantity <= 0) {
      showToast.error('Out of Stock')
      return
    }

    const cart = carts.find((cart) => cart.productId === productId)

    if (quantity + (cart?.quantity || 0) > product.totalQuantity) {
      showToast.error('Quantity of product cart is more than stock')
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    { url: product?.data.mainImage },
    ...(product?.data.productImages || []),
  ]

  const carouselRef = useRef<CarouselRef>(null)

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
    carouselRef.current?.goTo(index)
  }

  const handleBeforeChange = (current: number) => {
    setCurrentImageIndex(current)
  }

  return (
    <div className='w-full h-full bg-gray-50'>
      <Breadcrumb />

      {!isLoadingProduct && !isFetchingProduct ? (
        <div className='mt-10 lg:px-40 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 h-full bg-white rounded-lg py-6 px-4'>
            <div className='col-span-1 md:col-span-2 mb-8'>
              <Carousel
                ref={carouselRef}
                autoplay={false}
                arrows
                beforeChange={handleBeforeChange}
                nextArrow={
                  <div className='bg-black rounded-full p-1'>
                    <FaChevronRight className='text-black' size={20} />
                  </div>
                }
                prevArrow={
                  <div className='bg-black rounded-full p-1'>
                    <FaChevronLeft className='text-black' size={20} />
                  </div>
                }
                className='border-2 bg-white border-gray-200 rounded-lg h-full m-0 p-0'
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className='w-full h-96 relative overflow-hidden'
                  >
                    <img
                      src={image.url}
                      alt='Product'
                      className='w-full h-full object-cover '
                    />
                  </div>
                ))}
              </Carousel>
              <div className='flex justify-center mt-4'>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt='Thumbnail'
                    className={`w-24 h-24 object-cover rounded-lg mx-1 cursor-pointer ${
                      index === currentImageIndex
                        ? 'border-2 border-primary'
                        : ''
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            </div>
            <div className='col-span-1 md:col-span-3 px-4 w-full'>
              <h2 className='text-3xl font-semibold  text-black'>
                {product?.data.name}
              </h2>
              <p className='text-gray-500 text-md'>
                by {product?.data.brand?.name}
              </p>

              <div className='flex flex-row gap-4 w-full justify-between items-start mt-4'>
                <div className='flex items-start flex-col'>
                  {product?.data.maxDiscount &&
                  product?.data.maxDiscount > 0 ? (
                    <del>
                      <p className='text-md text-gray-600'>
                        {formatCurrency(product?.data.standardPrice)}
                      </p>
                    </del>
                  ) : null}
                  <p className='text-2xl font-bold cursor-auto'>
                    {product?.data.maxDiscount &&
                    product?.data.maxDiscount > 0 ? (
                      <span className='text-red-500 font-semibold text-2xl'>
                        {formatCurrency(
                          product?.data.standardPrice -
                            (product?.data.standardPrice *
                              product?.data.maxDiscount) /
                              100
                        )}{' '}
                        <span className='text-gray-500'>
                          (SALE OFF {product?.data.maxDiscount}%)
                        </span>
                      </span>
                    ) : (
                      <span className='text-red-500 font-semibold text-2xl'>
                        {formatCurrency(product?.data.standardPrice || 0)}
                      </span>
                    )}
                  </p>
                </div>
                <div className='flex items-center  mb-4'>
                  <Rate value={product?.data.rating} disabled />
                  <span className='ml-2 text-gray-600'>
                    ({product?.data.rating})
                  </span>
                </div>
              </div>
              <div className='flex flex-row mt-4 truncate line-clamp-3'>
                <p className='text-gray-500 text-md'>
                  {product?.data.description}
                </p>
              </div>

              <div className='mb-6 flex flex-row gap-4 mt-10'>
                <label
                  htmlFor='quantity'
                  className='text-md font-medium text-gray-700 mb-1'
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
                  className='w-16 border text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                />
                <p className='text-gray-500 text-md'>
                  {product?.data.totalQuantity} items in stock
                </p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 mb-6 gap-4'>
                <button
                  onClick={() =>
                    handleAddToCart(product?.data.id, product?.data)
                  }
                  disabled={
                    !product?.data?.totalQuantity ||
                    product.data.totalQuantity <= 0
                  }
                  className={`bg-primary btn btn-primary w-full flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:ring-offset-2 ${
                      !product?.data.totalQuantity ||
                      product.data.totalQuantity <= 0
                        ? 'opacity-50 hover:cursor-not-allowed'
                        : ''
                    }`}
                >
                  {!product?.data.totalQuantity ||
                  product.data.totalQuantity <= 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>

                <button
                  onClick={() =>
                    handleFavoriteClick({ productId: product?.data.id })
                  }
                  className={`${
                    isFavorite
                      ? 'bg-red-500 text-white hover:text-white hover:bg-red-600'
                      : 'bg-gray-200 text-black hover:text-black hover:bg-gray-300'
                  } btn btn-secondary flex gap-2 items-center w-full px-6 py-2 rounded-md text-center`}
                >
                  {isFavorite ? <FaHeartCircleCheck /> : <FaHeart />}
                  Wishlist
                </button>
              </div>
            </div>
          </div>
          <div className='comment-section py-6 px-4 bg-white rounded-lg mt-4 '>
            <h2 className='text-2xl font-semibold text-black mb-4'>Reviews</h2>
            <RatingSnapshot reviews={product?.data.reviews || []} />
            <div className='flex flex-col gap-4 mt-4 max-h-[300px] overflow-y-auto'>
              {product?.data.reviews?.map((review) => (
                <ProductReview key={review.id} review={review} />
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4 mt-4'>
            <h1 className='text-2xl font-semibold text-black'>
              Recommended Products
            </h1>
            <div className='rounded-box p-2 w-full'>
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                scrollbar={{ hide: true }}
                modules={[Navigation, Scrollbar, Autoplay]}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                navigation
                effect='fade'
                freeMode={true}
                className='mySwiper p-4'
              >
                {product?.data.recommendedProducts?.map((product) => (
                  <SwiperSlide key={product.id} className='flex justify-center'>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
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
