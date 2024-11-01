import React, { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  TableProps,
  Space,
  InputRef,
} from 'antd'
import { SubCategory, MainCategory } from '@/types'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  useGetAllSubCategoryQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from '@/services'
import { useGetAllMainCategoryQuery } from '@/services'
import { loadingActions, useAppDispatch } from '@/store'

const AdminSubCategory: React.FC = () => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null)
  const [searchedColumn, setSearchedColumn] = useState('')
  let searchInput: InputRef | null = null
  const { data, isLoading } = useGetAllSubCategoryQuery()
  const { data: mainCategories, isLoading: isLoadingMainCategory } =
    useGetAllMainCategoryQuery()
  const [createSubCategory, { isLoading: isLoadingCreateSubCategory }] =
    useCreateSubCategoryMutation()
  const [updateSubCategory, { isLoading: isLoadingUpdateSubCategory }] =
    useUpdateSubCategoryMutation()
  const [deleteSubCategory, { isLoading: isLoadingDeleteSubCategory }] =
    useDeleteSubCategoryMutation()

  const handleCreate = () => {
    setEditingSubCategory(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: SubCategory) => {
    setEditingSubCategory(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    dispatch(loadingActions.setLoading(true))
    try {
      await deleteSubCategory(id).unwrap()
      message.success('Sub-category deleted successfully')
    } catch (error) {
      message.error('Failed to delete sub-category')
    }
    dispatch(loadingActions.setLoading(false))
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingSubCategory) {
          await updateSubCategory({
            ...values,
            id: editingSubCategory.id,
          }).unwrap()
          message.success('Sub-category updated successfully')
        } else {
          await createSubCategory(values).unwrap()
          message.success('Sub-category created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
      } catch (error: any) {
        message.error(error.data.message || 'Failed to save sub-category')
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

  const getColumnSearchProps = (
    dataIndex: string,
    isSelect: boolean = false,
    options: MainCategory[] = []
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
            placeholder={`Select ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
          >
            {options.map((option) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
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
        )}
        <Button
          type='primary'
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90, marginRight: 8 }}
        />
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
        ? record[dataIndex]?.id === value
        : record[dataIndex]
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

  const columns: TableProps<SubCategory>['columns'] = [
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
      sorter: (a, b) => a.slug.localeCompare(b.slug),
    },
    {
      title: 'Main Category',
      dataIndex: ['mainCategory', 'name'],
      key: 'mainCategory',
      ...getColumnSearchProps('mainCategory', true, mainCategories?.data || []),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space direction='horizontal'>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          ></Button>
        </Space>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button icon={<PlusOutlined />} onClick={handleCreate} className='mb-4'>
        Add Sub-Category
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading && isLoadingMainCategory}
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: 'max-content' }}
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
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingSubCategory ? 'Edit Sub-Category' : 'Create Sub-Category'}
          </h2>
          <Form form={form} layout='vertical'>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                name='name'
                label='Name'
                rules={[{ required: true, message: 'Please input the name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='slug'
                label='Slug'
                rules={[{ required: false, message: 'Please input the slug!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='mainCategoryId'
                label='Main Category'
                rules={[
                  { required: true, message: 'Please select a main category!' },
                ]}
              >
                <Select>
                  {mainCategories?.data.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
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
                loading={
                  isLoadingCreateSubCategory || isLoadingUpdateSubCategory
                }
              >
                {editingSubCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export { AdminSubCategory }
