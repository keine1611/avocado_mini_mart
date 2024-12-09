import React, { useState, useRef, useMemo } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Order, OrderItem } from '@/types'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/services'
import { EditOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import {
  formatCurrency,
  formatPhoneNumber,
  getLocation,
  stringToDate,
  stringToDateTime,
} from '@/utils'
import {
  FaBan,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaHourglassStart,
  FaShippingFast,
} from 'react-icons/fa'
import {
  SHIPPING_METHOD,
  PAYMENT_METHOD,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from '@/enum'
import {
  MdPendingActions,
  MdDeliveryDining,
  MdOutlineCancelPresentation,
  MdCreditCard,
  MdCheckCircle,
} from 'react-icons/md'
import {
  UserOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { IoCashOutline } from 'react-icons/io5'
import { Loading, showToast } from '@/components'
import { OrderLog } from '@/types/OrderLog'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const { VITE_DATE_FORMAT_API } = import.meta.env

const AdminCheckOrder: React.FC = () => {
  const [form] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalDescriptionInvisible, setModalDescriptionInvisible] =
    useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const {
    data,
    isLoading,
    isFetching: isFetchingOrders,
  } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation()
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const searchInput = useRef<typeof Input | null>(null)

  const getColumnSearchProps = (
    dataIndex: string,
    isSelect: boolean = false,
    options: {
      label: string
      value: string
      render: () => React.ReactNode
    }[] = []
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        {isSelect ? (
          <Select
            showSearch
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            placeholder={`Select ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onSearch={(value) => setSelectedKeys(value ? [value] : [])}
            filterOption={(input, option) => {
              if (option && option.label) {
                return option.label
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              return false
            }}
          >
            {options.map((option) => (
              <Select.Option
                key={option.value}
                label={option.label}
                value={option.value}
              >
                {option.render()}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Input
            ref={(node) => {
              searchInput.current = node as any
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Button
          type='primary'
          onClick={() => handleSearch(confirm)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      isSelect
        ? record[dataIndex] === value
        : record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.current && 'select' in searchInput.current) {
            ;(searchInput.current as any).select()
          }
        }, 100)
      }
    },
  })

  const handleSearch = (confirm: () => void) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    form.setFieldsValue(order)
    setIsModalVisible(true)
  }
  const renderOrderStatusTag = (status: ORDER_STATUS) => {
    if (status === ORDER_STATUS.PENDING) {
      return (
        <Tag color='yellow' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.SHIPPING) {
      return (
        <Tag color='lime' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.DELIVERED) {
      return (
        <Tag color='green' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.CANCELLED) {
      return (
        <Tag color='red' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.CONFIRMED) {
      return (
        <Tag color='green' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.REJECTED) {
      return (
        <Tag color='orange' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === ORDER_STATUS.RETURNED) {
      return (
        <Tag color='purple' className='uppercase'>
          {status}
        </Tag>
      )
    }
  }

  const columns: ColumnsType<Order> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (_, record: Order) => (
        <span>{stringToDateTime(record.createdAt)}</span>
      ),
      sorter: (a, b) => Number(a.createdAt) - Number(b.createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, record: Order) => (
        <span>{stringToDateTime(record.updatedAt)}</span>
      ),
      sorter: (a, b) => Number(a.updatedAt) - Number(b.updatedAt),
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      ellipsis: true,
      ...getColumnSearchProps(
        'orderStatus',
        true,
        Object.values(ORDER_STATUS).map((status) => ({
          label: status,
          value: status,
          render: () => {
            if (status === ORDER_STATUS.PENDING) {
              return (
                <Tag color='yellow' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.SHIPPING) {
              return (
                <Tag color='orange' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.DELIVERED) {
              return (
                <Tag color='green' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.CANCELLED) {
              return (
                <Tag color='red' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.CONFIRMED) {
              return (
                <Tag color='green' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.REJECTED) {
              return (
                <Tag color='orange' className='uppercase'>
                  {status}
                </Tag>
              )
            } else if (status === ORDER_STATUS.RETURNED) {
              return (
                <Tag color='purple' className='uppercase'>
                  {status}
                </Tag>
              )
            }
          },
        }))
      ),
      render: (_, record: Order) => {
        if (record.orderStatus === ORDER_STATUS.PENDING) {
          return (
            <Tag
              icon={<MdPendingActions />}
              color='yellow'
              className='uppercase'
            >
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.SHIPPING) {
          return (
            <Tag icon={<MdPendingActions />} color='lime' className='uppercase'>
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.REJECTED) {
          return (
            <Tag icon={<FaShippingFast />} color='orange' className='uppercase'>
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.DELIVERED) {
          return (
            <Tag
              icon={<MdDeliveryDining />}
              color='green'
              className='uppercase'
            >
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.CANCELLED) {
          return (
            <Tag
              icon={<MdOutlineCancelPresentation />}
              color='red'
              className='uppercase'
            >
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.CONFIRMED) {
          return (
            <Tag icon={<MdCheckCircle />} color='green' className='uppercase'>
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.RETURNED) {
          return (
            <Tag icon={<FaBan />} color='purple' className='uppercase'>
              {record.orderStatus}
            </Tag>
          )
        }
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      ellipsis: true,
      render: (_, record: Order) => {
        if (record.paymentMethod === PAYMENT_METHOD.COD) {
          return (
            <Tag icon={<IoCashOutline />} color='red' className='uppercase'>
              {record.paymentMethod}
            </Tag>
          )
        }
        return (
          <Tag icon={<MdCreditCard />} color='green' className='uppercase'>
            {record.paymentMethod}
          </Tag>
        )
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      ellipsis: true,
      render: (_, record: Order) => {
        if (record.paymentStatus === PAYMENT_STATUS.PENDING) {
          return (
            <Tag color='red' className='uppercase'>
              {record.paymentStatus}
            </Tag>
          )
        } else if (record.paymentStatus === PAYMENT_STATUS.PAID) {
          return (
            <Tag color='green' className='uppercase'>
              {record.paymentStatus}
            </Tag>
          )
        } else if (record.paymentStatus === PAYMENT_STATUS.REFUNDED) {
          return (
            <Tag color='purple' className='uppercase'>
              {record.paymentStatus}
            </Tag>
          )
        } else if (record.paymentStatus === PAYMENT_STATUS.FAILED) {
          return (
            <Tag color='red' className='uppercase'>
              {record.paymentStatus}
            </Tag>
          )
        }
      },
    },
    {
      title: 'Shipping Method',
      dataIndex: 'shippingMethod',
      key: 'shippingMethod',
      ellipsis: true,
      render: (_, record: Order) => {
        if (record.shippingMethod === SHIPPING_METHOD.EXPRESS) {
          return (
            <Tag color='blue' className='uppercase'>
              {record.shippingMethod}
            </Tag>
          )
        } else {
          return (
            <Tag color='green' className='uppercase'>
              {record.shippingMethod}
            </Tag>
          )
        }
      },
    },

    {
      title: 'Actions',
      key: 'actions',
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation()
        },
      }),
      render: (_, record: Order) => (
        <div className='flex space-x-2'>
          <Button
            icon={<FaEye />}
            onClick={() => handleView(record)}
            className=' hover:text-primary '
          />
          {(record.orderStatus === ORDER_STATUS.PENDING ||
            record.orderStatus === ORDER_STATUS.CONFIRMED ||
            record.orderStatus === ORDER_STATUS.SHIPPING) && (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          )}
        </div>
      ),
    },
  ]

  const handleView = (order: Order) => {
    setViewOrder(order)
    setModalDescriptionInvisible(true)
  }

  const handleUpdateOrderStatus = async (
    orderCode: string,
    orderStatus: ORDER_STATUS
  ) => {
    try {
      if (orderCode && orderStatus) {
        await updateOrderStatus({ orderCode, orderStatus }).unwrap()
        showToast.success('Update order status successfully')
        setIsModalVisible(false)
      }
    } catch (err: any) {
      showToast.error(err.data?.message || 'Failed to update order status')
    }
  }

  const renderPaymentStatusTag = (status: PAYMENT_STATUS) => {
    if (status === PAYMENT_STATUS.PENDING) {
      return (
        <Tag color='red' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === PAYMENT_STATUS.PAID) {
      return (
        <Tag color='green' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === PAYMENT_STATUS.REFUNDED) {
      return (
        <Tag color='purple' className='uppercase'>
          {status}
        </Tag>
      )
    } else if (status === PAYMENT_STATUS.FAILED) {
      return (
        <Tag color='red' className='uppercase'>
          {status}
        </Tag>
      )
    }
  }

  const renderPaymentMethodTag = (method: PAYMENT_METHOD) => {
    if (method === PAYMENT_METHOD.COD) {
      return (
        <Tag color='red' className='uppercase'>
          {method}
        </Tag>
      )
    }
    return (
      <Tag color='green' className='uppercase'>
        {method}
      </Tag>
    )
  }

  const renderShippingMethodTag = (method: SHIPPING_METHOD) => {
    if (method === SHIPPING_METHOD.EXPRESS) {
      return (
        <Tag color='blue' className='uppercase'>
          {method}
        </Tag>
      )
    }
    return (
      <Tag color='green' className='uppercase'>
        {method}
      </Tag>
    )
  }

  const getAvailableStatuses = (currentStatus: ORDER_STATUS) => {
    switch (currentStatus) {
      case ORDER_STATUS.PENDING:
        return [ORDER_STATUS.CONFIRMED, ORDER_STATUS.REJECTED]
      case ORDER_STATUS.CONFIRMED:
        return [ORDER_STATUS.SHIPPING]
      case ORDER_STATUS.SHIPPING:
        return [ORDER_STATUS.DELIVERED, ORDER_STATUS.RETURNED]
      default:
        return []
    }
  }
  const [
    modalOrderItemBatchDetailVisible,
    setModalOrderItemBatchDetailVisible,
  ] = useState(false)
  const [viewOrderItem, setViewOrderItem] = useState<OrderItem | null>(null)

  const handleViewOrderItemBatchDetail = (orderItem: OrderItem) => {
    setModalOrderItemBatchDetailVisible(true)
    setViewOrderItem(orderItem)
  }

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <OrderStatistics orders={data?.data || []} />
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading || isFetchingOrders}
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: '', y: 'calc(100vh - 300px)' }}
        onRow={(record) => ({
          onClick: () => handleView(record),
        })}
      />
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div className='w-full p-5'>
          <Form form={formEdit} layout='vertical'>
            <Form.Item
              name='orderStatus'
              label='Order Status'
              rules={[{ required: true }]}
            >
              <Select>
                {getAvailableStatuses(
                  editingOrder?.orderStatus as ORDER_STATUS
                ).map((status) => (
                  <Select.Option
                    key={status}
                    value={status}
                    className='capitalize'
                  >
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>

          <div className='flex justify-end mt-4'>
            <button
              className='btn btn-primary min-w-[100px] btn-sm text-white'
              onClick={() =>
                handleUpdateOrderStatus(
                  editingOrder?.code || '',
                  formEdit.getFieldValue('orderStatus')
                )
              }
            >
              {isUpdatingStatus ? (
                <Loading size='loading-sm' text-color='text-white' />
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={modalDescriptionInvisible}
        onCancel={() => setModalDescriptionInvisible(false)}
        footer={null}
        centered
        width={1200}
      >
        <div className='p-4 mt-6 max-h-[calc(100vh-100px)] overflow-y-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-primary'>
              Order #{viewOrder?.code}
            </h1>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-500'>Order Date</p>
                <p className='font-semibold'>
                  {stringToDate(viewOrder?.createdAt || '')}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-gray-500'>Last Updated</p>
                <p className='font-semibold'>
                  {stringToDateTime(viewOrder?.updatedAt || '')}
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            {/* Customer Information */}
            <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
              <div className='flex items-center gap-2 mb-4'>
                <UserOutlined className='text-xl text-primary' />
                <h2 className='text-xl font-semibold'>Customer Information</h2>
              </div>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>Full Name</p>
                  <p className='font-medium'>{viewOrder?.fullName}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <p className='font-medium'>{viewOrder?.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Phone</p>
                  <p className='font-medium'>
                    {formatPhoneNumber(viewOrder?.phone || '')}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Address</p>
                  <p className='font-medium'>
                    {viewOrder?.address},{' '}
                    {getLocation(
                      viewOrder?.provinceCode || '',
                      viewOrder?.districtCode || '',
                      viewOrder?.wardCode || ''
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
              <div className='flex items-center gap-2 mb-4'>
                <ShoppingOutlined className='text-xl text-primary' />
                <h2 className='text-xl font-semibold'>Order Status</h2>
              </div>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>Order Status</p>
                  <div className='mt-1'>
                    {renderOrderStatusTag(
                      viewOrder?.orderStatus as ORDER_STATUS
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Payment Status</p>
                  <div className='mt-1'>
                    {renderPaymentStatusTag(
                      viewOrder?.paymentStatus as PAYMENT_STATUS
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Payment Method</p>
                  <div className='mt-1'>
                    {renderPaymentMethodTag(
                      viewOrder?.paymentMethod as PAYMENT_METHOD
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Shipping Method</p>
                  <div className='mt-1'>
                    {renderShippingMethodTag(
                      viewOrder?.shippingMethod as SHIPPING_METHOD
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
              <div className='flex items-center gap-2 mb-4'>
                <DollarOutlined className='text-xl text-primary' />
                <h2 className='text-xl font-semibold'>Order Summary</h2>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <p className='text-gray-500'>Subtotal</p>
                  <p className='font-medium'>
                    {formatCurrency(viewOrder?.totalAmount || 0)}
                  </p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-gray-500'>Shipping Fee</p>
                  <p className='font-medium'>
                    {formatCurrency(viewOrder?.shippingFee || 0)}
                  </p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-gray-500'>Discount</p>
                  <p className='font-medium text-red-500'>
                    -{formatCurrency(viewOrder?.discount || 0)}
                  </p>
                </div>
                <div className='border-t pt-2 mt-2'>
                  <div className='flex justify-between'>
                    <p className='font-semibold'>Total</p>
                    <p className='font-bold text-primary text-xl'>
                      {formatCurrency(
                        (viewOrder?.totalAmount || 0) +
                          (viewOrder?.shippingFee || 0) -
                          (viewOrder?.discount || 0)
                      )}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between mt-2 border-t pt-2'>
                  <p className='text-gray-500'>Total Cost</p>
                  <p className='font-medium'>
                    {formatCurrency(viewOrder?.totalCost || 0)}
                  </p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-gray-500'>Profit</p>
                  <p
                    className={`font-medium ${
                      viewOrder?.profit && viewOrder?.profit > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {formatCurrency(viewOrder?.profit || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
            <div className='flex items-center gap-2 mb-4'>
              <ShoppingCartOutlined className='text-xl text-primary' />
              <h2 className='text-xl font-semibold'>Order Items</h2>
            </div>
            <Table
              dataSource={viewOrder?.orderItems}
              rowKey='id'
              pagination={false}
              columns={[
                {
                  title: 'Product',
                  key: 'product',
                  render: (_, record) => (
                    <div className='flex items-center gap-3'>
                      <img
                        src={record.product.mainImage}
                        alt={record.product.name}
                        className='w-16 h-16 object-cover rounded-md border border-gray-200'
                      />
                      <div>
                        <p className='font-medium'>{record.product.name}</p>
                        <p className='text-sm text-gray-500'>
                          {record.product.barcode}
                        </p>
                      </div>
                    </div>
                  ),
                },

                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price, record) => {
                    if (record.discount > 0) {
                      return (
                        <div className='flex items-center gap-2'>
                          <span className='text-red-500'>
                            {formatCurrency(
                              price * (1 - record.discount / 100) || 0
                            )}
                          </span>
                          <span className='line-through'>
                            {formatCurrency(price || 0)}
                          </span>
                        </div>
                      )
                    }
                    return formatCurrency(price || 0)
                  },
                  width: 100,
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: 100,
                  render: (quantity) => (
                    <Tag color='blue' className='px-3 py-1'>
                      x{quantity}
                    </Tag>
                  ),
                },
                {
                  title: 'Total',
                  key: 'total',
                  render: (_, record) => (
                    <span className='font-semibold'>
                      {formatCurrency(
                        record.price *
                          record.quantity *
                          (1 - record.discount / 100) || 0
                      )}
                    </span>
                  ),
                  width: 100,
                },
              ]}
              className='mt-4'
              scroll={{ x: '', y: 'calc(100vh - 400px)' }}
              onRow={(record) => ({
                onClick: () => handleViewOrderItemBatchDetail(record),
              })}
              key='orderItems'
            />
          </div>

          {/* Order Timeline */}
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6'>
            <div className='flex items-center gap-2 mb-4'>
              <HistoryOutlined className='text-xl text-primary' />
              <h2 className='text-xl font-semibold'>Order Timeline</h2>
            </div>
            <OrderLogTimeline logs={viewOrder?.orderLogs || []} />
          </div>
        </div>
      </Modal>
      <OrderItemBatchDetailModal
        visible={modalOrderItemBatchDetailVisible}
        orderItem={viewOrderItem}
        onClose={() => setModalOrderItemBatchDetailVisible(false)}
      />
    </div>
  )
}

interface OrderItemDetailModalProps {
  visible: boolean
  orderItem: OrderItem | null
  onClose: () => void
}

const OrderItemBatchDetailModal: React.FC<OrderItemDetailModalProps> = ({
  visible,
  orderItem,
  onClose,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      title={
        <div className='text-xl font-bold text-primary'>Product Details</div>
      }
    >
      <div className='p-6'>
        <div className='flex gap-6'>
          <img
            src={orderItem?.product?.mainImage}
            alt={orderItem?.product?.name}
            className='w-36 h-36 object-cover rounded-lg border border-gray-200'
          />
          <div className='flex-1'>
            <h3 className='text-xl font-semibold mb-2'>
              {orderItem?.product?.name}
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-gray-500'>Barcode</p>
                <p className='font-medium'>{orderItem?.product.barcode}</p>
              </div>
              <div>
                <p className='text-gray-500'>Price</p>
                <p className='font-medium'>
                  {formatCurrency(orderItem?.price || 0)}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Quantity</p>
                <p className='font-medium'>{orderItem?.quantity}</p>
              </div>
              <div>
                <p className='text-gray-500'>Discount</p>
                <p className='font-medium text-red-500'>
                  {orderItem?.discount}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <h4 className='text-lg font-semibold mb-3'>Batch Information</h4>
          <Table
            dataSource={orderItem?.orderItemBatches}
            pagination={false}
            rowKey='batchId'
            key='orderItemBatches'
            columns={[
              {
                title: 'Batch Code',
                dataIndex: ['batch', 'code'],
                key: 'batchCode',
                render: (_, record) => record.batch.code,
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
              },
              {
                title: 'Import Price / Unit',
                dataIndex: 'importPrice',
                key: 'importPrice',
                render: (_, record) =>
                  formatCurrency(record.batch.batchProducts[0].price),
              },
              {
                title: 'Expired Date',
                dataIndex: ['batch', 'expiredDate'],
                key: 'expiredDate',
                render: (_, record) =>
                  stringToDate(record.batch.batchProducts[0].expiredDate),
              },
            ]}
          />
        </div>
      </div>
    </Modal>
  )
}

interface OrderLogTimelineProps {
  logs: OrderLog[]
}

const OrderLogTimeline: React.FC<OrderLogTimelineProps> = ({ logs }) => {
  const getStatusIcon = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <FaHourglassStart className='text-primary' />
      case ORDER_STATUS.CONFIRMED:
        return <FaCheckCircle className='text-primary' />
      case ORDER_STATUS.SHIPPING:
        return <FaShippingFast className='text-primary' />
      case ORDER_STATUS.DELIVERED:
        return <FaBoxOpen className='text-primary' />
      case ORDER_STATUS.CANCELLED:
        return <FaTimesCircle className='text-red-500' />
      case ORDER_STATUS.REJECTED:
        return <FaBan className='text-red-500' />
      case ORDER_STATUS.RETURNED:
        return <FaBan className='text-red-500' />
      default:
        return null
    }
  }

  const getStatusText = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'Order is pending.'
      case ORDER_STATUS.CONFIRMED:
        return 'Order has been confirmed.'
      case ORDER_STATUS.SHIPPING:
        return 'Order is being shipped.'
      case ORDER_STATUS.DELIVERED:
        return 'Order has been delivered.'
      case ORDER_STATUS.CANCELLED:
        return 'Order has been cancelled.'
      case ORDER_STATUS.REJECTED:
        return 'Order was rejected.'
      case ORDER_STATUS.RETURNED:
        return 'Order was returned.'
      default:
        return 'Unknown status.'
    }
  }

  return (
    <div className='relative border-l-2 border-gray-200 pl-4'>
      {[...logs]
        .sort((a, b) =>
          dayjs(b.updatedAt, VITE_DATE_FORMAT_API).diff(
            dayjs(a.updatedAt, VITE_DATE_FORMAT_API)
          )
        )
        .map((log) => (
          <div key={log.id} className='mb-8 ml-4'>
            <div
              className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${
                log.status === ORDER_STATUS.CANCELLED ||
                log.status === ORDER_STATUS.REJECTED ||
                log.status === ORDER_STATUS.RETURNED
                  ? 'bg-red-500'
                  : 'bg-primary'
              }`}
            ></div>
            <div className='flex items-center justify-between mb-1'>
              <time className='text-sm font-normal leading-none text-gray-400'>
                {stringToDateTime(log.updatedAt)}
              </time>
              <span className='text-sm text-gray-500'>
                Updated by: {log.updatedBy}
              </span>
            </div>
            <div className='flex items-center'>
              {getStatusIcon(log.status as ORDER_STATUS)}
              <p className='text-md text-gray-900 ml-2'>
                {getStatusText(log.status as ORDER_STATUS)}
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}
export { AdminCheckOrder }
interface OrderStatisticsProps {
  orders: Order[]
}

export const OrderStatistics: React.FC<OrderStatisticsProps> = ({ orders }) => {
  const statistics = useMemo(() => {
    if (!orders) {
      return {
        totalOrders: 0,
        orderedItems: 0,
        returns: 0,
        fulfilledOrders: 0,
        deliveredOrders: 0,
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return {
      // Orders created today
      totalOrders: orders.filter((order) =>
        dayjs(order.createdAt, VITE_DATE_FORMAT_API).isSame(today, 'day')
      ).length,

      // Total items ordered across all orders
      orderedItems: orders.reduce(
        (acc, order) =>
          acc + order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        0
      ),

      // Pending orders
      pendingOrders: orders.filter(
        (order) => order.orderStatus === ORDER_STATUS.PENDING
      ).length,

      fulfilledOrders: orders.filter(
        (order) =>
          order.orderStatus === ORDER_STATUS.CONFIRMED ||
          order.orderStatus === ORDER_STATUS.SHIPPING
      ).length,

      // Delivered orders
      deliveredOrders: orders.filter(
        (order) => order.orderStatus === ORDER_STATUS.DELIVERED
      ).length,
    }
  }, [orders])

  return (
    <div className='bg-white rounded-xl shadow-sm p-4 mb-2 border border-gray-100'>
      <div className='grid grid-cols-5 gap-4'>
        <div className='flex flex-col items-center border-r border-gray-100'>
          <span className='text-gray-600 text-sm'>Total orders</span>
          <span className='text-2xl font-bold text-primary'>
            {statistics.totalOrders}
          </span>
          <span className='text-xs text-gray-500'>Today</span>
        </div>

        <div className='flex flex-col items-center border-r border-gray-100'>
          <span className='text-gray-600 text-sm'>Ordered items over time</span>
          <span className='text-2xl font-bold text-primary'>
            {statistics.orderedItems}
          </span>
        </div>

        <div className='flex flex-col items-center border-r border-gray-100'>
          <span className='text-gray-600 text-sm'>Pending orders</span>
          <span className='text-2xl font-bold text-yellow-500'>
            {statistics.pendingOrders}
          </span>
        </div>

        <div className='flex flex-col items-center border-r border-gray-100'>
          <span className='text-gray-600 text-sm'>
            Fulfilled orders over time
          </span>
          <span className='text-2xl font-bold text-green-500'>
            {statistics.fulfilledOrders}
          </span>
        </div>

        <div className='flex flex-col items-center border-r border-gray-100'>
          <span className='text-gray-600 text-sm'>
            Delivered orders over time
          </span>
          <span className='text-2xl font-bold text-blue-500'>
            {statistics.deliveredOrders}
          </span>
        </div>
      </div>
    </div>
  )
}
