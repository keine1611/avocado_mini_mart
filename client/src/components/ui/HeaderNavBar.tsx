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
import { setCheckedCartFromLocalStorage } from '@/utils'
import { showToast } from '@/components'
import { FaRegTrashAlt } from 'react-icons/fa'

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
      const cartItem = cart.find((item) => item.productId === productId)
      if (action === 'increase') {
        if (
          cartItem &&
          cartItem.quantity >= (cartItem.product?.totalQuantity || 0)
        ) {
          showToast.warning(
            'Quantity exceeds stock, but you can still decrease or remove.'
          )
        } else {
          dispatch(cartActions.plusCart({ productId }))
        }
      } else if (action === 'decrease') {
        dispatch(cartActions.minusCart({ productId }))
      }
    }
  }

  useEffect(() => {
    const cartChecked = cart.filter((item) =>
      checkedCartItems.some(
        (checkedItem) => checkedItem.productId === item.productId
      )
    )
    setCheckedCartItems(cartChecked)
  }, [cart])

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
      const haveCartItem = checkedCartItems.find(
        (item) => item.productId === cartItem.productId
      )

      if (!haveCartItem) {
        if (cartItem.quantity > (cartItem.product?.totalQuantity || 0)) {
          showToast.warning(
            'Quantity exceeds stock, but you can still decrease or remove.'
          )
          return
        } else {
          setCheckedCartItems((prev) => {
            const newCart = [...prev].filter(
              (item) => item.productId !== cartItem.productId
            )
            return [...newCart, cartItem]
          })
        }
      } else {
        setCheckedCartItems((prev) => [...prev, cartItem])
      }
    } else {
      setCheckedCartItems((prev) =>
        prev.filter((item) => item.productId !== cartItem.productId)
      )
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
          to='/about'
          className={`${isActiveLink(
            '/about'
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
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            onClick={() => navigate(`/products?search=${searchTerm}`)}
            type='submit'
            className='absolute right-0 top-0'
          >
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
            className='text-md hover:text-secondary transition duration-200 text-white'
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
        className='rounded-lg'
        width={1000}
        footer={null}
      >
        <div className='cart-list p-4 bg-white rounded-lg overflow-y-auto'>
          {cart.length === 0 ? (
            <p className='text-center text-gray-500'>Your cart is empty.</p>
          ) : (
            <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2 max-h-[400px] overflow-y-auto pr-4'>
                <div className='space-y-4'>
                  {cart.map((item: Cart) => (
                    <div
                      key={item.product?.id}
                      className='relative flex justify-between items-center p-4 border-b border-gray-200'
                    >
                      {item.quantity > (item.product?.totalQuantity || 0) && (
                        <span className='absolute top-0 right-0 px-2 py-[2px] text-red-500 text-xs'>
                          Exceeds stock
                        </span>
                      )}
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='mr-4 hover:cursor-pointer checkbox-primary'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCheckboxChange(item, e.target.checked)
                          }
                        />
                        <div className='relative'>
                          <img
                            src={item.product?.mainImage}
                            alt={item.product?.name}
                            className='w-20 h-20 object-contain rounded-md mr-4'
                          />
                          {item.product?.maxDiscount != undefined &&
                            item.product?.maxDiscount > 0 && (
                              <div className='absolute top-0 left-0 bg-secondary text-white px-[1px] rounded-br-lg'>
                                <span className='text-xs'>
                                  -{item.product.maxDiscount}%
                                </span>
                              </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                          <span className='font-medium'>
                            {item.product?.name}
                          </span>
                          <span className='text-gray-500'>
                            {item.product?.maxDiscount &&
                            item.product?.maxDiscount > 0 ? (
                              <>
                                <span className='text-red-500'>
                                  $
                                  {(
                                    item.product?.standardPrice -
                                    (item.product?.standardPrice *
                                      item.product?.maxDiscount) /
                                      100
                                  ).toFixed(2)}
                                </span>
                                <span className='line-through ml-2'>
                                  ${item.product?.standardPrice}
                                </span>
                              </>
                            ) : (
                              <span>${item.product?.standardPrice}</span>
                            )}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {`In Stock: ${item.product?.totalQuantity}`}
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
                          className={`px-2 border border-gray-300 rounded-md hover:bg-gray-100 ${
                            item.quantity >= (item.product?.totalQuantity || 0)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={
                            item.quantity >= (item.product?.totalQuantity || 0)
                          }
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            dispatch(
                              cartActions.removeCart({
                                productId: item.productId,
                              })
                            )
                          }
                          className='ml-2 px-2 py-[4px] border border-red-300 rounded-md hover:bg-red-100 text-red-500'
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                      {item.product?.totalQuantity !== undefined &&
                        item.product?.totalQuantity <= 0 && (
                          <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg shadow-lg'>
                            <span className='text-white font-bold mb-2'>
                              Out of Stock
                            </span>
                            <button
                              onClick={() =>
                                dispatch(
                                  cartActions.removeCart({
                                    productId: item.productId,
                                  })
                                )
                              }
                              className=' btn btn-sm btn-error px-4 py-2 text-white rounded-md hover:bg-red-600 transition-all duration-300 ease-in-out'
                            >
                              Remove
                            </button>
                          </div>
                        )}
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
                        (item.product?.standardPrice || 0) *
                          (1 - (item.product?.maxDiscount || 0) / 100) *
                          item.quantity,
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
