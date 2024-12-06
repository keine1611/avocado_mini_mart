import React, { useState } from 'react'
import {
  Table,
  TableProps,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  InputRef,
  Select,
  Tag,
} from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload'
import { Product, SubCategory } from '@/types'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllSubCategoryQuery,
  useGetAllBrandQuery,
  useGetAllProductWithoutPaginationQuery,
} from '@/services'
import { statusProduct } from '@/enum'

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { stringToDateTime, formatCurrency } from '@/utils'
import { ProductViewModal } from '@/components'

const { Option } = Select

const AdminProduct: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [mainImage, setMainImage] = useState<UploadFile | null>(null)

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  let searchInput: InputRef | null = null

  const {
    data,
    isLoading: isLoadingAllProduct,
    isFetching: isFetchingAllProduct,
  } = useGetAllProductWithoutPaginationQuery()
  const [createProduct, { isLoading: isLoadingCreateProduct }] =
    useCreateProductMutation()
  const [updateProduct, { isLoading: isLoadingUpdateProduct }] =
    useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const { data: subCategoriesData, isLoading: isLoadingSubCategory } =
    useGetAllSubCategoryQuery()
  const { data: brandsData, isLoading: isLoadingBrand } = useGetAllBrandQuery()

  const handleView = (product: Product) => {
    setViewProduct(product)
    setIsViewModalVisible(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setMainImage(null)
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      ...product,
      brandId: product.brandId,
      subCategoryId: product.subCategoryId,
    })
    setFileList(
      product.productImages
        ? product.productImages.map((image, index) => ({
            uid: image.id.toString(),
            name: `image-${index}`,
            status: 'done',
            url: image.url,
            thumbUrl: image.url,
          }))
        : []
    )
    setMainImage({
      uid: product.mainImage,
      name: 'main',
      status: 'done',
      url: product.mainImage,
      thumbUrl: product.mainImage,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteProduct(Number(id)).unwrap()
          message.success('Product deleted successfully')
        } catch (err) {
          message.error('Failed to delete product')
        }
      },
    })
  }

  const handleImageDelete = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid)
    setFileList(newFileList)

    if (file.uid.toString().match(/^\d+$/)) {
      form.setFieldsValue({
        imagesToDelete: [
          ...(form.getFieldValue('imagesToDelete') || []),
          file.uid,
        ],
      })
    }
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
          if (key === 'mainImage') {
            if (mainImage?.originFileObj) {
              formData.append('mainImage', mainImage.originFileObj)
            }
          } else if (key === 'images') {
            fileList.forEach((file) => {
              if (file.originFileObj) {
                formData.append(`images`, file.originFileObj)
              }
            })
          } else if (key === 'imagesToDelete' && editingProduct) {
            formData.append('imagesToDelete', JSON.stringify(values[key] || []))
          } else {
            formData.append(key, values[key])
          }
        })

        if (editingProduct) {
          await updateProduct({
            id: Number(editingProduct.id),
            data: formData,
          }).unwrap()
          message.success('Product updated successfully')
        } else {
          await createProduct(formData).unwrap()
          message.success('Product created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
        setFileList([])
        setMainImage(null)
      } catch (err: any) {
        message.error(err.data.message || 'Failed to save product')
      }
    })
  }

  const handleSearch = (confirm: any) => {
    confirm()
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
  }

  const getColumnSearchProps = (
    title: string,
    dataIndex: string,
    isSelect: boolean = false,
    options: any[] = []
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
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            placeholder={`Select ${title}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
          >
            {options.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Input
            ref={(node) => {
              searchInput = node
            }}
            placeholder={`Search ${title}`}
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
    onFilter: (value: any, record: any) => {
      const recordValue = record[dataIndex]
      return isSelect
        ? Number(recordValue) === Number(value)
        : record?.toString().toLowerCase().includes(value.toLowerCase()) || ''
    },
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100)
      }
    },
  })

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Image',
      dataIndex: 'mainImage',
      key: 'mainImage',
      render: (url: string) => (
        <img src={url} alt='product' className='w-16 h-16 object-contain' />
      ),
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('Name', 'name'),
      render: (text: string) =>
        text.length > 30 ? `${text.slice(0, 30)}...` : text,
      width: 290,
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      ...getColumnSearchProps('Barcode', 'barcode'),
    },
    {
      title: 'Standard Price',
      dataIndex: 'standardPrice',
      key: 'standardPrice',
      sorter: (a, b) => a.standardPrice - b.standardPrice,
      render: (price: number) => formatCurrency(price),
      width: 170,
    },
    {
      title: 'Brand',
      dataIndex: 'brandId',
      key: 'brandId',
      ...getColumnSearchProps('Brand', 'brandId', true, brandsData?.data || []),
      render: (id: number) => {
        const name = brandsData?.data.find((brand) => brand.id === id)?.name
        return name
      },
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategoryId',
      key: 'subCategoryId',
      ...getColumnSearchProps(
        'Sub Category',
        'subCategoryId',
        true,
        subCategoriesData?.data || []
      ),
      render: (id: number) => {
        const name = subCategoriesData?.data.find(
          (subCategory) => subCategory.id === id
        )?.name
        return name
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) =>
        text === statusProduct.ACTIVE ? (
          <Tag color='green'>Active</Tag>
        ) : (
          <Tag color='red'>Inactive</Tag>
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any) => stringToDateTime(text),
      sorter: (a, b) => Number(a.createdAt) - Number(b.createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: any) => stringToDateTime(text),
      sorter: (a, b) => Number(a.updatedAt) - Number(b.updatedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleView(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EyeOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleEdit(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleDelete(record.id.toString())}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewVisible(true)
  }

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button icon={<PlusOutlined />} onClick={handleCreate} className='mb-4'>
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={
          isLoadingAllProduct ||
          isFetchingAllProduct ||
          isLoadingSubCategory ||
          isLoadingBrand
        }
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
      />
      <Modal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        className='custom-modal'
        footer={null}
        centered
      >
        <div className='bg-white'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <Form
            form={form}
            layout='vertical'
            className='space-y-4 overflow-y-auto max-h-[600px] px-5'
          >
            <Form.Item
              name='mainImage'
              label='Main Image'
              rules={[{ required: true, message: 'Please enter a main image' }]}
            >
              <div className='flex items-center gap-2 justify-center'>
                <Upload
                  listType='picture-circle'
                  fileList={mainImage ? [mainImage] : []}
                  onChange={({ fileList }) => setMainImage(fileList[0])}
                  beforeUpload={() => false}
                  accept='image/*'
                  maxCount={1}
                  className='upload-list-inline'
                >
                  {mainImage ? null : (
                    <div className='flex flex-col items-center justify-center'>
                      <PlusOutlined className='text-2xl text-primary' />
                      <div className='mt-2'>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>
            </Form.Item>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                name='name'
                label='Name'
                rules={[{ required: true, message: 'Please enter a name' }]}
              >
                <Input className='w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
              </Form.Item>
              <Form.Item
                name='barcode'
                label='Barcode'
                rules={[{ required: true, message: 'Please enter a barcode' }]}
              >
                <Input className='w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
              </Form.Item>
            </div>
            <Form.Item name='description' label='Description'>
              <Input.TextArea
                className='w-full  h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                rows={4}
              />
            </Form.Item>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                name='standardPrice'
                label='Standard Price'
                rules={[
                  { required: true, message: 'Please enter a standard price' },

                  {
                    validator: (_, value) => {
                      if (value <= 0) {
                        return Promise.reject('Price must be greater than 0')
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  type='number'
                  className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  prefix='$'
                  step='0.01'
                />
              </Form.Item>
              <Form.Item
                name='status'
                label='Status'
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select className='w-full h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'>
                  {Object.values(statusProduct).map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                name='brandId'
                label='Brand'
                rules={[{ required: true, message: 'Please select a brand' }]}
              >
                <Select
                  showSearch
                  className='w-full h-10'
                  placeholder='Search to Select Brand'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {brandsData?.data.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name='subCategoryId'
                label='Sub Category'
                rules={[
                  { required: true, message: 'Please select a sub category' },
                ]}
              >
                <Select
                  showSearch
                  className='w-full h-10'
                  placeholder='Search to Select Sub Category'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {subCategoriesData?.data.map((subCategory: SubCategory) => (
                    <Option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item name='images' label='Images'>
              <Upload
                listType='picture-card'
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept='image/*'
                multiple
                onPreview={handlePreview}
                onRemove={handleImageDelete}
                className='upload-list-inline'
              >
                {fileList.length >= 8 ? null : (
                  <div className='flex flex-col items-center justify-center'>
                    <PlusOutlined className='text-2xl text-primary' />
                    <div className='mt-2'>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            {editingProduct && (
              <Form.Item name='imagesToDelete' hidden>
                <Input type='hidden' />
              </Form.Item>
            )}
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              <Button
                loading={isLoadingCreateProduct || isLoadingUpdateProduct}
                onClick={handleModalOk}
                type='primary'
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
                disabled={isLoadingCreateProduct || isLoadingUpdateProduct}
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt='preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <ProductViewModal
        visible={isViewModalVisible}
        product={viewProduct}
        onClose={() => setIsViewModalVisible(false)}
      />
    </div>
  )
}

export { AdminProduct }
