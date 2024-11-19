import { useEffect, useState } from 'react'
import { useGetAllMainCategoryQuery } from '@/services'
import { Collapsible } from '@/components'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { MainCategory, SubCategory } from '@/types'

const FilterSide: React.FC = () => {
  const { data: mainCategoryData } = useGetAllMainCategoryQuery()
  const { slugmaincategory } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [subCategory, setSubCategory] = useState<SubCategory[] | undefined>(
    undefined
  )
  const [mainCategory, setMainCategory] = useState<MainCategory | undefined>(
    undefined
  )
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  )

  useEffect(() => {
    switch (searchParams.get('maxprice')) {
      case '10':
        setSelectedPriceRange('1')
        break
      case '20':
        setSelectedPriceRange('2')
        break
      case '50':
        setSelectedPriceRange('3')
        break
      case '100':
        setSelectedPriceRange('4')
        break
      case '200':
        setSelectedPriceRange('5')
        break
      case '500':
        setSelectedPriceRange('6')
        break
      default:
        setSelectedPriceRange(null)
    }
    if (
      searchParams.get('minprice') === '500' &&
      searchParams.get('maxprice') === 'undefined'
    ) {
      setSelectedPriceRange('7')
    }
  }, [])

  useEffect(() => {
    if (slugmaincategory) {
      let category = mainCategoryData?.data?.find(
        (category) => category.slug === slugmaincategory
      )
      setMainCategory(category)
      setSubCategory(category?.subCategories)
    } else {
      setSubCategory(undefined)
    }
  }, [slugmaincategory, mainCategoryData])

  const handlePriceFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedPriceRange(value)
    switch (value) {
      case '1':
        setMinPrice(0)
        setMaxPrice(10)
        break
      case '2':
        setMinPrice(10)
        setMaxPrice(20)
        break
      case '3':
        setMinPrice(20)
        setMaxPrice(50)
        break
      case '4':
        setMinPrice(50)
        setMaxPrice(100)
        break
      case '5':
        setMinPrice(100)
        setMaxPrice(200)
        break
      case '6':
        setMinPrice(200)
        setMaxPrice(500)
        break
      case '7':
        setMinPrice(500)
        setMaxPrice(undefined)
        break
      default:
        setMinPrice(undefined)
        setMaxPrice(undefined)
    }
  }

  useEffect(() => {
    if (selectedPriceRange !== null) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        maxprice: maxPrice?.toString() || '',
        minprice: minPrice?.toString() || '',
      })
    } else {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('maxprice')
      newParams.delete('minprice')
      setSearchParams(newParams)
    }
  }, [maxPrice, minPrice, selectedPriceRange])

  return (
    <div className='lg:col-span-3 col-span-12'>
      <div className=' w-full'>
        <h3 className='text-sm font-semibold bg-primary p-4 rounded-t-xl text-white uppercase'>
          {mainCategory ? mainCategory.name : 'Categories'}
        </h3>
        <ul className=' *:hover:cursor-pointer flex flex-col border border-base-300 rounded-b-xl shadow-md px-2 pb-2 text-sm'>
          {subCategory ? (
            <div className='flex flex-col gap-3 p-3'>
              {subCategory?.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/products/${slugmaincategory}/${sub.slug}`}
                  className='hover:text-secondary'
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          ) : (
            mainCategoryData?.data?.map((category) => {
              if (category.subCategories.length > 0) {
                return (
                  <Collapsible
                    key={category.id}
                    title={
                      <Link
                        to={`/products/${category.slug}`}
                        className='hover:text-secondary'
                      >
                        {category.name}
                      </Link>
                    }
                    className='w-full mt-2'
                  >
                    <div className='flex flex-col gap-3'>
                      {category.subCategories.map((subCategory) => (
                        <Link
                          to={`/products/${category.slug}/${subCategory.slug}`}
                          key={subCategory.id}
                          className='hover:text-secondary'
                        >
                          {subCategory.name}
                        </Link>
                      ))}
                    </div>
                  </Collapsible>
                )
              } else {
                return (
                  <li key={category.id} className='hover:text-secondary'>
                    {category.name}
                  </li>
                )
              }
            })
          )}
        </ul>
      </div>
      <div className=' w-full mt-4'>
        <h3 className='text-sm font-semibold bg-primary p-4 rounded-t-xl text-white uppercase'>
          Filter By Price
        </h3>

        <ul className='*hover:cursor-pointer flex flex-col gap-3 border border-base-300 rounded-b-xl shadow-md p-4 text-sm'>
          {['1', '2', '3', '4', '5', '6', '7'].map((value) => (
            <li className='flex items-center gap-2' key={value}>
              <input
                onChange={handlePriceFilter}
                type='checkbox'
                className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
                value={value}
                checked={selectedPriceRange === value}
              />
              <span className='text-sm'>
                {value === '1' && 'Under 10$'}
                {value === '2' && '10$ - 20$'}
                {value === '3' && '20$ - 50$'}
                {value === '4' && '50$ - 100$'}
                {value === '5' && '100$ - 200$'}
                {value === '6' && '200$ - 500$'}
                {value === '7' && 'Above 500$'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { FilterSide }
