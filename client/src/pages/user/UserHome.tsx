import {
  slideImg1,
  slideImg2,
  slideImg3,
  mainCategoryImage,
} from '@/constant/image'
import React from 'react'
import { Carousel } from 'antd'
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { CategoryCard, Loading, ProductCard } from '@/components/ui'
import { Link, useNavigate } from 'react-router-dom'
import { useGetHomeDataQuery } from '@/services'
import { Product } from '@/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

const mainCategories = [
  {
    name: 'Fast Food',
    slug: 'fast-food',
    image: mainCategoryImage.fastFood,
    link: '/products/fast-food',
  },
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    image: mainCategoryImage.freshProduce,
    link: '/products/fresh-produce',
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    image: mainCategoryImage.beverages,
    link: '/products/beverages',
  },
  {
    name: 'Fresh Food',
    slug: 'fresh-food',
    image: mainCategoryImage.freshFood,
    link: '/products/fresh-food',
  },
  {
    name: 'Condiments',
    slug: 'condiments',
    image: mainCategoryImage.condiments,
    link: '/products/condiments',
  },
]

export const UserHome: React.FC = () => {
  const { data: homeData, isLoading: isLoadingHomeData } = useGetHomeDataQuery()
  const navigate = useNavigate()
  return isLoadingHomeData ? (
    <div className='w-full h-screen flex justify-center items-center'>
      <Loading size='loading-lg' />
    </div>
  ) : (
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
            {homeData?.data.featuredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button className='btn btn-primary mx-auto mb-4 block btn-sm text-neutral mt-4'>
            Load More <ArrowRightOutlined />
          </button>
        </div>
      </section>
      <section className='w-full px-4 md:px-32 mt-16'>
        <div className='grid grid-cols-12 gap-4'>
          <div
            className={`lg:col-span-3 bg-[url("/images/home/bg-title-link-1.jpg")] md:col-span-4 col-span-12 bg-cover bg-center rounded-lg flex flex-col justify-between`}
          >
            <ul className='menu rounded-box'>
              <li>
                <h2 className='menu-title text-black text-lg'>Fresh Produce</h2>
                <ul className='mt-2'>
                  <Link
                    to='/products/fresh-produce/vegetable'
                    className='hover:text-secondary'
                  >
                    Vegetable
                  </Link>
                </ul>
                <ul className='mt-2'>
                  <Link
                    to='/products/fresh-produce/fruit'
                    className='hover:text-secondary'
                  >
                    Fruit
                  </Link>
                </ul>
              </li>
            </ul>
            <button
              onClick={() => navigate('/products/fresh-produce')}
              className=' mx-auto btn btn-xs btn-accent hover:bg-secondary border-none shadow-sm mb-4 block text-neutral'
            >
              Buy now <ArrowRightOutlined />
            </button>
          </div>
          <div className='col-span-12 md:col-span-8 lg:col-span-9'>
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              autoplay={{ delay: 1500 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              navigation
              modules={[Navigation, Autoplay, Scrollbar]}
              className='rounded-box gap-4 p-2 w-full'
            >
              {homeData?.data.freshProduceProducts.map((product: Product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className='w-full px-4 md:px-32 mt-16'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-8 lg:col-span-9'>
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              navigation
              modules={[Navigation, Autoplay, Scrollbar]}
              autoplay={{ delay: 1500 }}
              className='rounded-box gap-4 py-2 w-full'
            >
              {homeData?.data.fastFoodProducts.map((product: Product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div
            className={`lg:col-span-3 md:col-span-4 col-span-12 bg-cover bg-center rounded-lg flex flex-col justify-between`}
            style={{
              backgroundImage: `url("/images/home/bg-title-link-2.jpg")`,
            }}
          >
            <ul className='menu rounded-box'>
              <li>
                <h2 className='menu-title text-black text-lg'>Fast Food</h2>
                <ul className='mt-2'>
                  <Link
                    to='/products?subcategory=instant-noodles'
                    className='hover:text-secondary'
                  >
                    Instant Noodles
                  </Link>
                </ul>
                <ul className='mt-2'>
                  <Link
                    to='/products?subcategory=snack'
                    className='hover:text-secondary'
                  >
                    Snack
                  </Link>
                </ul>
                <ul className='mt-2'>
                  <Link
                    to='/products?subcategory=sweet-and-candy'
                    className='hover:text-secondary'
                  >
                    Sweet and Candy
                  </Link>
                </ul>
              </li>
            </ul>
            <button
              onClick={() => navigate('/products/fast-food')}
              className=' mx-auto btn btn-xs btn-accent hover:bg-secondary border-none shadow-sm mb-4 block text-neutral'
            >
              Buy now <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </section>
      <section className='w-full px-4 md:px-32 mt-16'>
        <div className='grid grid-cols-12 gap-4'>
          <div
            className={`lg:col-span-3 md:col-span-4 col-span-12 bg-cover bg-center rounded-lg flex flex-col justify-between`}
            style={{
              backgroundImage: `url("/images/home/bg-title-link-3.jpg")`,
            }}
          >
            <ul className='menu rounded-box'>
              <li>
                <h2 className='menu-title text-black text-lg'>Beverages</h2>
                <ul className='mt-2'>
                  <Link
                    to='/products/beverages/soft-drinks'
                    className='hover:text-secondary'
                  >
                    Soft Drinks
                  </Link>
                </ul>
                <ul className='mt-2'>
                  <Link
                    to='/products/beverages/milk-and-dairy'
                    className='hover:text-secondary'
                  >
                    Milk and Dairy
                  </Link>
                </ul>
                <ul className='mt-2'>
                  <Link
                    to='/products/beverages/coffee-and-tea'
                    className='hover:text-secondary'
                  >
                    Coffee and Tea
                  </Link>
                </ul>
              </li>
            </ul>
            <button
              onClick={() => navigate('/products/beverages')}
              className=' mx-auto btn btn-xs btn-accent hover:bg-secondary border-none shadow-sm mb-4 block text-neutral'
            >
              Buy now <ArrowRightOutlined />
            </button>
          </div>
          <div className='col-span-12 md:col-span-8 lg:col-span-9'>
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 1500 }}
              navigation
              modules={[Navigation, Autoplay, Scrollbar]}
              className='rounded-box gap-4 p-2 w-full'
            >
              {homeData?.data.beverageProducts.map((product: Product) =>
                product.totalQuantity > 0 ? (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ) : (
                  <></>
                )
              )}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  )
}
