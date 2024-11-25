import React, { useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Tag, Select } from 'antd'
import { Order } from '@/types'
import {
  useGetOrdersQuery,
  useCreateOrderMutation,
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

const AdminOrder: React.FC = () => {
  const [form] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalDescriptionInvisible, setModalDescriptionInvisible] =
    useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const { data, error, isLoading } = useGetOrdersQuery()
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()
  const [viewOrder, setViewOrder] = useState<Order | null>(null)

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    form.setFieldsValue(order)
    setIsModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        // try {
        //   await deleteOrder(id).unwrap()
        //   message.success('Order deleted successfully')
        // } catch (err: any) {
        //   message.error(err.data?.message || 'Failed to delete order')
        // }
      },
    })
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
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record: Order) => (
        <span>{formatPhoneNumber(record.phone)}</span>
      ),
      ellipsis: true,
    },

    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      ellipsis: true,
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
        } else if (record.orderStatus === ORDER_STATUS.CONFIRMED) {
          return (
            <Tag icon={<MdPendingActions />} color='lime' className='uppercase'>
              {record.orderStatus}
            </Tag>
          )
        } else if (record.orderStatus === ORDER_STATUS.SHIPPED) {
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
          <Button
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record.id)}
            danger
          />
        </div>
      ),
    },
  ]

  const handleView = (order: Order) => {
    setViewOrder(order)
    setModalDescriptionInvisible(true)
  }

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading}
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
              <Select options={enumToArray(ORDER_STATUS)} />
            </Form.Item>
          </Form>
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

export { AdminOrder }
