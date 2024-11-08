import React, { useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  message,
} from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Batch, BatchProduct, Product } from '@/types'
import {
  useCreateBatchMutation,
  useGetAllBatchQuery,
  useGetAllProductWithoutPaginationQuery,
  useUpdateBatchMutation,
} from '@/services'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { showToast } from '@/components'
import { stringToDate } from '@/utils'

const { Option } = Select

const VITE_DATE_FORMAT_API = import.meta.env.VITE_DATE_FORMAT_API

const AdminBatch: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { data: batches, isLoading: isLoadingBatch } = useGetAllBatchQuery()
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation()
  const [editBatch, setEditBatch] = useState<Batch | null>(null)
  const [batchProducts, setBatchProducts] = useState<BatchProduct[]>([])

  const { data: products } = useGetAllProductWithoutPaginationQuery()
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation()

  const handleAddBatch = () => {
    setBatchProducts([])
    setEditBatch(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (!batchProducts.length) {
      showToast.error('Batch Product is required')
      return
    }
    const newBatch: Batch = {
      code: values.code,
      arrivalDate: dayjs(values.arrivalDate).format(VITE_DATE_FORMAT_API),
      batchProducts: batchProducts.map((item) => ({
        productId: item.productId,
        initialQuantity: item.initialQuantity,
        expiredDate: item.expiredDate,
        price: item.price,
      })),
    } as Batch

    try {
      if (editBatch) {
        const updatedBatch = {
          arrivalDate: newBatch.arrivalDate,
          id: editBatch.id,
          batchProducts: newBatch.batchProducts,
        }
        await updateBatch(updatedBatch).unwrap()
        message.success('Batch updated successfully')
      } else {
        await createBatch(newBatch).unwrap()
        message.success('Batch created successfully')
      }
      setIsModalVisible(false)
      form.resetFields()
      setBatchProducts([])
      setEditBatch(null)
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to save batch')
    }
  }

  const handleEditBatch = (batch: Batch) => {
    form.setFieldsValue({
      code: batch.code,
      arrivalDate: dayjs(batch.arrivalDate, VITE_DATE_FORMAT_API),
    })
    setEditBatch(batch)
    setBatchProducts(batch.batchProducts)
    setIsModalVisible(true)
  }

  const handleDeleteBatch = (id: number) => {
    console.log(id)
  }

  const handleViewBatch = (id: number) => {
    console.log(id)
  }

  const handleAddBatchProduct = (product: Product | undefined) => {
    if (product) {
      const findProduct = batchProducts.find(
        (item) => item.productId === product.id
      )
      if (findProduct) {
        showToast.error('Product already exists')
        return
      }
      const newBatchProduct: BatchProduct = {
        productId: product.id,
        initialQuantity: 0,
        price: 0,
        expiredDate: '',
        product: product,
      } as BatchProduct
      setBatchProducts([...batchProducts, newBatchProduct])
    }
  }

  const handleDeleteBatchProduct = (index: number) => {
    const updatedBatchProducts = batchProducts.filter((_, i) => i !== index)
    setBatchProducts(updatedBatchProducts)
  }

  const handleEditBatchProduct = (key: number, field: string, value: any) => {
    const updatedBatchProducts = batchProducts.map((item, index) => {
      if (index === key) {
        return { ...item, [field]: value }
      }
      return item
    })
    setBatchProducts(updatedBatchProducts)
  }

  const batchColumns: ColumnsType<Batch> = [
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: 'Arrival Date',
      dataIndex: 'arrivalDate',
      render: (text: string) => stringToDate(text),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
    },
    {
      title: 'Action',
      render: (text: string, record: Batch) => (
        <div className='flex flex-row items-center gap-2'>
          <button
            onClick={() => handleViewBatch(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EyeOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleEditBatch(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleDeleteBatch(record.id)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  const batchProductColumns: ColumnsType<BatchProduct> = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (text: Product) => text.name,
    },
    {
      title: 'Barcode',
      dataIndex: 'product.barcode',
      render: (text: string, record: BatchProduct) => record.product?.barcode,
    },
    {
      title: 'Initial Quantity',
      dataIndex: 'initialQuantity',
      render: (text: number, record: BatchProduct, index: number) => (
        <Form.Item
          rules={[
            { required: true, message: 'Initial Quantity is required' },
            {
              validator: (_, value) => {
                if (value < 1) {
                  return Promise.reject('Must be greater than 0')
                }
                return Promise.resolve()
              },
            },
          ]}
          className=' my-auto'
        >
          <Input
            type='number'
            value={text}
            onChange={(e) =>
              handleEditBatchProduct(
                index,
                'initialQuantity',
                Number(e.target.value)
              )
            }
            className='w-full'
          />
        </Form.Item>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text: number, record: BatchProduct, index: number) => (
        <Form.Item
          rules={[
            { required: true, message: 'Price is required' },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject('Must be greater than 0')
                }
                return Promise.resolve()
              },
            },
          ]}
          className=' my-auto'
        >
          <Input
            type='number'
            value={text}
            onChange={(e) =>
              handleEditBatchProduct(index, 'price', Number(e.target.value))
            }
          />
        </Form.Item>
      ),
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      render: (text: string, record: BatchProduct, index: number) => (
        <Form.Item
          rules={[{ required: true, message: 'Expired Date is required' }]}
          className=' my-auto'
        >
          <DatePicker
            format={'DD-MM-YYYY'}
            value={text ? dayjs(text, VITE_DATE_FORMAT_API) : null}
            onChange={(date) =>
              handleEditBatchProduct(
                index,
                'expiredDate',
                date ? date.format(VITE_DATE_FORMAT_API) : ''
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      render: (text: string, record: BatchProduct, index: number) => (
        <Button onClick={() => handleDeleteBatchProduct(index)}>Delete</Button>
      ),
    },
  ]

  return (
    <div className='bg-white w-full'>
      <Button onClick={handleAddBatch}>Add Batch</Button>
      <Table
        dataSource={batches?.data}
        columns={batchColumns}
        rowKey='id'
        pagination={false}
        className='mt-5'
        scroll={{ y: 'calc(100vh - 300px)', x: 'calc(100vw - 20px)' }}
      />
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
        centered
      >
        <h1 className='text-2xl font-bold text-primary mb-7'>
          {editBatch ? 'Edit Batch' : 'Create Batch'}
        </h1>
        <Form form={form} layout='vertical'>
          {!editBatch && (
            <Form.Item
              label='Code'
              name='code'
              rules={[{ required: true, message: 'Code is required' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label='Arrival Date'
            name='arrivalDate'
            rules={[{ required: true, message: 'Arrival Date is required' }]}
            getValueProps={(value) => {
              return {
                value: value ? dayjs(value, VITE_DATE_FORMAT_API) : null,
              }
            }}
          >
            <DatePicker format={'DD-MM-YYYY'} className='w-full' />
          </Form.Item>
          <Form.Item label='Select Product'>
            <Select
              onChange={(value) => {
                const product = products?.data?.find((p) => p.id === value)
                handleAddBatchProduct(product)
              }}
              placeholder='Select a product'
              className='w-full'
              filterOption={(input, option) => {
                return (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toString().toLowerCase())
              }}
              value={null}
              showSearch
            >
              {products?.data?.map((product) => (
                <Option
                  key={product.id}
                  value={product.id}
                  label={product.name}
                >
                  <div className='flex flex-row items-center justify-between gap-2 px-3'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className=' h-8 w-8 object-cover'
                      />
                      <p>{product.name}</p>
                    </div>
                    <p>{product.barcode}</p>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Table
            dataSource={batchProducts}
            columns={batchProductColumns}
            rowKey={(record) => record.productId}
            pagination={false}
            scroll={{ y: 250 }}
          />
          <div className='flex flex-row justify-end gap-2 mt-5'>
            <Button
              className=' bg-primary text-white'
              onClick={handleModalOk}
              disabled={isUpdating || isCreating}
              loading={isUpdating || isCreating}
            >
              {isUpdating || isCreating ? 'Loading...' : 'Save'}
            </Button>
            <Button className='' onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export { AdminBatch }
