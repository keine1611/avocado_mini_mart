import { Product } from '@/types/Product'
import React, { useState } from 'react'
import { HeartOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { favoriteActions, useAppDispatch, useAppSelector } from '@/store'
import { FaHeartCircleCheck } from 'react-icons/fa6'
import { formatCurrency } from '@/utils/currency'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const favorites = useAppSelector((state) => state.favorite.favorites)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAddFavorite = (productId: number) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    dispatch(favoriteActions.addFavorite({ productId }))
  }

  const isFavorite = favorites.some(
    (favorite) => favorite.productId === product.id
  )

  const handleRemoveFavorite = (productId: number) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    dispatch(favoriteActions.removeFavorite(productId))
  }

  return (
    <div
      key={product.id}
      className='relative max-w-xs w-full mx-auto block bg-white shadow-md rounded-xl'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product.subCategory?.mainCategory?.slug}/${product.subCategory?.slug}/${product.slug}`}
        replace
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <div className='relative'>
          <img
            src={product.mainImage}
            alt='Product'
            className={`lg:w-40 lg:h-40 w-44 h-44 mx-auto object-cover p-5 border-none ${
              isHovered ? ' scale-110' : ''
            } transition-all duration-700 `}
          />
          {product.totalQuantity === 0 && (
            <div className='absolute inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-center rounded-lg border-none'>
              <img
                src='/images/sold-out.png'
                alt='Sold Out'
                className={`w-32 h-32 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } transition-all duration-700`}
              />
            </div>
          )}
          <div
            className={`flex items-center justify-center gap-2 absolute right-1/2 translate-x-1/2 translate-y-1/2 transition-all duration-700 ${
              isHovered ? 'opacity-100 bottom-2' : 'opacity-0  -bottom-10'
            }`}
          >
            {!isFavorite ? (
              <HeartOutlined
                onClick={(e) => {
                  e.preventDefault()
                  handleAddFavorite(product.id)
                }}
                className='text-2xl text-white hover:text-secondary p-2 rounded-full bg-red-500 transition-all duration-500'
              />
            ) : (
              <div className=' p-[6px] rounded-full bg-white shadow-md'>
                <FaHeartCircleCheck
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveFavorite(product.id)
                  }}
                  className='text-xl text-red-500 bg-white hover:text-secondary border-1 border-red-500 rounded-full transition-all duration-500'
                />
              </div>
            )}
            <div className='px-2 py-1 rounded-full bg-white shadow-md'>
              <EyeOutlined
                onClick={(e) => {
                  e.preventDefault()
                }}
                className='text-2xl text-primary bg-white hover:text-secondary border-1 border-primary rounded-full transition-all duration-500'
              />
            </div>
          </div>
        </div>

        <div className='px-4 py-3 w-full'>
          <p className='text-md font-semibold text-black hover:text-secondary truncate block capitalize text-center'>
            {product.name}
          </p>
          <div className='flex items-center justify-center gap-2'>
            <p className='text-lg text-accent cursor-auto my-3'>
              {product.maxDiscount > 0 ? (
                <span>
                  {formatCurrency(
                    product.standardPrice -
                      (product.standardPrice * product.maxDiscount) / 100
                  )}
                </span>
              ) : (
                <span>{formatCurrency(product.standardPrice)}</span>
              )}
            </p>
            {product.maxDiscount > 0 && (
              <del>
                <p className='text-sm text-gray-600 cursor-auto ml-2'>
                  {formatCurrency(product.standardPrice)}
                </p>
              </del>
            )}
          </div>
        </div>
      </Link>
      {product.maxDiscount > 0 && (
        <div className='absolute top-0 left-0 bg-secondary text-white px-2 rounded-br-lg rounded-tl-lg'>
          <span className='text-sm'>-{product.maxDiscount}%</span>
        </div>
      )}
    </div>
  )
}
