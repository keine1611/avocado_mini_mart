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
} from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload'
import { Brand } from '@/types'
import {
  useGetAllBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '@/services/brand'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { stringToDateTime } from '@/utils'

const { Option } = Select

const AdminBrand: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  let searchInput: InputRef | null = null
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const { data, error, isLoading } = useGetAllBrandQuery()
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation()
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation()
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation()

  const handleCreate = () => {
    setEditingBrand(null)
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    form.setFieldsValue(brand)
    setFileList(
      brand.logo
        ? [{ uid: '-1', name: 'logo', status: 'done', url: brand.logo }]
        : []
    )
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteBrand(id).unwrap()
      message.success(response.message)
    } catch (err: any) {
      message.error(err.data?.message || 'Failed to delete brand')
    }
  }

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
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
        const formData = new FormData()

        Object.keys(values).forEach((key) => {
          if (key === 'logo') {
            if (fileList.length > 0 && fileList[0].originFileObj) {
              formData.append('logo', fileList[0].originFileObj)
            }
          } else {
            if (values[key]) {
              formData.append(key, values[key])
            }
          }
        })

        if (editingBrand) {
          await updateBrand({
            id: editingBrand.id,
            data: formData,
          }).unwrap()
          message.success('Brand updated successfully')
        } else {
          await createBrand(formData).unwrap()
          message.success('Brand created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
        setFileList([])
      } catch (err: any) {
        message.error(err.data?.message || 'Failed to save brand')
      }
    })
  }

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
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
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100)
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>
          {text ? text.toString() : ''}
        </span>
      ) : (
        text
      ),
  })

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

  const columns: TableProps<Brand>['columns'] = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => (
        <img
          src={logo}
          alt='Brand Logo'
          className='w-12 h-12 object-cover rounded-full'
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      sorter: (a, b) => a.slug.localeCompare(b.slug),
      ...getColumnSearchProps('slug'),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => stringToDateTime(text),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => stringToDateTime(text),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleEdit(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => confirmDelete(record.id)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button
        icon={<PlusOutlined />}
        onClick={handleCreate}
        className='mb-4 bg-primary text-white rounded-md hover:bg-primary-dark px-4 py-2'
      >
        Add Brand
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading}
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: 'max-content' }}
      />
      <Modal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        className='custom-modal'
        footer={null}
        centered
      >
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingBrand ? 'Edit Brand' : 'Create Brand'}
          </h2>
          <Form form={form} layout='vertical' className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                name='name'
                label='Name'
                rules={[{ required: true, message: 'Please enter a name' }]}
              >
                <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
              </Form.Item>
              <Form.Item
                name='code'
                label='Code'
                rules={[{ required: true, message: 'Please enter a code' }]}
              >
                <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
              </Form.Item>
            </div>
            <Form.Item name='slug' label='Slug'>
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item name='description' label='Description'>
              <Input.TextArea
                className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                rows={4}
              />
            </Form.Item>
            <Form.Item name='logo' label='Logo'>
              <Upload
                listType='picture-card'
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept='image/*'
                maxCount={1}
                onPreview={handlePreview}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalOk}
                type='primary'
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
                loading={isCreating || isUpdating}
              >
                {editingBrand ? 'Update' : 'Create'}
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
    </div>
  )
}

export { AdminBrand }
