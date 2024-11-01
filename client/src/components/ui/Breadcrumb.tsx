import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { slugToTitle } from '@/utils'

const Breadcrumb: React.FC = () => {
  const [path, setPath] = useState<{ name: string; link: string }[]>([])
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    const pathSegments = pathname.split('/').filter(Boolean)
    const fullPath = pathSegments.map((segment, index) => {
      const linkPath = '/' + pathSegments.slice(0, index + 1).join('/')
      return { name: segment, link: linkPath }
    })
    setPath(fullPath)
  }, [location.pathname])

  return (
    <div className='breadcrumbs bg-[url("/images/bg-breadcrumb.jpg")] bg-cover bg-center bg-no-repeat h-[130px] lg:h-[250px]'>
      <ul className='flex items-center justify-center h-full'>
        <li>
          <Link className='text-black text-sm capitalize' to='/'>
            <FaHome className='h-4 w-4 hover:text-primary' />
          </Link>
        </li>
        {path.map(({ name, link }) => (
          <li key={link}>
            <Link
              className='text-black text-sm capitalize hover:text-secondary'
              to={link}
            >
              {slugToTitle(name)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Breadcrumb }
