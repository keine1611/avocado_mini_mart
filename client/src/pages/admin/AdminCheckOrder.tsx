import React, { useState, useRef } from 'react'
import { Table, Button, Modal, Form, Input, message, Tag, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Order } from '@/types'
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation,
} from '@/services'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { enumToArray, formatCurrency, formatPhoneNumber } from '@/utils'
import { FaEye, FaShippingFast } from 'react-icons/fa'
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
import { IoCashOutline } from 'react-icons/io5'
import { Loading, showToast } from '@/components'

const AdminCheckOrder: React.FC = () => {
  const [form] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalDescriptionInvisible, setModalDescriptionInvisible] =
    useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const {
    data,
    error,
    isLoading,
    isFetching: isFetchingOrders,
  } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()
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
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Button
          type='primary'
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
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

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingOrder) {
          await updateOrder({ id: editingOrder.id, ...values }).unwrap()
          message.success('Order updated successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
      } catch (err: any) {
        message.error(err.data?.message || 'Failed to save order')
      }
    })
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
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record: Order) => (
        <span>{formatPhoneNumber(record.phone)}</span>
      ),
      ellipsis: true,
      ...getColumnSearchProps('phone'),
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
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
        setIsModalVisible(false)
        showToast.success('Update order status successfully')
      } else {
        showToast.error('Order code or order status is required')
      }
    } catch (err: any) {
      showToast.error(err.data?.message || 'Failed to update order status')
    }
  }

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
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
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div className='w-full p-5'>
          <Form form={formEdit} layout='vertical'>
            <Form.Item
              name='orderStatus'
              label='Order Status'
              rules={[{ required: true, message: 'Order Status is required' }]}
            >
              <Select>
                {editingOrder?.orderStatus === ORDER_STATUS.PENDING && (
                  <>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.CONFIRMED}
                    >
                      {ORDER_STATUS.CONFIRMED}
                    </Select.Option>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.REJECTED}
                    >
                      {ORDER_STATUS.REJECTED}
                    </Select.Option>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.CANCELLED}
                    >
                      {ORDER_STATUS.CANCELLED}
                    </Select.Option>
                  </>
                )}
                {editingOrder?.orderStatus === ORDER_STATUS.CONFIRMED && (
                  <>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.SHIPPING}
                    >
                      {ORDER_STATUS.SHIPPING}
                    </Select.Option>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.CANCELLED}
                    >
                      {ORDER_STATUS.CANCELLED}
                    </Select.Option>
                  </>
                )}
                {editingOrder?.orderStatus === ORDER_STATUS.SHIPPING && (
                  <>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.DELIVERED}
                    >
                      {ORDER_STATUS.DELIVERED}
                    </Select.Option>
                    <Select.Option
                      className='capitalize'
                      value={ORDER_STATUS.CANCELLED}
                    >
                      {ORDER_STATUS.CANCELLED}
                    </Select.Option>
                  </>
                )}
                {editingOrder?.orderStatus === ORDER_STATUS.REJECTED && <></>}
              </Select>
            </Form.Item>
          </Form>
          <div className='flex justify-end mt-4'>
            <button
              className='btn btn-primary min-w-[100px] btn-sm text-white'
              onClick={() =>
                handleUpdateOrderStatus(
                  editingOrder?.code || '',
                  formEdit.getFieldValue('orderStatus') || ORDER_STATUS.PENDING
                )
              }
            >
              {isUpdatingStatus ? <Loading size='small' /> : 'Update'}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={modalDescriptionInvisible}
        onCancel={() => setModalDescriptionInvisible(false)}
        footer={null}
        centered
        width={1000}
      >
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6 text-center text-primary'>
            Order Description
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className=' bg-base-200 p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Order Details</h2>
              <div className='space-y-2 pl-4'>
                <p>
                  <strong>Order Code:</strong> {viewOrder?.code}
                </p>
                <p>
                  <strong>Customer Name:</strong> {viewOrder?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {viewOrder?.email}
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  {formatPhoneNumber(viewOrder?.phone || '')}
                </p>
                <p>
                  <strong>Address:</strong> {viewOrder?.address}
                </p>
                <p className='capitalize'>
                  <strong>Order Status:</strong> {viewOrder?.orderStatus}
                </p>
              </div>
            </div>
            <div className=' bg-base-200 p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>
                Payment Information
              </h2>
              <div className='space-y-2 pl-4'>
                <p>
                  <strong>Payment Method:</strong> {viewOrder?.paymentMethod}
                </p>
                <p>
                  <strong>Payment Status:</strong> {viewOrder?.paymentStatus}
                </p>
                <p>
                  <strong>Shipping Method:</strong> {viewOrder?.shippingMethod}
                </p>
              </div>
            </div>
          </div>
          <h2 className='text-xl font-semibold mt-6'>Order Items</h2>
          <Table
            dataSource={viewOrder?.orderItems}
            rowKey='id'
            pagination={false}
            columns={[
              {
                title: 'Product',
                dataIndex: 'product.mainImage',
                key: 'image',
                render: (_, record) => (
                  <img
                    src={record.product.mainImage}
                    alt='Product'
                    className='w-10 h-10 object-cover'
                  />
                ),
              },
              {
                title: 'Product Name',
                dataIndex: 'product.name',
                key: 'productName',
                render: (_, record) => record.product.name,
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (text) => formatCurrency(text),
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
              },
            ]}
            className='mt-4'
            scroll={{ x: '100%', y: 'calc(100vh - 300px)' }}
          />
          <div className='flex justify-end mt-4'>
            <h2 className='text-xl font-semibold'></h2>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export { AdminCheckOrder }
