import React from 'react'
import { useNavigate } from 'react-router-dom'
interface CategoryCardProps {
  name: string
  image: string
  link: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  link,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(link)
  }

  return (
    <div className=' max-w-32 min-w-32 md:max-w-44 md:min-w-44 px-4 flex flex-col justify-center items-center rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-500'>
      <img
        src={image}
        alt={name}
        onClick={handleClick}
        className={` hover:cursor-pointer h-24 w-24 object-cover rounded-full p-2 hover:scale-110 hover:shadow-lg transition-transform transform hover:rotate-6 duration-500`}
      />

      <div className='flex items-center justify-center mt-2'>
        <h3
          onClick={handleClick}
          className='text-black font-light text-nowrap hover:cursor-pointer hover:text-secondary transition-colors duration-500'
        >
          {name}
        </h3>
      </div>
    </div>
  )
}
