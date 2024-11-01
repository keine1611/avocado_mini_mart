import { useEffect, useState } from 'react'
import { useGetAllMainCategoryQuery } from '@/services'
import { Collapsible } from '@/components'
import { Link, useParams } from 'react-router-dom'
import { MainCategory, SubCategory } from '@/types'

const FilterSide: React.FC = () => {
  const { data: mainCategoryData } = useGetAllMainCategoryQuery()
  const { slugmaincategory } = useParams()

  const [subCategory, setSubCategory] = useState<SubCategory[] | undefined>(
    undefined
  )
  const [mainCategory, setMainCategory] = useState<MainCategory | undefined>(
    undefined
  )

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

        <ul className='  *:hover:cursor-pointer flex flex-col gap-3 border border-base-300 rounded-b-xl shadow-md p-4 text-sm'>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='1'
            />
            <span className='text-sm'>Under 10$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='2'
            />
            <span className='text-sm'>10$ - 20$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='3'
            />
            <span className='text-sm'>20$ - 50$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='4'
            />
            <span className='text-sm'>50$ - 100$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='5'
            />
            <span className='text-sm'>100$ - 200$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='6'
            />
            <span className='text-sm'>200$ - 500$</span>
          </li>
          <li className='flex items-center gap-2'>
            <input
              type='checkbox'
              className='checkbox checkbox-xs rounded-sm checked:text-white checkbox-secondary'
              value='7'
            />
            <span className='text-sm'>Above 500$</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export { FilterSide }
