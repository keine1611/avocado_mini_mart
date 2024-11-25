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
  Upload,
} from 'antd'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Batch, BatchProduct, Product } from '@/types'
import {
  useCreateBatchMutation,
  useGetAllBatchQuery,
  useGetAllProductWithoutPaginationQuery,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} from '@/services'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { showToast } from '@/components'
import { formatCurrency, stringToDate } from '@/utils'
import * as xlsx from 'xlsx'

const { Option } = Select

const VITE_DATE_FORMAT_API = import.meta.env.VITE_DATE_FORMAT_API

const AdminBatch: React.FC = () => {
  const [form] = Form.useForm()
  const [formViewBatch] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const {
    data: batches,
    isLoading: isLoadingBatch,
    isFetching: isFetchingBatch,
  } = useGetAllBatchQuery()
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation()
  const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation()
  const [editBatch, setEditBatch] = useState<Batch | null>(null)
  const [batchProducts, setBatchProducts] = useState<BatchProduct[]>([])
  const [isViewBatchVisible, setIsViewBatchVisible] = useState(false)

  const { data: products, isLoading: isLoadingProduct } =
    useGetAllProductWithoutPaginationQuery()
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
      batchProducts: batchProducts.map((item) => {
        if (editBatch) {
          return {
            productId: item.productId,
            quantity: item.quantity,
            initialQuantity: item.initialQuantity,
            expiredDate: item.expiredDate,
            price: item.price,
          }
        }
        return {
          productId: item.productId,
          initialQuantity: item.initialQuantity,
          expiredDate: item.expiredDate,
          price: item.price,
        }
      }),
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
    batch.batchProducts.forEach((item) => {
      form.setFieldValue(
        `initialQuantity_${item.productId}`,
        item.initialQuantity
      )
      form.setFieldValue(`quantity_${item.productId}`, item.quantity)
      form.setFieldValue(`price_${item.productId}`, item.price)
      form.setFieldValue(
        `expiredDate_${item.productId}`,
        dayjs(item.expiredDate, VITE_DATE_FORMAT_API)
      )
    })
    setEditBatch(batch)
    setBatchProducts(batch.batchProducts)
    setIsModalVisible(true)
  }

  const handleDeleteBatch = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this batch?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteBatch(id).unwrap()
          message.success('Batch deleted successfully')
        } catch (error: any) {
          message.error(error.data?.message || 'Failed to delete batch')
        }
      },
    })
  }

  const handleViewBatch = (batch: Batch) => {
    setBatchProducts(batch.batchProducts)
    formViewBatch.setFieldsValue({
      code: batch.code,
      arrivalDate: dayjs(batch.arrivalDate, VITE_DATE_FORMAT_API),
    })
    setIsViewBatchVisible(true)
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

  const handleDeleteBatchProduct = (productId: number) => {
    form.setFieldValue(`initialQuantity_${productId}`, undefined)
    form.setFieldValue(`price_${productId}`, undefined)
    form.setFieldValue(`expiredDate_${productId}`, undefined)
    const updatedBatchProducts = batchProducts.filter(
      (item) => item.productId !== productId
    )
    setBatchProducts(updatedBatchProducts)
  }

  const handleEditBatchProduct = (key: number, field: string, value: any) => {
    const updatedBatchProducts = batchProducts.map((item) => {
      if (item.productId === key) {
        return { ...item, [field]: value }
      }
      return item
    })
    setBatchProducts(updatedBatchProducts)
  }

  const handleUploadExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = xlsx.read(data, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = xlsx.utils.sheet_to_json(worksheet)
      const batchProducts: (BatchProduct | null)[] = json.map((item: any) => {
        const product = products?.data?.find((p) => p.barcode == item.barcode)
        if (!product) {
          showToast.error('Product not found')
          return null
        }
        return {
          productId: product?.id,
          initialQuantity: item.initialQuantity,
          price: item.price,
          expiredDate: item.expiredDate.toString(),
          product: product,
        } as BatchProduct
      })
      setBatchProducts(batchProducts.filter((item) => item !== null))
    }
    reader.readAsArrayBuffer(file)
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
      width: 200,
    },
    {
      title: 'Barcode',
      dataIndex: 'product.barcode',
      render: (text: string, record: BatchProduct) => record.product?.barcode,
      width: 150,
    },
    ...(editBatch
      ? [
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: (text: number, record: BatchProduct) => (
              <Form.Item
                name={`quantity_${record.productId}`}
                rules={[
                  { required: true, message: 'Quantity is required' },
                  {
                    validator: (_, value) => {
                      if (value < 0) {
                        return Promise.reject('Quantity cannot be negative')
                      }
                      if (editBatch) {
                        const findProduct = batchProducts.find(
                          (item) => item.productId === record.productId
                        )
                        if (
                          findProduct &&
                          findProduct.initialQuantity < value
                        ) {
                          return Promise.reject(
                            'Quantity cannot be greater than Initial Quantity'
                          )
                        }
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
                className='my-auto'
              >
                <Input
                  type='number'
                  step='1'
                  value={text}
                  onChange={(e) =>
                    handleEditBatchProduct(
                      record.productId,
                      'quantity',
                      Number(e.target.value)
                    )
                  }
                  className='w-full'
                />
              </Form.Item>
            ),
          },
        ]
      : []),
    {
      title: 'Initial Quantity',
      dataIndex: 'initialQuantity',
      render: (text: number, record: BatchProduct) => (
        <Form.Item
          name={`initialQuantity_${record.productId}`}
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
          className='my-auto'
        >
          <Input
            type='number'
            step='1'
            value={text}
            onChange={(e) =>
              handleEditBatchProduct(
                record.productId,
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
      render: (text: number, record: BatchProduct) => (
        <Form.Item
          name={`price_${record.productId}`}
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
          className='my-auto'
        >
          <Input
            type='number'
            step='0.01'
            prefix='$'
            value={text}
            onChange={(e) =>
              handleEditBatchProduct(
                record.productId,
                'price',
                Number(e.target.value)
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      render: (text: string, record: BatchProduct) => (
        <Form.Item
          name={`expiredDate_${record.productId}`}
          rules={[{ required: true, message: 'Expired Date is required' }]}
          className='my-auto'
        >
          <DatePicker
            format={'DD-MM-YYYY'}
            value={text ? dayjs(text, VITE_DATE_FORMAT_API) : null}
            onChange={(date) =>
              handleEditBatchProduct(
                record.productId,
                'expiredDate',
                date ? date.format(VITE_DATE_FORMAT_API) : ''
              )
            }
          />
        </Form.Item>
      ),
      width: 160,
    },
    {
      title: 'Action',
      render: (text: string, record: BatchProduct) => (
        <Button onClick={() => handleDeleteBatchProduct(record.productId)}>
          Delete
        </Button>
      ),
    },
  ]

  const viewBatchProductColumns: ColumnsType<BatchProduct> = [
    {
      title: '',
      dataIndex: 'product.mainImage',
      render: (text: string, record: BatchProduct) => (
        <img
          src={record.product?.mainImage}
          alt={record.product?.name}
          className=' h-14 w-14 object-cover'
        />
      ),
      width: 50,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      render: (text: string, record: BatchProduct) => record.product?.name,
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      render: (text: string, record: BatchProduct) => record.product?.barcode,
      width: 150,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: 'Initial Quantity',
      dataIndex: 'initialQuantity',
      width: 100,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text: number) => formatCurrency(text),
      width: 100,
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      render: (text: string) => stringToDate(text),
      width: 150,
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
        loading={isLoadingBatch || isFetchingBatch || isLoadingProduct}
      />
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1200}
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
          <Form.Item label='Upload Excel File'>
            <Upload
              accept='.xlsx, .xls'
              beforeUpload={(file) => {
                handleUploadExcelFile(file)
                return false
              }}
              multiple={false}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
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
                    <p className='hidden md:block'>{product.barcode}</p>
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
            scroll={{ y: 250, x: 'fit-content' }}
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
      <Modal
        open={isViewBatchVisible}
        onCancel={() => setIsViewBatchVisible(false)}
        width={1000}
        footer={null}
        centered
      >
        <h1 className='text-2xl font-bold text-primary mb-7'>View Batch</h1>
        <Form form={formViewBatch} layout='vertical'>
          <Form.Item label='Code' name='code'>
            <Input readOnly />
          </Form.Item>

          <Form.Item
            label='Arrival Date'
            name='arrivalDate'
            getValueProps={(value) => {
              return {
                value: value ? stringToDate(value) : null,
              }
            }}
          >
            <Input readOnly />
          </Form.Item>
        </Form>
        <h2 className=' mb-5'>Batch Product</h2>
        <Table
          dataSource={batchProducts}
          columns={viewBatchProductColumns}
          rowKey={(record) => record.productId}
          pagination={false}
          scroll={{ y: 250, x: 'fit-content' }}
        />
      </Modal>
    </div>
  )
}

export { AdminBatch }
