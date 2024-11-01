import { Product } from '@/types/Product'
import React, { useState } from 'react'
import { HeartOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { favoriteActions, useAppDispatch, useAppSelector } from '@/store'
import { FaHeartCircleCheck } from 'react-icons/fa6'

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
      className=' relative max-w-xs w-full mx-auto block bg-white shadow-md rounded-xl'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product.subCategory?.mainCategory?.slug}/${product.subCategory?.slug}/${product.slug}`}
      >
        <div className='relative'>
          <img
            src={product.mainImage}
            alt='Product'
            className={`lg:w-40 lg:h-40 w-44 h-44 mx-auto object-cover p-5 border-none ${
              isHovered ? ' scale-110' : ''
            } transition-all duration-700 `}
          />
          <div
            className={` flex items-center justify-center gap-2 absolute right-1/2 translate-x-1/2 translate-y-1/2 transition-all duration-700 ${
              isHovered ? 'opacity-100 bottom-2' : 'opacity-0  -bottom-10'
            }`}
          >
            {!isFavorite ? (
              <HeartOutlined
                onClick={(e) => {
                  e.preventDefault()
                  handleAddFavorite(product.id)
                }}
                className=' text-2xl text-white hover:text-secondary p-2 rounded-full bg-red-500 transition-all duration-500'
              />
            ) : (
              <div className=' p-2 rounded-full bg-white shadow-md'>
                <FaHeartCircleCheck
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveFavorite(product.id)
                  }}
                  className=' text-2xl text-red-500 bg-white hover:text-secondary border-1 border-red-500 rounded-full transition-all duration-500'
                />
              </div>
            )}
            <div className=' p-2 rounded-full bg-white shadow-md'>
              <EyeOutlined
                onClick={(e) => {
                  e.preventDefault()
                }}
                className=' text-2xl hover:text-secondary text-primary transition-all duration-500'
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
              ${product.standardPrice}
            </p>
            <del>
              <p className='text-sm text-gray-600 cursor-auto ml-2'>$199</p>
            </del>
          </div>
        </div>
      </Link>
      <div className='absolute top-0 left-0 bg-secondary/80 text-white px-2 rounded-br-lg rounded-tl-lg'>
        <span className='text-sm'>-20%</span>
      </div>
    </div>
  )
}
