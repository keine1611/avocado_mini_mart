import {
  Button,
  Input,
  Modal,
  Table,
  Form,
  DatePicker,
  Select,
  Switch,
} from 'antd'
import React, { useState } from 'react'
import { Discount, Product, ProductDiscount } from '@/types'
import {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useGetAllProductWithoutPaginationQuery,
} from '@/services'
import { ColumnType } from 'antd/es/table/interface'
import { stringToDateTime } from '@/utils'
import { showToast } from '@/components'
import dayjs from 'dayjs'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { VITE_DATE_FORMAT_API, VITE_DATE_FORMAT_DISPLAY_TIME } = import.meta.env

const AdminDiscount: React.FC = () => {
  const [form] = Form.useForm()
  const {
    data,
    isLoading: isLoadingDiscounts,
    isFetching: isFetchingDiscounts,
  } = useGetDiscountsQuery()
  const { data: products } = useGetAllProductWithoutPaginationQuery()
  const [createDiscount, { isLoading: isLoadingCreateDiscount }] =
    useCreateDiscountMutation()
  const [updateDiscount, { isLoading: isLoadingUpdateDiscount }] =
    useUpdateDiscountMutation()
  const [deleteDiscount] = useDeleteDiscountMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [productDiscounts, setProductDiscounts] = useState<
    Pick<ProductDiscount, 'productId' | 'product' | 'discountPercentage'>[]
  >([])

  const columns: ColumnType<Discount>[] = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (_, record) => stringToDateTime(record.startDate),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (_, record) => stringToDateTime(record.endDate),
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      render: (_, record) => (record.isActive ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      width: 100,
      render: (_, record) => (
        <div className='flex flex-row items-center gap-2'>
          <button
            onClick={() => handleEditDiscount(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EyeOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleEditDiscount(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleDeleteDiscount(record.id)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  const productDiscountColumns: ColumnType<
    Pick<ProductDiscount, 'productId' | 'product' | 'discountPercentage'>
  >[] = [
    {
      title: '',
      width: 100,
      key: 'image',
      render: (_, record) => (
        <div className='flex items-center justify-center'>
          <img
            src={record.product.mainImage}
            alt={record.product.name}
            className='w-16 h-16 object-cover'
          />
        </div>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'productId',
      render: (_, record) => record.product.name,
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      render: (_, record) => record.product.barcode,
      width: 220,
    },
    {
      title: 'Discount Percentage (%)',
      dataIndex: 'discountPercentage',
      width: 220,
      render: (
        text: number,
        record: Pick<
          ProductDiscount,
          'productId' | 'discountPercentage' | 'product'
        >
      ) => (
        <Form.Item
          name={`discountPercentage_${record.productId}`}
          rules={[
            { required: true, message: 'Discount Percentage is required' },
            {
              validator: (_, value) => {
                if (value === undefined) {
                  return Promise.reject('Discount Percentage is required')
                }
                if (!Number.isInteger(Number(value))) {
                  return Promise.reject('Must be an integer')
                }
                if (value < 0) {
                  return Promise.reject('Must be greater than 0')
                }
                if (value > 100) {
                  return Promise.reject('Must be less than 100')
                }
                return Promise.resolve()
              },
            },
          ]}
          className=' my-auto'
        >
          <Input
            type='number'
            step='1'
            prefix='%'
            value={text}
            onChange={(e) =>
              handleEditProductDiscount(
                record.productId,
                'discountPercentage',
                Number(e.target.value)
              )
            }
            className='w-full'
            placeholder='Discount Percentage'
          />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      width: 100,
      render: (_, record) => (
        <button
          tabIndex={-1}
          className='btn btn-sm text-xs text-white bg-red-500 hover:bg-red-600  '
          onClick={() => handleDeleteProductDiscount(record.productId)}
        >
          Delete
        </button>
      ),
    },
  ]

  const handleEditProductDiscount = (
    key: number,
    field: string,
    value: any
  ) => {
    const updatedProductDiscounts = productDiscounts.map((item) => {
      if (item.productId === key) {
        return { ...item, [field]: value }
      }
      return item
    })
    setProductDiscounts(updatedProductDiscounts)
  }

  const handleDeleteProductDiscount = (productId: number) => {
    form.setFieldValue(`discountPercentage_${productId}`, undefined)
    const updatedProductDiscounts = productDiscounts.filter(
      (item) => item.productId !== productId
    )
    setProductDiscounts(updatedProductDiscounts)
  }

  const handleAddDiscount = () => {
    form.resetFields()
    form.setFieldValue('isActive', true)
    setEditingDiscount(null)
    setProductDiscounts([])
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (productDiscounts.length === 0) {
      showToast.error('Product Discount is required')
      return
    }
    const newDiscount: Discount = {
      name: values.name,
      startDate: dayjs(values.startDate).format(VITE_DATE_FORMAT_API),
      endDate: dayjs(values.endDate).format(VITE_DATE_FORMAT_API),
      isActive: values.isActive,
      productDiscounts: productDiscounts.map((item) => ({
        productId: item.productId,
        discountPercentage: item.discountPercentage,
      })) as ProductDiscount[],
    } as Discount
    try {
      if (!editingDiscount) {
        await createDiscount(newDiscount).unwrap()
        showToast.success('Discount created successfully')
      } else {
        await updateDiscount({
          id: editingDiscount.id,
          discount: newDiscount,
        }).unwrap()
        showToast.success('Discount updated successfully')
      }
      setIsModalOpen(false)
      form.resetFields()
      setProductDiscounts([])
      setEditingDiscount(null)
    } catch (error: any) {
      showToast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddProductDiscount = (product: Product) => {
    const findProduct = productDiscounts.find(
      (item) => item.productId === product.id
    )
    if (findProduct) {
      showToast.error('Product already exists')
      return
    }
    setProductDiscounts([
      {
        productId: product.id,
        product: product,
      } as ProductDiscount,
      ...productDiscounts,
    ])
  }

  const handleEditDiscount = (discount: Discount) => {
    discount.productDiscounts.forEach((item) => {
      form.setFieldValue(
        `discountPercentage_${item.productId}`,
        item.discountPercentage
      )
    })
    form.setFieldValue('name', discount.name)
    form.setFieldValue(
      'startDate',
      dayjs(discount.startDate, VITE_DATE_FORMAT_API)
    )
    form.setFieldValue('endDate', dayjs(discount.endDate, VITE_DATE_FORMAT_API))
    form.setFieldValue('isActive', discount.isActive)
    setEditingDiscount(discount)
    setProductDiscounts(discount.productDiscounts)
    setIsModalOpen(true)
  }

  const handleDeleteDiscount = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this discount?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteDiscount(id).unwrap()
          showToast.success('Discount deleted successfully')
        } catch (error: any) {
          showToast.error(error?.data?.message || 'Something went wrong')
        }
      },
    })
  }

  return (
    <div className='w-full flex flex-col gap-4 p-4'>
      <button
        className='btn btn-primary btn-sm w-fit'
        onClick={handleAddDiscount}
      >
        + Create Discount
      </button>
      <Table
        dataSource={data?.data || []}
        columns={columns}
        loading={isLoadingDiscounts || isFetchingDiscounts}
      />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        centered
      >
        <div className='bg-white p-4 rounded-lg'>
          <h2 className='text-2xl font-bold mb-4 text-primary'>
            {editingDiscount ? 'Edit Discount' : 'Create Discount'}
          </h2>
          <Form
            form={form}
            layout='vertical'
            className='space-y-2 overflow-y-auto max-h-[600px] px-5 py-2'
          >
            <Form.Item
              label='Name'
              name='name'
              rules={[{ required: true, message: 'Name is required' }]}
              className='my-2'
            >
              <Input />
            </Form.Item>
            <Form.Item label='Active' name='isActive'>
              <Switch className='my-2' />
            </Form.Item>
            <div className=' md:grid md:grid-cols-2 gap-2'>
              <Form.Item
                label='Start Date'
                name='startDate'
                className='my-2'
                getValueProps={(value) => {
                  return {
                    value: value ? dayjs(value, VITE_DATE_FORMAT_API) : null,
                  }
                }}
                rules={[
                  { required: true, message: 'Start Date is required' },
                  {
                    validator: (_, value) => {
                      if (value && value >= form.getFieldValue('endDate')) {
                        return Promise.reject(
                          'Start Date must be before End Date'
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  className='w-full'
                  format={VITE_DATE_FORMAT_DISPLAY_TIME}
                />
              </Form.Item>
              <Form.Item
                label='End Date'
                name='endDate'
                className='my-2'
                getValueProps={(value) => {
                  return {
                    value: value ? dayjs(value, VITE_DATE_FORMAT_API) : null,
                  }
                }}
                rules={[
                  { required: true, message: 'End Date is required' },
                  {
                    validator: (_, value) => {
                      if (value && value <= form.getFieldValue('startDate')) {
                        return Promise.reject(
                          'End Date must be after Start Date'
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  className='w-full'
                  format={VITE_DATE_FORMAT_DISPLAY_TIME}
                />
              </Form.Item>
            </div>
            <Form.Item label='Select Product'>
              <Select
                onChange={(value) => {
                  const product = products?.data?.find((p) => p.id === value)
                  if (product) handleAddProductDiscount(product)
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
                  <Select.Option
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
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Table
              dataSource={productDiscounts}
              columns={productDiscountColumns}
              rowKey={(record) => record.productId}
              pagination={false}
              scroll={{ y: 180, x: 'max-content' }}
            />
          </Form>
          <div className='flex justify-end space-x-4 mt-2'>
            <Button
              onClick={() => setIsModalOpen(false)}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              loading={isLoadingCreateDiscount || isLoadingUpdateDiscount}
              onClick={handleOk}
              type='primary'
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
            >
              {editingDiscount ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export { AdminDiscount }
