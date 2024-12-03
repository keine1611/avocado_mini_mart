import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useGetOrderByCodeQuery,
  usePaypalVerifyOrderMutation,
  useRetryPaymentMutation,
  useUserCancelOrderMutation,
} from '@/services'
import {
  Loading,
  ModalUserReview,
  OrderLogTimeline,
  OrderStep,
  showToast,
} from '@/components'
import { Divider, Modal, Table } from 'antd'
import { ColumnType } from 'antd/es/table/interface'
import { OrderItem } from '@/types/OrderItem'
import {
  formatCurrency,
  formatPhoneNumber,
  getLocation,
  stringToDate,
} from '@/utils'
import { ORDER_STATUS } from '@/enum/orderStatus'
import { MdOutlineReviews, MdOutlineCancel } from 'react-icons/md'
import { BiCommentCheck } from 'react-icons/bi'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const UserOrderDetail: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>()
  const [userCancelOrder, { isLoading: isCanceling }] =
    useUserCancelOrderMutation()
  const {
    data: order,
    isLoading,
    refetch,
    isFetching,
  } = useGetOrderByCodeQuery(orderCode || '')

  const [openModalReview, setOpenModalReview] = useState(false)
  const [openModalRetryPayment, setOpenModalRetryPayment] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(
    null
  )

  const handleReview = (record: OrderItem) => {
    setSelectedOrderItem(record)
    setOpenModalReview(true)
  }

  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Cancel Order',
      content: 'Are you sure you want to cancel this order?',
      centered: true,
      onOk: async () =>
        await userCancelOrder(orderCode || '')
          .unwrap()
          .then(() => refetch())
          .catch((err) => {
            showToast.error(err.data.message || 'Something went wrong')
          }),
    })
  }

  const columns: ColumnType<OrderItem>[] = [
    {
      title: '',
      dataIndex: 'image',
      render: (_, record: OrderItem) => (
        <div className='flex flex-row items-center'>
          <img
            className='h-16 w-16 object-cover'
            src={record.product.mainImage}
          ></img>
        </div>
      ),
      width: '100px',
    },
    {
      title: 'Product Name',
      dataIndex: 'product.name',
      render: (_, record: OrderItem) => record.product.name,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => `x${record.quantity}`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (_, record) => {
        if (record.discount && record.discount > 0)
          return (
            <span className='text-black'>
              {formatCurrency(record.price * (1 - record.discount / 100))}
              <span className='text-gray-400 text-sm ml-2 line-through'>
                {formatCurrency(record.price)}
              </span>
            </span>
          )
        return <span>{formatCurrency(record.price)}</span>
      },
    },
    ...(order?.data?.orderStatus === 'delivered'
      ? [
          {
            title: 'Review',
            dataIndex: 'review',
            render: (_: any, record: OrderItem) => (
              <div className='flex items-center justify-center'>
                {record.isReviewed ? (
                  <span className='text-primary'>
                    <BiCommentCheck className='text-3xl' />
                  </span>
                ) : (
                  <button
                    onClick={() => handleReview(record)}
                    className='text-primary btn-ghost btn btn-square'
                  >
                    <MdOutlineReviews className='text-3xl' />
                  </button>
                )}
              </div>
            ),
            width: '100px',
          },
        ]
      : []),
  ]

  return (
    <>
      <div className='w-full h-full overflow-y-auto p-4'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6 text-center text-primary'>
          Order Details
        </h1>

        {isLoading ||
          (isFetching && (
            <div className='h-full max-h-[500px] flex items-center justify-center'>
              <Loading size='loading-md' />
            </div>
          ))}
        {!isLoading && !isFetching && order && (
          <div className='bg-white shadow-lg rounded-lg p-6'>
            <div className='w-full hidden md:block'>
              <OrderStep status={order?.data?.orderStatus as ORDER_STATUS} />
            </div>

            <h2 className='text-xl md:text-2xl font-semibold mb-4'>
              Order Code:{' '}
              <span className='text-primary'>{order.data?.code}</span>
            </h2>
            <div className=' w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div className='flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow'>
                <div className='flex flex-row items-center justify-between gap-2'>
                  <span className='font-bold'>Full Name:</span>
                  <span>{order.data.fullName}</span>
                </div>
                <div className='flex flex-row items-center justify-between gap-2'>
                  <span className='font-bold'>Email:</span>
                  <span>{order.data.email}</span>
                </div>
                <div className='flex flex-row items-center justify-between gap-2'>
                  <span className='font-bold'>Phone:</span>
                  <span>{formatPhoneNumber(order.data.phone)}</span>
                </div>
                <div className='flex flex-row items-center justify-between gap-2'>
                  <span className='font-bold'>Address:</span>
                  <span>
                    {order.data.address},{' '}
                    {getLocation(
                      order.data.provinceCode,
                      order.data.districtCode,
                      order.data.wardCode
                    )}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-bold'>Order Status:</span>{' '}
                  <span className='capitalize'>{order.data.orderStatus}</span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-bold'>Total Amount:</span>{' '}
                  {formatCurrency(
                    order.data.totalAmount +
                      order.data.shippingFee -
                      order.data.discount
                  )}
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-bold'>Payment Method:</span>{' '}
                  <span className='capitalize'>{order.data.paymentMethod}</span>
                </div>
                {order?.data.paymentMethod === 'paypal' && (
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-bold'>Payment Status:</span>{' '}
                    <span className='capitalize'>
                      {order.data.paymentStatus}
                    </span>
                  </div>
                )}
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-bold'>Date Created:</span>{' '}
                  <span>{stringToDate(order.data.createdAt)}</span>
                </div>
              </div>
            </div>
            <h3 className='text-xl font-semibold mt-4'>Order Items</h3>
            <div className='w-full'>
              <Table
                dataSource={order.data.orderItems}
                pagination={false}
                columns={columns}
                className='mt-4 w-full'
                rowKey={(record) => record.id}
                bordered
              />
            </div>
            <div className='collapse collapse-arrow border border-gray-200 mt-2'>
              <input type='checkbox' />
              <div className='collapse-title font-semibold'>Order History</div>
              <div className='collapse-content'>
                <OrderLogTimeline logs={order.data.orderLogs} />
              </div>
            </div>
            <h3 className='text-xl font-semibold mt-4'>Order Summary</h3>
            <div className='flex flex-col items-end gap-2'>
              <div className='flex justify-between gap-4'>
                <div>Subtotal:</div>
                <div>{formatCurrency(order.data.totalAmount)}</div>
              </div>
              <div className='flex justify-between gap-4'>
                <div>Shipping fee:</div>
                <div>{formatCurrency(order.data.shippingFee)}</div>
              </div>
              <div className='flex justify-between gap-4'>
                <div>Discount:</div>
                <div>{formatCurrency(order.data.discount)}</div>
              </div>
              <Divider />
              <div className='flex justify-between font-bold gap-4'>
                <div>Total:</div>
                <div>
                  {formatCurrency(
                    order.data.totalAmount -
                      order.data.discount +
                      order.data.shippingFee
                  )}
                </div>
              </div>
            </div>
            <div className='flex flex-row justify-end  gap-2'>
              {order?.data.orderStatus === ORDER_STATUS.PENDING && (
                <div className='flex justify-end mt-4'>
                  <button
                    onClick={handleCancelOrder}
                    className='btn btn-ghost border-gray-300 text-gray-500 btn-sm'
                    disabled={isCanceling}
                  >
                    <MdOutlineCancel className='text-2xl' /> Cancel Order
                  </button>
                </div>
              )}
              {order?.data.orderStatus === ORDER_STATUS.PENDING &&
                order?.data.paymentMethod === 'paypal' &&
                order?.data.paymentStatus === 'pending' && (
                  <div className='flex justify-end mt-4'>
                    <button
                      className='btn btn-primary btn-sm text-white'
                      onClick={() => setOpenModalRetryPayment(true)}
                    >
                      Retry Payment
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <ModalUserReview
        open={openModalReview}
        onClose={() => setOpenModalReview(false)}
        orderItemId={selectedOrderItem?.id || 0}
        productId={selectedOrderItem?.productId || 0}
        refetch={refetch}
      />
      <ModalRetryPayment
        open={openModalRetryPayment}
        onClose={() => setOpenModalRetryPayment(false)}
        orderCode={orderCode || ''}
        refetch={refetch}
      />
    </>
  )
}

export { UserOrderDetail }

const initialOptions = {
  clientId:
    'AerBDGpkuUbN1vbkY2jB3PmxmP8ijXS0D8qnWEzcpvaZEtTg7bAp_qEt52BRkXnFav1z7pA_cGl8Cp6F',
}

const ModalRetryPayment: React.FC<{
  open: boolean
  onClose: () => void
  orderCode: string
  refetch: () => void
}> = ({ open, onClose, orderCode, refetch }) => {
  const [retryPayment, { isLoading: isRetryPaymentLoading }] =
    useRetryPaymentMutation()
  const [verifyPaypalOrder, { isLoading: isVerifying }] =
    usePaypalVerifyOrderMutation()

  const onCreateOrder = async (_: any, actions: any) => {
    try {
      const res = await retryPayment(orderCode).unwrap()
      return res.paymentOrderID
    } catch (error: any) {
      showToast.error(error.data.message || 'Something went wrong')
      actions.reject()
    }
  }
  const onApprove = async (_: any, actions: any) => {
    try {
      const capture = await actions.order.capture()
      const res = await verifyPaypalOrder({
        paypalOrderID: capture.id,
        orderCode: orderCode,
      }).unwrap()
      showToast.success(res.message || 'Order completed')
      setTimeout(() => {
        onClose()
        refetch()
      }, 2000)
    } catch (error: any) {
      showToast.error(error.data.message || 'Something went wrong')
      actions.reject()
    }
  }
  const onCancel = (_: any, actions: any) => {
    showToast.error('Payment cancelled')
    actions.reject()
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null}>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>Retry Payment</h3>
        <p>Are you sure you want to retry payment for this order?</p>
        <div className='flex w-full gap-2 mt-4'>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={onCreateOrder}
              onApprove={onApprove}
              onCancel={onCancel}
              disabled={isRetryPaymentLoading || isVerifying}
              forceReRender={[orderCode]}
              className='w-full'
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </Modal>
  )
}
