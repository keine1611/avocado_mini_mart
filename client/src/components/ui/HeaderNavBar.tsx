import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, Input, MenuProps, Drawer, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { PiHeartBold, PiShoppingCartBold } from 'react-icons/pi'
import { IoMenu } from 'react-icons/io5'
import { logo } from '@/constant'
import { useAppSelector } from '@/store'
import { auth } from '@/hooks'
import { Cart } from '@/types'
import { useAppDispatch } from '@/store'
import { cartActions } from '@/store'
import {
  setCheckedCartFromLocalStorage,
  clearCheckedCartFromLocalStorage,
} from '@/utils'

const favoritesMenu: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to='/favorites'>View Favorites</Link>,
  },
  {
    key: '2',
    label: <Link to='/favorites/manage'>Manage Favorites</Link>,
  },
]

const HeaderNavBar: React.FC = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { cart } = useAppSelector((state) => state.cart)
  const { favorites } = useAppSelector((state) => state.favorite)
  const navigate = useNavigate()

  const handleQuantityChange = (
    productId: number | undefined,
    action: 'increase' | 'decrease'
  ) => {
    if (productId) {
      if (action === 'increase') {
        const cartItem = cart.find((item) => item.productId === productId)
        dispatch(cartActions.plusCart({ productId }))

        if (cartItem) {
          setCheckedCartItems((prev) => [
            ...prev.filter((item) => item.productId !== productId),
            { ...cartItem, quantity: cartItem.quantity + 1 },
          ])
        }
      } else if (action === 'decrease') {
        dispatch(cartActions.minusCart({ productId }))

        const cartItem = cart.find((item) => item.productId === productId)
        if (cartItem) {
          setCheckedCartItems((prev) => [
            ...prev.filter((item) => item.productId !== productId),
            { ...cartItem, quantity: cartItem.quantity - 1 },
          ])
        }
      }
    }
  }

  const profileMenu: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to='/account/profile'>Account</Link>,
    },
    {
      key: '2',
      label: <div onClick={auth().logout}>Logout</div>,
    },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleDrawer = (trigger: boolean) => {
    setDrawerVisible(trigger)
  }

  const isActiveLink = (path: string) =>
    location.pathname === path ? 'text-secondary font-bold' : 'text-neutral'
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const [checkedCartItems, setCheckedCartItems] = useState<Cart[]>([])

  const handleCheckboxChange = (cartItem: Cart, checked: boolean) => {
    if (checked) {
      setCheckedCartItems((prev) => [...prev, cartItem])
    } else {
      setCheckedCartItems((prev) => prev.filter((item) => item !== cartItem))
    }
  }

  const handleCheckout = () => {
    setCheckedCartFromLocalStorage(checkedCartItems)
    navigate('/checkout')
  }

  return (
    <div className=' sticky top-0 w-full h-24 bg-primary shadow-lg grid md:grid-cols-12 sm:grid-cols-5 grid-cols-2 items-center justify-between px-6 transition-all duration-300 ease-in-out z-50'>
      <button
        className='md:hidden block sm:col-span-2'
        onClick={() => toggleDrawer(true)}
      >
        <IoMenu className='text-neutral text-[32px] font-bold' />
      </button>
      <div className='hidden md:flex flex-row justify-between gap-4 items-start sm:col-span-2 md:col-span-5 mr-auto'>
        <Link
          to='/'
          className={`${isActiveLink(
            '/'
          )} text-md hover:text-secondary transition duration-200`}
          onClick={() => toggleDrawer(false)}
        >
          Home
        </Link>
        <Link
          to='/products'
          className={`${isActiveLink(
            '/products'
          )} text-md hover:text-secondary transition duration-200`}
          onClick={() => toggleDrawer(false)}
        >
          Products
        </Link>
        <Link
          to='/categories'
          className={`${isActiveLink(
            '/categories'
          )} text-md hover:text-secondary transition duration-200`}
          onClick={() => toggleDrawer(false)}
        >
          Categories
        </Link>
        <Link
          to='/'
          className={`${isActiveLink(
            '/'
          )} text-md hover:text-secondary transition duration-200`}
          onClick={() => toggleDrawer(false)}
        >
          About
        </Link>
      </div>
      <Link
        to='/'
        className='hidden rounded-full px-4 py-2 h-16 md:h-24 min-w-24 md:col-span-2 col-span-1 sm:block'
      >
        <img
          src={logo}
          alt='Minimart'
          className='h-full w-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-110'
        />
      </Link>
      <div className='flex items-center gap-4 sm:col-span-2 md:col-span-5 ml-auto'>
        <div className='relative max-w-xs'>
          <input
            type='text'
            className=' input-sm w-full p-4 border shadow rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200'
            placeholder='search'
          />
          <button type='submit' className='absolute right-0 top-0'>
            <SearchOutlined className='text-md bg-secondary text-neutral p-2 h-full rounded-full hover:cursor-pointer hover:bg-secondary/80' />
          </button>
        </div>

        {user ? (
          <>
            <a onClick={() => showModal()}>
              <button className='btn btn-ghost transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-secondary rounded-full p-2'>
                <div className='indicator'>
                  <span className='indicator-item badge indicator-bottom badge-secondary px-1'>
                    {cart.length}
                  </span>
                  <PiShoppingCartBold className='text-[20px] text-neutral' />
                </div>
              </button>
            </a>

            <Dropdown menu={{ items: favoritesMenu }} trigger={['click']} arrow>
              <a onClick={(e) => e.preventDefault()}>
                <button className='btn btn-ghost transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-secondary rounded-full p-2'>
                  <div className='indicator'>
                    <span className='indicator-item badge indicator-bottom badge-secondary px-1'>
                      {favorites.length}
                    </span>
                    <PiHeartBold className='text-[20px] text-neutral' />
                  </div>
                </button>
              </a>
            </Dropdown>
            <Dropdown menu={{ items: profileMenu }} trigger={['click']} arrow>
              <a onClick={(e) => e.preventDefault()}>
                <div className='avatar h-10 w-10 rounded-full border-neutral border-2'>
                  <div className='w-10 rounded-full'>
                    <img src={user.avatarUrl} />
                  </div>
                </div>
              </a>
            </Dropdown>
          </>
        ) : (
          <Link
            to='/login'
            state={{ from: location.pathname }}
            className='text-md hover:text-secondary transition duration-200'
          >
            Login
          </Link>
        )}
      </div>

      <Drawer
        placement='left'
        closable={true}
        onClose={() => toggleDrawer(false)}
        open={drawerVisible}
        style={{
          backgroundColor:
            'var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)))',
        }}
        className='bg-primary'
      >
        <div className='flex flex-col items-center justify-center gap-4 w-full'>
          <Link
            to='/'
            className={`${isActiveLink(
              '/'
            )} text-md hover:text-secondary transition duration-200`}
            onClick={() => toggleDrawer(false)}
          >
            Home
          </Link>
          <Link
            to='/products'
            className={`${isActiveLink(
              '/products'
            )} text-md hover:text-secondary transition duration-200`}
            onClick={() => toggleDrawer(false)}
          >
            Products
          </Link>
          <Link
            to='/categories'
            className={`${isActiveLink(
              '/categories'
            )} text-md hover:text-secondary transition duration-200`}
            onClick={() => toggleDrawer(false)}
          >
            Categories
          </Link>

          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearch}
            suffix={
              <SearchOutlined className='text-md bg-secondary text-neutral p-2 h-full rounded-full hover:cursor-pointer' />
            }
            className=' border py-0 pr-0 pl-5 border-primary rounded-full hover:shadow-lg focus:border-secondary hover:border-secondary focus-within:border-secondary transition-all duration-200 ease-in-out'
          />
        </div>
      </Drawer>
      <div className='absolute bottom-0 right-0 left-0 h-[28px] transform translate-y-[99%] m-0 p-0 md:block hidden'>
        <img src={'/images/bg-after-header.png'} className='w-full h-full' />
      </div>
      <Modal
        title='Your Cart'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className='rounded-lg shadow-lg'
        width={800}
        footer={null}
      >
        <div className='cart-list p-4 bg-white rounded-lg overflow-y-auto'>
          {cart.length === 0 ? (
            <p className='text-center text-gray-500'>Your cart is empty.</p>
          ) : (
            <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2 max-h-[300px] overflow-y-auto pr-4'>
                <div className='space-y-4'>
                  {cart.map((item: Cart) => (
                    <div
                      key={item.product?.id}
                      className='flex justify-between items-center p-2 border-b border-gray-200'
                    >
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='mr-2 hover:cursor-pointer checkbox-primary'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCheckboxChange(item, e.target.checked)
                          }
                        />
                        <img
                          src={item.product?.mainImage}
                          alt={item.product?.name}
                          className='w-16 h-16 object-contain rounded-md mr-2'
                        />
                        <div className='flex flex-col gap-2'>
                          <span className='font-medium'>
                            {item.product?.name}
                          </span>
                          <span className='text-gray-500'>
                            ${item.product?.standardPrice}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, 'decrease')
                          }
                          className='px-2 border border-gray-300 rounded-md hover:bg-gray-100'
                        >
                          -
                        </button>
                        <span className='mx-2'>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, 'increase')
                          }
                          className='px-2 border border-gray-300 rounded-md hover:bg-gray-100'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='md:col-span-1 pl-4'>
                <h3 className='font-bold text-lg'>Total:</h3>
                <p className='text-xl font-semibold'>
                  $
                  {checkedCartItems
                    .reduce(
                      (total, item) =>
                        total +
                        (item.product?.standardPrice || 0) * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  className='btn btn-primary mt-4 btn-block mx-auto'
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export { HeaderNavBar }
