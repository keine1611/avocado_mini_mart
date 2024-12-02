import { logo } from '@/constant'
import { DashboardIcon, DatabaseIcon, SideBarIcon } from '@/resources'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTasks } from 'react-icons/fa'
import { useAppSelector } from '@/store'

export const AdminSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)
  const isActiveLink = (path: string) => location.pathname.startsWith(path)
  const isActiveExactLink = (path: string) => location.pathname === path
  return (
    <>
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
        <div className='drawer-content z-50'>
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
            className={`drawer-overlay ${isOpen ? 'block' : 'hidden'}`}
          ></label>
          <div className='menu bg-base-200 h-screen flex flex-col p-0 shadow-lg w-80'>
            <div className='p-4 flex items-center justify-center'>
              <img src={logo} className='h-12 object-contain' alt='Logo' />
            </div>
            <div className='flex-1 bg-base-100 flex flex-col gap-2 py-4 px-2 overflow-y-auto'>
              {user?.role?.name === 'ADMIN' && (
                <>
                  <SidebarItem
                    icon={<DashboardIcon className='h-6 w-6' />}
                    title='Dashboard'
                    isOpen={isOpen}
                    isActive={isActiveLink('/admin/dashboard')}
                    expandedItem={expandedItem}
                    setExpandedItem={setExpandedItem}
                    itemKey='dashboard'
                  >
                    <SidebarSubItem
                      to='/admin/dashboard'
                      title='Dashboard'
                      isActive={isActiveExactLink('/admin/dashboard')}
                    />
                    <SidebarSubItem
                      to='/admin/dashboard/inventory-analytics'
                      title='Inventory Analytics'
                      isActive={isActiveExactLink(
                        '/admin/dashboard/inventory-analytics'
                      )}
                    />
                    <SidebarSubItem
                      to='/admin/dashboard/sales-analytics'
                      title='Sales Analytics'
                      isActive={isActiveExactLink(
                        '/admin/dashboard/sales-analytics'
                      )}
                    />
                  </SidebarItem>
                  <SidebarItem
                    icon={<DatabaseIcon className='h-6 w-6' />}
                    title='Database'
                    isOpen={isOpen}
                    isActive={isActiveLink('/admin/databases')}
                    expandedItem={expandedItem}
                    setExpandedItem={setExpandedItem}
                    itemKey='database'
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
                      isActive={isActiveLink(
                        '/admin/databases/main-categories'
                      )}
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
                      to='/admin/databases/batches'
                      title='Batches'
                      isActive={isActiveLink('/admin/databases/batches')}
                    />
                    <SidebarSubItem
                      to='/admin/databases/discounts'
                      title='Discounts Event'
                      isActive={isActiveLink('/admin/databases/discounts')}
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
                    <SidebarSubItem
                      to='/admin/databases/roles'
                      title='Roles'
                      isActive={isActiveLink('/admin/databases/roles')}
                    />
                  </SidebarItem>
                </>
              )}
              <SidebarItem
                icon={<FaTasks className='h-6 w-6 text-secondary' />}
                title='Tasks'
                isOpen={isOpen}
                isActive={isActiveLink('/admin/tasks')}
                expandedItem={expandedItem}
                setExpandedItem={setExpandedItem}
                itemKey='tasks'
              >
                <SidebarSubItem
                  to='/admin/tasks/check-orders'
                  title='Check Order'
                  isActive={isActiveLink('/admin/tasks/check-orders')}
                />
              </SidebarItem>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  isOpen: boolean
  isActive: boolean
  children: React.ReactNode
  expandedItem: string | null
  setExpandedItem: (itemKey: string | null) => void
  itemKey: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  isOpen,
  isActive,
  children,
  expandedItem,
  setExpandedItem,
  itemKey,
}) => {
  const isExpanded = expandedItem === itemKey

  return (
    <div
      className={`collapse collapse-arrow border-base-300 bg-base-200 rounded-md ${
        isActive ? '' : ''
      }`}
    >
      <input
        type='checkbox'
        checked={isExpanded}
        onChange={() => setExpandedItem(isExpanded ? null : itemKey)}
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
