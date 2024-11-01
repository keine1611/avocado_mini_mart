import {
  slideImg1,
  slideImg2,
  slideImg3,
  mainCategoryImage,
} from '@/constant/image'
import React from 'react'
import { Carousel } from 'antd'
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { CategoryCard, ProductCard } from '@/components/ui'
import { Link } from 'react-router-dom'
import { useGetAllProductQuery } from '@/services'

const bgTitleLink1 = '/src/assets/images/home/bg-title-link-1.jpg'

const mainCategories = [
  {
    name: 'Fast Food',
    slug: 'fast-food',
    image: mainCategoryImage.fastFood,
    link: '/products?category=fast-food',
  },
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    image: mainCategoryImage.freshProduce,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    image: mainCategoryImage.beverages,
    link: '/products?category=beverages',
  },
  {
    name: 'Fresh Food',
    slug: 'fresh-food',
    image: mainCategoryImage.freshFood,
    link: '/products?category=fresh-food',
  },
  {
    name: 'Condiments',
    slug: 'condiments',
    image: mainCategoryImage.condiments,
    link: '/products?category=condiments',
  },
]

export const UserHome: React.FC = () => {
  const { data: products, isLoading } = useGetAllProductQuery()

  return (
    <div className='w-full flex flex-col '>
      <section className=''>
        <Carousel
          autoplay
          effect='fade'
          speed={2000}
          className='rounded-lg h-[500px]'
        >
          <div>
            <img
              src={slideImg1}
              alt='home1'
              className='w-full object-cover h-[500px]'
            />
          </div>
          <div>
            <img
              src={slideImg2}
              alt='home2'
              className='w-full object-cover h-[500px]'
            />
          </div>
          <div>
            <img
              src={slideImg3}
              alt='home3'
              className='w-full object-cover h-[500px]'
            />
          </div>
        </Carousel>
      </section>

      <section className='w-full px-4 md:px-32'>
        <div className='carousel rounded-box gap-4 px-2 w-full mt-10 py-4 lg:justify-center'>
          {mainCategories.map((category) => (
            <div className='carousel-item' key={category.slug}>
              <CategoryCard
                key={category.slug}
                name={category.name || ''}
                image={category.image || ''}
                link={category.link || ''}
              />
            </div>
          ))}
        </div>
        <div className='w-full relative border border-accent rounded-lg mt-10'>
          <Link
            to='/products'
            className='text-lg text-nowrap font-bold absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-neutral rounded-full p-3 shadow-lg'
          >
            Featured Products{' '}
            <FireOutlined className='text-secondary font-extrabold text-2xl' />
          </Link>
          <div className=' grid gap-4 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 justify-center items-center mt-10 px-4'>
            {products?.data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button className='btn btn-primary mx-auto mb-4 block btn-sm text-neutral mt-4'>
            Load More <ArrowRightOutlined />
          </button>
        </div>
      </section>
      <section className='w-full px-4 md:px-32 mt-10'>
        <div className='grid grid-cols-12 gap-4'>
          <div
            className={`lg:col-span-3 md:col-span-4 col-span-12 bg-cover bg-center rounded-lg`}
            style={{ backgroundImage: `url(${bgTitleLink1})` }}
          >
            <ul className='menu rounded-box'>
              <li>
                <h2 className='menu-title text-black'>Fast Food</h2>
                <ul>
                  <li>
                    <a>Instant Noodles</a>
                  </li>
                  <li>
                    <a>Snack</a>
                  </li>
                  <li>
                    <a>Sweet and Candy</a>
                  </li>
                </ul>
              </li>
            </ul>
            <button className=' mx-auto btn btn-xs btn-accent hover:bg-secondary border-none shadow-sm mb-4 block text-neutral mt-4'>
              Buy now <ArrowRightOutlined />
            </button>
          </div>
          <div className='col-span-12 md:col-span-8 lg:col-span-9'>
            <div className='carousel rounded-box gap-4 px-2 w-full'>
              {products?.data.data.map((product) => (
                <div className='carousel-item' key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className='w-full px-4 md:px-32 mt-10'>
        <div>
          <h1 className='text-2xl font-bold text-center'>New News</h1>
        </div>
      </section>
    </div>
  )
}
