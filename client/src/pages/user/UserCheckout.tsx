import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Select, Radio, Divider, Space } from 'antd'
import { useAppSelector } from '@/store'
import {
  useGetListProductByIdsQuery,
  useLazyGetDiscountCodeByCodeQuery,
  useUserCreateOrderMutation,
} from '@/services'
import { Loading, PayPalButton, showToast } from '@/components'
import { DISCOUNT_TYPE } from '@/enum'
import { ModalAddAddress } from './UserProfile'
import { Cart, OrderInfo } from '@/types'
import { getCheckedCartFromLocalStorage, formatCurrency } from '@/utils'
import { FaRegTrashAlt } from 'react-icons/fa'
const { Option } = Select

const UserCheckout: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('creditCard')
  const [discountCode, setDiscountCode] = useState<string>('')
  const [modalAddAddressOpen, setModalAddAddressOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [discountInfo, setDiscountInfo] = useState<any>(null)
  const user = useAppSelector((state) => state.auth.user)
  const [selectedAddressID, setSelectedAddressID] = useState<number | null>(
    null
  )
  const [selectedAddress, setSelectedAddress] = useState<Omit<
    OrderInfo,
    'id' | 'accountId'
  > | null>(null)
  const [cartItems, setCartItems] = useState<Cart[]>([])

  const [provisional, setProvisional] = useState<number>(0)

  const cartChecked = getCheckedCartFromLocalStorage()
  const { data: productInCarts } = useGetListProductByIdsQuery(
    cartChecked.map((item: Cart) => item.productId)
  )

  useEffect(() => {
    if (cartItems) {
      const provisional = cartItems.reduce((total, item) => {
        if (item.product?.maxDiscount) {
          return (
            total +
            item.product?.standardPrice *
              (1 - item.product?.maxDiscount / 100) *
              item.quantity
          )
        }
        return total + (item.product?.standardPrice || 0) * item.quantity
      }, 0)
      setProvisional(provisional)
    }
  }, [cartItems])

  useEffect(() => {
    if (productInCarts?.data) {
      const cartItems = cartChecked.map((item: Cart) => {
        return {
          ...item,
          product: productInCarts.data?.find((p) => p.id === item.productId),
        }
      })
      setCartItems(cartItems)
    } else {
      setCartItems([])
    }
  }, [productInCarts])

  useEffect(() => {
    const orderInfo = user?.orderInfos?.find(
      (orderInfo) => orderInfo.id === selectedAddressID
    )
    if (orderInfo) {
      const { id, accountId, ...rest } = orderInfo
      setSelectedAddress(rest)
    } else {
      setSelectedAddress(null)
    }
  }, [selectedAddressID])

  const [
    getDiscountCodeByCode,
    { data: discountCodeData, isLoading: isLoadingDiscountCode },
  ] = useLazyGetDiscountCodeByCodeQuery()

  const handleApplyDiscount = async () => {
    if (discountCode) {
      const res = await getDiscountCodeByCode(discountCode)
      if (res.data?.data) {
        setDiscountInfo(res.data.data)
        setErrorMessage('')
      } else {
        setErrorMessage('Mã giảm giá không hợp lệ')
        setDiscountInfo(null)
        setDiscountCode('')
      }
    }
  }

  const handleClearDiscount = () => {
    setDiscountInfo(null)
    setDiscountCode('')
    setErrorMessage('')
  }

  const handleQuantityChange = (
    productId: number,
    action: 'increase' | 'decrease'
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity:
                action === 'increase'
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 1),
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    )
  }

  const [userCreateOrder, { isLoading: isLoadingUserCreateOrder }] =
    useUserCreateOrderMutation()

  const handleCreateOrder = async () => {
    if (isLoadingUserCreateOrder) return
    try {
      if (cartItems.length === 0) {
        showToast.error('Must be at least 1 item in Order')
        return
      }
      if (!selectedAddress) {
        showToast.error('Please select an address')
        return
      }
      if (paymentMethod === 'paypal') {
        showToast.error('Paypal payment method is not supported yet')
        return
      }
      if (!shippingMethod) {
        showToast.error('Please select a shipping method')
        return
      }
      await userCreateOrder({
        items: JSON.stringify(cartItems),
        discountCode: discountCodeData?.data?.code || '',
        ...selectedAddress,
        shippingMethod,
      }).unwrap()
      showToast.success('Order created successfully')
      setTimeout(() => {
        navigate('/account/orders')
      }, 2000)
    } catch (error: any) {
      showToast.error(error?.data?.message || 'Failed to create order')
    }
  }

  return (
    <div className='w-screen h-screen flex'>
      <div className='w-full bg-white md:px-24 px-8 md:py-10 py-2 grid lg:grid-cols-3 md:gap-10'>
        <div className='lg:col-span-1 flex flex-col items-center'>
          <Form
            form={form}
            layout='vertical'
            initialValues={{
              shippingMethod: 'standard',
            }}
            className='w-full'
          >
            <div className=' flex flex-col gap-4 w-full items-center'>
              <div className=' w-full'>
                <h2 className='text-2xl font-bold mb-4'>Order Information</h2>
                <Form.Item
                  name='orderInfo'
                  label={
                    <div className='flex flex-row w-full items-center justify-between gap-2'>
                      <p>Select Address</p>
                      <Button
                        type='link'
                        onClick={() => setModalAddAddressOpen(true)}
                      >
                        + Add new address
                      </Button>
                    </div>
                  }
                  rules={[
                    { required: true, message: 'Please select an address' },
                  ]}
                  className='mb-2 w-full'
                >
                  <Radio.Group
                    onChange={(e) => setSelectedAddressID(e.target.value)}
                    className='w-full max-h-[200px] overflow-auto'
                  >
                    <Space direction='vertical' className='w-full'>
                      {user?.orderInfos?.map((orderInfo) => (
                        <Radio key={orderInfo.id} value={orderInfo.id}>
                          <div className=' flex flex-col text-sm font-medium gap-2 border-b border-gray-200 pb-2'>
                            <div>Name: {orderInfo.fullName}</div>
                            <div>Address: {orderInfo.address}</div>
                            <div>Phone: {orderInfo.phone}</div>
                            <div>Email: {orderInfo.email}</div>
                          </div>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            <div className=' mt-4'>
              <h3 className='text-lg font-semibold'>Shipping Method</h3>
              <Form.Item
                name='shippingMethod'
                rules={[
                  {
                    required: true,
                    message: 'Please select a shipping method',
                  },
                ]}
              >
                <Radio.Group
                  onChange={(e) => setShippingMethod(e.target.value)}
                  value={shippingMethod}
                >
                  <Radio value='standard'>Standard Shipping</Radio>
                  <Radio value='express'>Express Shipping</Radio>
                </Radio.Group>
              </Form.Item>
              <Divider />
              <h3 className='text-lg font-semibold'>Payment Method</h3>
              <Form.Item
                name='paymentMethod'
                rules={[
                  {
                    required: true,
                    message: 'Please select a payment method',
                  },
                ]}
                className='w-full'
              >
                <Select onChange={setPaymentMethod}>
                  <Option value='cod'>Cash on Delivery</Option>
                  <Option value='paypal'>PayPal</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className='lg:col-span-2 md:px-12 px-0'>
          <h2 className='text-2xl font-bold mb-4 text-primary'>
            Your Products
          </h2>
          <div className='w-full flex flex-col gap-4'>
            <div className='px-4 max-h-[40vh] overflow-y-auto'>
              {cartItems?.map((item: Cart) => (
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
                      <span className='font-medium'>{item.product?.name}</span>
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
                      onClick={() => handleRemoveItem(item.productId)}
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
                          onClick={() => handleRemoveItem(item.productId)}
                          className=' btn btn-sm btn-error px-4 py-2 text-white rounded-md hover:bg-red-600 transition-all duration-300 ease-in-out'
                        >
                          Remove
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
            <Divider />
            <div className='mt-4'>
              <div className='flex flex-row items-center gap-2 justify-between'>
                <span className='font-bold text-primary'>Provisional</span>
                <span>{formatCurrency(provisional || 0)}</span>
              </div>
              <div className='flex flex-row items-center gap-2 justify-between'>
                <span className='font-bold text-primary'>Shipping fee</span>
                <span>
                  {shippingMethod === 'standard' ? '$5.00' : '$10.00'}
                </span>
              </div>
              {discountInfo && (
                <div className='mt-2 flex flex-row items-center justify-between gap-2'>
                  <span className='font-bold text-primary'>Giảm giá</span>{' '}
                  <span className='text-red-500'>
                    -{' '}
                    {discountInfo.discountType === DISCOUNT_TYPE.PERCENTAGE
                      ? `${discountInfo.discountValue}%`
                      : formatCurrency(discountInfo.discountValue)}
                  </span>
                </div>
              )}

              <>
                <Divider />
              </>
              <div className='flex flex-row items-center gap-2 justify-between font-bold'>
                <span className='font-bold text-primary'>Total</span>
                {discountInfo ? (
                  discountInfo.discountType === DISCOUNT_TYPE.PERCENTAGE ? (
                    <span className=''>
                      {formatCurrency(
                        (provisional || 0) +
                          (shippingMethod === 'standard' ? 5 : 10) -
                          (discountInfo.discountValue / 100) *
                            (provisional || 0)
                      )}
                    </span>
                  ) : (
                    <span>
                      {formatCurrency(
                        (provisional || 0) +
                          (shippingMethod === 'standard' ? 5 : 10) -
                          discountInfo.discountValue
                      )}
                    </span>
                  )
                ) : (
                  <span>
                    {formatCurrency(
                      (provisional || 0) +
                        (shippingMethod === 'standard' ? 5 : 10)
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input
                className={`input input-bordered w-full ${
                  errorMessage ? 'input-error' : ''
                }`}
                placeholder='Enter discount code'
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value)
                  if (e.target.value === '') {
                    handleClearDiscount()
                  }
                }}
              />

              <Button
                className='btn btn-primary text-white'
                onClick={handleApplyDiscount}
                loading={isLoadingDiscountCode}
                disabled={!discountCode}
              >
                Apply
              </Button>
            </div>
            {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
          </div>
          <div className='mt-4'>
            {paymentMethod === 'paypal' && (
              <PayPalButton
                items={
                  cartItems?.map((item) => ({
                    quantity: item.quantity,
                    productId: item.productId,
                  })) || []
                }
                discountCode={discountCode}
                selectedOrderInfo={selectedAddress}
                shippingMethod={shippingMethod}
              />
            )}
            {paymentMethod === 'cod' && (
              <button
                className='btn btn-secondary w-full text-white'
                onClick={handleCreateOrder}
              >
                {isLoadingUserCreateOrder ? (
                  <Loading size='loading-sm' />
                ) : (
                  'Order now'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <ModalAddAddress
        open={modalAddAddressOpen}
        setOpen={setModalAddAddressOpen}
        editOrderInfo={null}
      />
    </div>
  )
}

export { UserCheckout }
