import { logo } from '@/constant'
import { DashboardIcon, DatabaseIcon, SideBarIcon } from '@/resources'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const AdminSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActiveLink = (path: string) => location.pathname.startsWith(path)

  return (
    <div
      className={`drawer z-50 transition-all duration-300 ${
        isOpen ? ' w-80' : ' w-20'
      }`}
    >
      <input
        id='sidebar'
        type='checkbox'
        className='drawer-toggle'
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className='drawer-content'>
        <label
          htmlFor='sidebar'
          className='btn btn-primary drawer-button p-2 m-2 rounded-full hover:bg-primary-focus'
        >
          <SideBarIcon className='w-6 h-6 fill-base-100' />
        </label>
      </div>
      <div className={`drawer-side ${isOpen ? '' : ' w-20'}`}>
        <label
          htmlFor='sidebar'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <div className='menu bg-base-200 h-screen flex flex-col p-0 shadow-lg w-80'>
          <div className='p-4 flex items-center justify-center'>
            <img src={logo} className='h-12 object-contain' alt='Logo' />
          </div>
          <div className='flex-1 bg-base-100 flex flex-col gap-2 py-4 px-2 overflow-y-auto'>
            <SidebarItem
              icon={<DashboardIcon className='h-6 w-6' />}
              title='Dashboard'
              isOpen={isOpen}
              isActive={isActiveLink('/dashboard')}
            >
              <SidebarSubItem
                to='/dashboard/analytics'
                title='Analytics'
                isActive={isActiveLink('/dashboard/analytics')}
              />
              <SidebarSubItem
                to='/dashboard/ecommerce'
                title='Ecommerce'
                isActive={isActiveLink('/dashboard/ecommerce')}
              />
              <SidebarSubItem
                to='/dashboard/project'
                title='Project'
                isActive={isActiveLink('/dashboard/project')}
              />
              <SidebarSubItem
                to='/dashboard/report'
                title='Report'
                isActive={isActiveLink('/dashboard/report')}
              />
            </SidebarItem>
            <SidebarItem
              icon={<DatabaseIcon className='h-6 w-6' />}
              title='Database'
              isOpen={isOpen}
              isActive={isActiveLink('/database')}
            >
              <SidebarSubItem
                to='/admin/databases/brands'
                title='Brands'
                isActive={isActiveLink('/admin/databases/brands')}
              />
              <SidebarSubItem
                to='/admin/databases/products'
                title='Products'
                isActive={isActiveLink('/admin/databases/products')}
              />
              <SidebarSubItem
                to='/admin/databases/main-categories'
                title='Main Categories'
                isActive={isActiveLink('/admin/databases/main-categories')}
              />
              <SidebarSubItem
                to='/admin/databases/sub-categories'
                title='Sub Categories'
                isActive={isActiveLink('/admin/databases/sub-categories')}
              />
              <SidebarSubItem
                to='/admin/databases/users'
                title='Users'
                isActive={isActiveLink('/admin/databases/users')}
              />
              <SidebarSubItem
                to='/admin/databases/orders'
                title='Orders'
                isActive={isActiveLink('/admin/databases/orders')}
              />
              <SidebarSubItem
                to='/admin/databases/batches'
                title='Batches'
                isActive={isActiveLink('/admin/databases/batches')}
              />
              <SidebarSubItem
                to='/admin/databases/discount-codes'
                title='Discount Codes'
                isActive={isActiveLink('/admin/databases/discount-codes')}
              />
              <SidebarSubItem
                to='/admin/databases/shippings'
                title='Shippings'
                isActive={isActiveLink('/admin/databases/shippings')}
              />
            </SidebarItem>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  isOpen: boolean
  isActive: boolean
  children: React.ReactNode
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  isOpen,
  isActive,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`collapse collapse-arrow border-base-300 bg-base-200 rounded-md ${
        isActive ? 'border-l-4 border-primary' : ''
      }`}
    >
      <input
        type='checkbox'
        checked={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        className='peer'
      />
      <div
        className={`collapse-title font-semibold flex items-center gap-3 ${
          isActive ? 'text-primary' : ''
        }`}
      >
        {icon}
        {isOpen && <span className='capitalize'>{title}</span>}
      </div>
      {isOpen && (
        <div className='collapse-content bg-base-100 pt-2'>{children}</div>
      )}
    </div>
  )
}

interface SidebarSubItemProps {
  to: string
  title: string
  isActive: boolean
}

const SidebarSubItem: React.FC<SidebarSubItemProps> = ({
  to,
  title,
  isActive,
}) => (
  <Link
    to={to}
    className={`block py-2 px-4 rounded-md transition-colors duration-200 mt-2 ${
      isActive ? 'bg-primary text-base-100' : 'hover:bg-base-200'
    }`}
  >
    {title}
  </Link>
)
