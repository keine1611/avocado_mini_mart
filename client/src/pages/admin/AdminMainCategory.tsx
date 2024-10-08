import React, { useState } from 'react'
import {
  Table,
  TableProps,
  Button,
  Modal,
  Form,
  Input,
  message,
  InputRef,
} from 'antd'
import { MainCategory } from '@/types'
import {
  useGetAllMainCategoryQuery,
  useCreateMainCategoryMutation,
  useUpdateMainCategoryMutation,
  useDeleteMainCategoryMutation,
} from '@/services'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'

const AdminMainCategory: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMainCategory, setEditingMainCategory] =
    useState<MainCategory | null>(null)
  const [searchedColumn, setSearchedColumn] = useState('')
  let searchInput: InputRef | null = null

  const { data, error, isLoading } = useGetAllMainCategoryQuery()
  const [createMainCategory, { isLoading: isCreating }] =
    useCreateMainCategoryMutation()
  const [updateMainCategory, { isLoading: isUpdating }] =
    useUpdateMainCategoryMutation()
  const [deleteMainCategory, { isLoading: isDeleting }] =
    useDeleteMainCategoryMutation()

  const handleCreate = () => {
    setEditingMainCategory(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (mainCategory: MainCategory) => {
    setEditingMainCategory(mainCategory)
    form.setFieldsValue(mainCategory)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMainCategory(id).unwrap()
      message.success('Main Category deleted successfully')
    } catch (err) {
      message.error('Failed to delete Main Category')
    }
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingMainCategory) {
          await updateMainCategory({
            id: editingMainCategory.id,
            ...values,
          }).unwrap()
          message.success('Main Category updated successfully')
        } else {
          await createMainCategory(values).unwrap()
          message.success('Main Category created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
      } catch (err: any) {
        message.error(err.data?.message)
      }
    })
  }

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm()
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
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
    onFilterDropdownVisibleChange: (visible: any) => {
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

  const columns: TableProps<MainCategory>['columns'] = [
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
      ...getColumnSearchProps('slug'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </div>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button icon={<PlusOutlined />} onClick={handleCreate} className='mb-4'>
        Add Main Category
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
        width={600}
        className='custom-modal'
        footer={null}
        centered
      >
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingMainCategory
              ? 'Edit Main Category'
              : 'Create Main Category'}
          </h2>
          <Form form={form} layout='vertical' className='space-y-4'>
            <Form.Item
              name='name'
              label='Name'
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item name='slug' label='Slug'>
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
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
                {editingMainCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export { AdminMainCategory }
