import React, { useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd'
import { Order } from '@/types' // Assuming you have an Order type defined
import {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from '@/services'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

const AdminOrder: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const { data, error, isLoading } = useGetOrdersQuery()
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation()
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

  const handleCreate = () => {
    setEditingOrder(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    form.setFieldsValue(order)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      // // const response = await deleteOrder(id).unwrap()
      // message.success(response.message)
    } catch (err: any) {
      message.error(err.data?.message || 'Failed to delete order')
    }
  }

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => handleDelete(id),
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingOrder) {
          await updateOrder({ id: editingOrder.id, ...values }).unwrap()
          message.success('Order updated successfully')
        } else {
          await createOrder(values).unwrap()
          message.success('Order created successfully')
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
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: Order) => (
        <Tag color={record.orderStatus === 'pending' ? 'orange' : 'green'}>
          {record.orderStatus}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Order) => (
        <div className='flex space-x-2'>
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

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button
        icon={<PlusOutlined />}
        onClick={handleCreate}
        className='mb-4 bg-primary  text-white rounded-md hover:bg-primary/90 px-4 py-2'
      >
        Add Order
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading}
        className='bg-white shadow-md rounded-lg'
      />
      <Modal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='customerName'
            label='Customer Name'
            rules={[
              { required: true, message: 'Please input the customer name!' },
            ]}
          >
            <Input className='border border-gray-300 rounded-md' />
          </Form.Item>
          <Form.Item
            name='totalAmount'
            label='Total Amount'
            rules={[
              { required: true, message: 'Please input the total amount!' },
            ]}
          >
            <Input
              type='number'
              className='border border-gray-300 rounded-md'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              onClick={handleModalOk}
              loading={isCreating || isUpdating}
              className='bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              {editingOrder ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminOrder

export { AdminOrder }
