import React, { useEffect, useState } from 'react'
import { Tabs, Card, Row, Col } from 'antd'
import { Order } from '@/types' // Assuming you have an Order type defined
import { enumToArray, formatCurrency, stringToDate } from '@/utils' // Assuming you have a utility to format currency
import { Breadcrumb, Loading } from '@/components'
import { useGetUserOrdersQuery } from '@/services'
import { ORDER_STATUS } from '@/enum'
import { EyeOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const UserMyOrder: React.FC = () => {
  const { data: orders, isLoading: isLoadingOrders } = useGetUserOrdersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [ordersData, setOrdersData] = useState<Order[]>([])

  const orderStatuses = enumToArray(ORDER_STATUS)

  const [activeTab, setActiveTab] = useState(orderStatuses[0].value)

  useEffect(() => {
    if (orders) {
      if (activeTab) {
        setOrdersData(
          orders.data.filter((order) => order.orderStatus === activeTab)
        )
      } else {
        setOrdersData(orders.data)
      }
    }
  }, [activeTab, orders])
  return (
    <div className=' px-4 mt-10 '>
      <h1 className='text-2xl font-bold text-primary'>Your history orders</h1>
      <div role='tablist' className='tabs tabs-boxed mt-4'>
        {orderStatuses.map((status, index) => (
          <a
            role='tab'
            className={`tab border-2 border-base-200 rounded-lg text-black checked:bg-primary checked:text-white ${
              activeTab === status.value ? 'tab-active' : ''
            }`}
            key={index}
            onClick={() => setActiveTab(status.value)}
          >
            {status.label}
          </a>
        ))}
      </div>
      <div className=' max-h-[400px] h-full mt-10 overflow-y-auto px-2'>
        {isLoadingOrders ? (
          <div className='flex justify-center items-center h-full'>
            <Loading />
          </div>
        ) : ordersData.length > 0 ? (
          <>
            <div className='flex flex-col gap-4'>
              {ordersData.map((order) => (
                <OrderCard order={order} />
              ))}
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-full'>
            <p className='text-2xl font-bold text-primary'>
              You have no orders yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Link to={`/account/orders/${order.code}`}>
      <div className='flex justify-between items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200'>
        <div className='flex flex-col gap-2 '>
          <div className='flex items-center'>
            {order.orderStatus === ORDER_STATUS.PENDING && (
              <span className='badge badge-warning text-xs text-white uppercase'>
                <span className='dot text-yellow-500 mx-1 font-bold'>•</span>
                {order.orderStatus}
              </span>
            )}
            {order.orderStatus === ORDER_STATUS.CONFIRMED && (
              <span className='badge badge-success'>
                {order.orderStatus}{' '}
                <span className='dot text-green-500 mx-1 font-bold'>•</span>
              </span>
            )}
            {order.orderStatus === ORDER_STATUS.SHIPPING && (
              <span className='badge badge-info'>
                {order.orderStatus}{' '}
                <span className='dot text-blue-500 mx-1 font-bold'>•</span>
              </span>
            )}
            {order.orderStatus === ORDER_STATUS.DELIVERED && (
              <span className='badge badge-success'>
                {order.orderStatus}{' '}
                <span className='dot text-green-500 mx-1 font-bold'>•</span>
              </span>
            )}
            {order.orderStatus === ORDER_STATUS.CANCELLED && (
              <span className='badge badge-error'>
                {order.orderStatus}{' '}
                <span className='dot text-red-500 mx-1 font-bold'>•</span>
              </span>
            )}
            {order.orderStatus === ORDER_STATUS.REJECTED && (
              <span className='badge badge-error'>
                {order.orderStatus}{' '}
                <span className='dot text-red-500 mx-1 font-bold'>•</span>
              </span>
            )}
            <span className='mx-2'>|</span>
            <span className='text-gray-600 text-sm'>
              {stringToDate(order.createdAt)}
            </span>
          </div>
          <div className='flex items-center gap-2 '>
            <div className='flex-shrink-0'>
              <div className='indicator'>
                <span className='indicator-item badge badge-gray indicator-bottom indicator-end'>
                  {order.orderItems.length}
                </span>
                <img
                  src={order.orderItems[0]?.product?.mainImage}
                  alt='Product'
                  className='w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm'
                />
              </div>
            </div>
            <div className='ml-4 flex-grow'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Order ID: <span className='text-gray-500'>{order.code}</span>
              </h2>
              <p className='text-gray-600 text-sm truncate'>
                {order.orderItems.map((item) => item.product.name).join(', ')}
              </p>
              <p className='text-gray-600'>
                <span className='font-semibold text-primary'>
                  {formatCurrency(
                    order.totalAmount + order.shippingFee - order.discount
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <Link
            to={`/account/orders/${order.code}`}
            className='btn bg-none border-none text-primary rounded-full p-2 transition duration-300 hover:bg-primary-light'
          >
            <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </Link>
  )
}

export { UserMyOrder }
